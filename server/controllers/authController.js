import conn from "../config/salesforce.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import axios from "axios";

// Register user
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

// Login user
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

// Salesforce API base
const getSfApiBaseUrl = () => `${conn.get().instanceUrl}/services/apexrest/profile`;
const getAuthHeader = (userId) => ({
  headers: {
    'Authorization': `Bearer ${conn.get().accessToken}`,
    'Content-Type': 'application/json',
    'X-User-Id': userId,
  },
});

// Get Profile
export const getProfile = async (req, res) => {
  try {
    const userId = req.headers['x-user-id'] || req.user.id;

    const response = await axios.get(getSfApiBaseUrl(), getAuthHeader(userId));
    const profileData = typeof response.data.data === 'string'
      ? JSON.parse(response.data.data)
      : response.data.data;
      console.log(profileData);
      

    res.status(200).json({
      success: true,
      message: 'Profile retrieved successfully',
      data: profileData,
    });
  } catch (error) {
    console.error('Get profile error:', error.message);
    res.status(500).json({ error: "Failed to fetch profile" });
  }
};

// Edit Profile
export const editProfile = async (req, res) => {
  try {
    const userId = req.user?.id;
    const { name, email, role, phone } = req.body;
    const validRoles = ["Admin", "Attandee", "Organizer"];

    if (role && !validRoles.includes(role)) {
      return res.status(400).json({ error: "Invalid role" });
    }

    const updateFields = {};
    if (name) updateFields.Name = name;
    if (email) updateFields.Email__c = email;
    if (role) updateFields.Role__c = role;
    if (phone !== undefined) updateFields.Phone__c = phone;

    const response = await conn.get().sobject("Custom_Users__c").update({
      Id: userId,
      ...updateFields,
    });

    if (!response.success) {
      return res.status(400).json({ error: "Profile update failed" });
    }

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
    });
  } catch (error) {
    console.error("Edit profile error:", error.message);
    res.status(500).json({ error: "Server error" });
  }
};

// change password
export const changePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const userId = req.user?.id;

  if (!currentPassword || !newPassword) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const user = await conn.get().sobject("Custom_Users__c").findOne(
      { Id: userId },
      "Id, Password__c"
    );

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.Password__c);
    if (!isMatch) {
      return res.status(401).json({ error: "Current password is incorrect" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    const response = await conn.get().sobject("Custom_Users__c").update({
      Id: userId,
      Password__c: hashedPassword,
    });

    if (!response.success) {
      return res.status(500).json({ error: "Failed to update password" });
    }

    res.json({ success: true, message: "Password updated successfully" });
  } catch (err) {
    console.error("Change password error:", err.message);
    res.status(500).json({ error: "Server error" });
  }
};


export const deleteUser = async (req, res) => {
  const userId = req.user?.id;
  const force = req.query.force === 'true';

  if (!userId) {
    return res.status(400).json({ error: "User ID is required" });
  }

  try {
    // Check for attendee associations
    const attendees = await conn.get().sobject('Attandee__c')
      .find({ Custom_Users__c: userId })
      .limit(1);

    if (attendees.length && !force) {
      return res.status(409).json({
        success: false,
        message: "Account is linked with attendee records. Admin access required for force deletion."
      });
    }

    const result = await conn.get().sobject('Custom_Users__c').destroy(userId);

    if (result.success) {
      return res.status(200).json({ success: true, message: 'Account deleted successfully' });
    }

    throw new Error("Salesforce failed to delete user.");
  } catch (err) {
    console.error("Account delete error:", err.message);
    return res.status(500).json({ error: "Server error", details: err.message });
  }
};

