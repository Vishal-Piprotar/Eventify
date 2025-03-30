import conn from "../config/salesforce.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import axios from 'axios';

export const register = async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    const validRoles = ["Admin", "Attandee", "Organizer"];
    if (!validRoles.includes(role)) {
      return res.status(400).json({ error: "Invalid role" });
    }

    const existingUser = await conn
      .get()
      .sobject("Custom_Users__c")
      .findOne({ Email__c: email }, "Id");
    if (existingUser) {
      return res.status(400).json({ error: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const sfUser = await conn.get().sobject("Custom_Users__c").create({
      Name: name,
      Email__c: email,
      Password__c: hashedPassword,
      Role__c: role,
    });

    const token = jwt.sign(
      { id: sfUser.id, email, role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(201).json({
      token,
      user: { id: sfUser.id, name, email, role },
    });
  } catch (error) {
    console.error("Registration error:", error.message);
    res.status(500).json({ error: "Registration failed" });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const result = await conn
      .get()
      .sobject("Custom_Users__c")
      .findOne({ Email__c: email }, "Id, Name, Email__c, Role__c, Password__c");

    if (!result) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, result.Password__c);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const token = jwt.sign(
      { id: result.Id, email: result.Email__c, role: result.Role__c },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({
      token,
      user: {
        id: result.Id,
        name: result.Name,
        email: result.Email__c,
        role: result.Role__c,
      },
    });
  } catch (error) {
    console.error("Login error:", error.message);
    res.status(500).json({ error: "Login failed" });
  }
};


// Base URL for Salesforce REST API profile endpoint
const getSfApiBaseUrl = () => `${conn.get().instanceUrl}/services/apexrest/profile`;


// Helper function to generate auth headers
const getAuthHeader = (userId) => {
  if (!userId) {
    throw new Error('User ID is required');
  }
  return {
    headers: {
      'Authorization': `Bearer ${conn.get().accessToken}`,
      'Content-Type': 'application/json',
      'X-User-Id': userId,
    },
  };
};


export const getProfile = async (req, res) => {
  try {
    const userId = req.headers['x-user-id'] || req.user.id;
    if (!req.user) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'User must be authenticated to access profile',
      });
    }

    const response = await axios.get(getSfApiBaseUrl(), getAuthHeader(userId));

    if (response.data.statusCode !== 200) {
      return res.status(response.data.statusCode || 400).json({
        error: 'Fetch Failed',
        message: response.data.message || 'Failed to fetch profile from Salesforce',
      });
    }

    const profileData = typeof response.data.data === 'string'
      ? JSON.parse(response.data.data)
      : response.data.data;

    res.status(200).json({
      success: true,
      message: 'Profile retrieved successfully',
      data: profileData,
    });
  } catch (error) {
    console.error('Get profile error:', {
      message: error.message,
      stack: error.stack,
      response: error.response?.data,
    });

    const status = error.response?.status || 500;
    res.status(status).json({
      error: status === 500 ? 'Server Error' : 'Fetch Failed',
      message: error.response?.data?.message || error.message || 'Failed to fetch profile',
    });
  }
};
