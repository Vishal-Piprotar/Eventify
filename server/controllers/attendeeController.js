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
      'X-Attandee-Id': attendeeId,
    },
  };
};

// ===============================
// Register Attendee
// ===============================
export const registerAttendee = async (req, res) => {
  try {
    const { name, email, eventId } = req.body;
    const userId = req.headers['x-user-id'] || req.user?.id;

    if (!userId) return res.status(401).json({ error: 'Unauthorized', message: 'User ID required' });
    if (!name || !email || !eventId) {
      return res.status(400).json({ error: 'Bad Request', message: 'name, email, and eventId are required' });
    }

    const attendeeData = { name, email, eventId };
    const response = await axios.post(getSfApiBaseUrl(), attendeeData, getAuthHeader(userId));

    const resultData = typeof response.data.data === 'string'
      ? JSON.parse(response.data.data)
      : response.data.data;

    res.status(201).json({
      success: true,
      message: response.data.message || 'Attendee registered successfully',
      data: { id: resultData.attendeeId, name, email, eventId, userId },
    });
  } catch (error) {
    const status = error.response?.status || 500;
    const message = error.response?.data?.message || error.message;

    console.error('Attendee registration error:', message);
    res.status(status).json({
      error: status === 409 ? 'Already Registered' : 'Registration Failed',
      message,
    });
  }
};

// ===============================
// Get Attendees by Event
// ===============================
export const getEventAttendees = async (req, res) => {
  try {
    const eventId = req.params.eventId;
    if (!eventId) return res.status(400).json({ error: 'Bad Request', message: 'Event ID is required' });

    const headers = {
      'Authorization': `Bearer ${conn.get().accessToken}`,
      'Content-Type': 'application/json',
    };

    const response = await axios.get(`${getSfApiBaseUrl()}/${eventId}`, { headers });
    const attendees = typeof response.data.data === 'string'
      ? JSON.parse(response.data.data)
      : response.data.data;

    res.status(200).json({
      success: true,
      message: 'Attendees retrieved successfully',
      data: { total: attendees.length, attendees },
    });
  } catch (error) {
    console.error('Get attendees error:', error.message);
    res.status(error.response?.status || 500).json({ error: 'Fetch Failed', message: error.message });
  }
};

// ===============================
// Cancel Attendee Registration
// ===============================
export const cancelAttendee = async (req, res) => {
  try {
    const userId = req.headers['x-user-id'] || req.user?.id;
    const attendeeId = req.params.attendeeId;
    if (!userId || !attendeeId) {
      return res.status(400).json({ error: 'Bad Request', message: 'User ID and Attendee ID are required' });
    }

    const response = await axios.put(`${getSfApiBaseUrl()}/${attendeeId}`, {}, getAuthHeader(userId));

    res.status(200).json({
      success: true,
      message: response.data.message || 'Attendee registration cancelled successfully',
    });
  } catch (error) {
    console.error('Cancel registration error:', error.message);
    res.status(error.response?.status || 500).json({ error: 'Cancel Failed', message: error.message });
  }
};

// ===============================
// Delete Attendee (Admin)
//—===============================
export const deleteAttendee = async (req, res) => {
  try {
    const attendeeId = req.params.attendeeId;
    if (!attendeeId) return res.status(400).json({ error: 'Bad Request', message: 'Attendee ID is required' });

    const response = await axios.delete(getSfApiBaseUrl(), getDeleteHeader(attendeeId));

    res.status(200).json({
      success: true,
      message: response.data.message || 'Attendee deleted successfully',
      data: { id: attendeeId },
    });
  } catch (error) {
    console.error('Delete attendee error:', error.message);
    res.status(error.response?.status || 500).json({ error: 'Deletion Failed', message: error.message });
  }
};

// ===============================
// Optional: Get My Registered Events
// ===============================
export const getMyAttendees = async (req, res) => {
  try {
    const userId = req.headers['x-user-id'] || req.user?.id;
    if (!userId) return res.status(401).json({ error: 'Unauthorized', message: 'User ID required' });

    const response = await axios.get(`${getSfApiBaseUrl()}/my`, getAuthHeader(userId));
    const attendees = typeof response.data.data === 'string'
      ? JSON.parse(response.data.data)
      : response.data.data;

    res.status(200).json({
      success: true,
      message: 'Your registrations retrieved successfully',
      data: attendees,
    });
  } catch (error) {
    console.error('Get my attendees error:', error.message);
    res.status(error.response?.status || 500).json({ error: 'Fetch Failed', message: error.message });
  }
};

export default {
  registerAttendee,
  getEventAttendees,
  cancelAttendee,
  deleteAttendee,
  getMyAttendees,
};
