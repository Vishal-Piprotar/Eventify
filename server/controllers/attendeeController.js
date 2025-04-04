import axios from 'axios';
import conn from '../config/salesforce.js';

const getSfApiBaseUrl = () => `${conn.get().instanceUrl}/services/apexrest/eventregister`;

const getAuthHeader = (userId) => {
  if (!userId) throw new Error('User ID is required');
  return {
    headers: {
      'Authorization': `Bearer ${conn.get().accessToken}`,
      'Content-Type': 'application/json',
      'X-User-Id': userId,
    },
  };
};

const getDeleteHeader = (attendeeId) => {
  if (!attendeeId) throw new Error('Attendee ID is required');
  return {
    headers: {
      'Authorization': `Bearer ${conn.get().accessToken}`,
      'Content-Type': 'application/json',
      'X-Attandee-Id': attendeeId, // required by Salesforce delete logic
    },
  };
};

export const registerAttendee = async (req, res) => {
  try {
    const { name, email, eventId } = req.body;
    const userId = req.headers['x-user-id'] || req.user?.id;

    if (!userId) return res.status(401).json({ error: 'Unauthorized', message: 'User ID required' });
    if (!name || !email || !eventId) {
      return res.status(400).json({ error: 'Bad Request', message: 'name, email and eventId are required' });
    }

    const attendeeData = { Name: name, email, eventId };
    const response = await axios.post(getSfApiBaseUrl(), attendeeData, getAuthHeader(userId));

    if (response.data.statusCode !== 201) {
      return res.status(response.data.statusCode || 400).json({
        error: 'Registration Failed',
        message: response.data.message,
      });
    }

    const resultData = typeof response.data.data === 'string' ? JSON.parse(response.data.data) : response.data.data;

    res.status(201).json({
      success: true,
      message: response.data.message || 'Attendee registered successfully',
      data: { id: resultData.attendeeId, name, email, eventId, userId },
    });
  } catch (error) {
    console.error('Attendee registration error:', error);
    res.status(error.response?.status || 500).json({ error: 'Registration Failed', message: error.message });
  }
};

export const getEventAttendees = async (req, res) => {
  try {
    const eventId = req.params.eventId;

    if (!eventId) return res.status(400).json({ error: 'Bad Request', message: 'Event ID is required' });

    const headers = {
      'Authorization': `Bearer ${conn.get().accessToken}`,
      'Content-Type': 'application/json',
    };

    const response = await axios.get(`${getSfApiBaseUrl()}/${eventId}`, { headers });

    if (response.data.statusCode !== 200) {
      return res.status(response.data.statusCode || 400).json({ error: 'Fetch Failed', message: response.data.message });
    }

    const attendees = typeof response.data.data === 'string' ? JSON.parse(response.data.data) : response.data.data;

    res.status(200).json({
      success: true,
      message: 'Attendees retrieved successfully',
      data: { total: attendees.length, attendees },
    });
  } catch (error) {
    console.error('Get attendees error:', error);
    res.status(error.response?.status || 500).json({ error: 'Fetch Failed', message: error.message });
  }
};

export const cancelAttendee = async (req, res) => {
  try {
    const userId = req.headers['x-user-id'] || req.user?.id;
    const attendeeId = req.params.attendeeId;

    if (!userId || !attendeeId) {
      return res.status(400).json({ error: 'Bad Request', message: 'User ID and Attendee ID are required' });
    }

    const response = await axios.put(`${getSfApiBaseUrl()}/${attendeeId}`, {}, getAuthHeader(userId));

    if (response.data.statusCode !== 200) {
      return res.status(response.data.statusCode || 400).json({ error: 'Cancel Failed', message: response.data.message });
    }

    res.status(200).json({
      success: true,
      message: response.data.message || 'Attendee registration cancelled successfully',
    });
  } catch (error) {
    console.error('Cancel registration error:', error);
    res.status(error.response?.status || 500).json({ error: 'Cancel Failed', message: error.message });
  }
};

export const deleteAttendee = async (req, res) => {
  try {
    const attendeeId = req.params.attendeeId;
    if (!attendeeId) return res.status(400).json({ error: 'Bad Request', message: 'Attendee ID is required' });

    const response = await axios.delete(getSfApiBaseUrl(), getDeleteHeader(attendeeId));

    if (response.data.statusCode !== 200) {
      return res.status(response.data.statusCode || 400).json({ error: 'Deletion Failed', message: response.data.message });
    }

    res.status(200).json({
      success: true,
      message: response.data.message || 'Attendee deleted successfully',
      data: { id: attendeeId },
    });
  } catch (error) {
    console.error('Delete attendee error:', error);
    res.status(error.response?.status || 500).json({ error: 'Deletion Failed', message: error.message });
  }
};

export default {
  registerAttendee,
  getEventAttendees,
  cancelAttendee,
  deleteAttendee,
};
