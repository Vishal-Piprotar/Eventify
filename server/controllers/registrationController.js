// controllers/registrationController.js
import axios from 'axios';
import conn from '../config/salesforce.js';

// Base URL for Salesforce REST API registration endpoint
const getSfApiBaseUrl = () => `${conn.get().instanceUrl}/services/apexrest/eventregister`;

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

// Register a user for an event
export const registerForEvent = async (req, res) => {
  try {
    const { name, email } = req.body;
    const userId = req.headers['x-user-id'] || req.user.id;
    const eventId = req.params.id;

    // Authentication check
    if (!req.user) {
      return res.status(401).json({ 
        error: 'Unauthorized',
        message: 'User must be authenticated to register for an event' 
      });
    }

    // Input validation
    if (!name || !email || !eventId) {
      return res.status(400).json({ 
        error: 'Bad Request',
        message: 'Name, email, and eventId are required' 
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ 
        error: 'Invalid Email',
        message: 'Please provide a valid email address' 
      });
    }

    const registrationData = {
      Name: name,
      email,
      eventId,
      OwnerId: userId,
    };

    const response = await axios.post(
      getSfApiBaseUrl(),
      registrationData,
      getAuthHeader(userId)
    );

    // Check Salesforce API response
    if (response.data.statusCode !== 201) {
      return res.status(response.data.statusCode || 400).json({ 
        error: 'Registration Failed',
        message: response.data.message || 'Failed to register for event in Salesforce' 
      });
    }

    const responseData = typeof response.data.data === 'string'
      ? JSON.parse(response.data.data)
      : response.data.data;

    res.status(201).json({
      success: true,
      message: 'Successfully registered for the event',
      data: {
        attendeeId: responseData?.attendeeId,
        eventId,
        userId,
        name,
        email,
      },
    });
  } catch (error) {
    console.error('Event registration error:', {
      message: error.message,
      stack: error.stack,
      response: error.response?.data,
    });

    const status = error.response?.status || 500;
    res.status(status).json({
      error: status === 500 ? 'Server Error' : 'Registration Failed',
      message: error.response?.data?.message || error.message || 'Failed to register for event',
    });
  }
};

// Get all attendees for a specific event
// export const getEventAttendees = async (req, res) => {
//   try {
//     const userId = req.headers['x-user-id'] || req.user.id;
//     const eventId = req.params.id;

//     if (!req.user) {
//       return res.status(401).json({ 
//         error: 'Unauthorized',
//         message: 'User must be authenticated to view attendees' 
//       });
//     }

//     if (!eventId) {
//       return res.status(400).json({ 
//         error: 'Bad Request',
//         message: 'Event ID is required' 
//       });
//     }

//     const response = await axios.get(
//       `${getSfApiBaseUrl()}/${eventId}`,
//       getAuthHeader(userId)
//     );

//     // If Salesforce returns a 404, treat it as "no attendees" rather than an error
//     let attendees = [];
//     if (response.data.statusCode === 404) {
//       // No attendees found, return empty array
//       attendees = [];
//     } else if (response.data.statusCode !== 200) {
//       throw new Error(response.data.message || 'Failed to fetch attendees');
//     } else {
//       attendees = typeof response.data.data === 'string'
//         ? JSON.parse(response.data.data)
//         : response.data.data;
//     }

//     const formattedAttendees = attendees.map(attendee => ({
//       id: attendee.Id || attendee.attendeeId,
//       name: attendee.Name,
//       email: attendee.email,
//       eventId: attendee.eventId,
//       registeredBy: attendee.OwnerId,
//       registrationDate: attendee.CreatedDate || new Date().toISOString(),
//     }));

//     res.status(200).json({
//       success: true,
//       message: 'Successfully retrieved event attendees',
//       data: {
//         eventId,
//         total: formattedAttendees.length,
//         attendees: formattedAttendees,
//       },
//     });
//   } catch (error) {
//     console.error('Get attendees error:', {
//       message: error.message,
//       stack: error.stack,
//       response: error.response?.data,
//     });

//     // Only throw a real error for unexpected cases (not 404)
//     const status = error.response?.status || 500;
//     if (status === 404) {
//       res.status(200).json({
//         success: true,
//         message: 'No attendees found for this event',
//         data: {
//           eventId: req.params.id,
//           total: 0,
//           attendees: [],
//         },
//       });
//     } else {
//       res.status(status).json({
//         error: status === 500 ? 'Server Error' : 'Fetch Failed',
//         message: error.response?.data?.message || error.message || 'Failed to fetch attendees',
//       });
//     }
//   }
// };

// export default {
//   registerForEvent,
//   getEventAttendees,
// };

export const getEventAttendees = async (req, res) => {
  try {
    const eventId = req.params.id;

    if (!eventId) {
      return res.status(400).json({ 
        error: 'Bad Request',
        message: 'Event ID is required' 
      });
    }

    // Public access header - no user authentication required
    const headers = {
      'Authorization': `Bearer ${conn.get().accessToken}`,
      'Content-Type': 'application/json',
    };

    // Add your logic to fetch attendees from Salesforce
    const response = await axios.get(
      `${getSfApiBaseUrl()}/${eventId}/attendees`, 
      { headers }
    );

    if (response.data.statusCode !== 200) {
      return res.status(response.data.statusCode || 400).json({ 
        error: 'Fetch Failed',
        message: response.data.message || 'Failed to fetch attendees from Salesforce' 
      });
    }

    const attendeesData = typeof response.data.data === 'string'
      ? JSON.parse(response.data.data)
      : response.data.data;

    res.status(200).json({
      success: true,
      message: 'Attendees retrieved successfully',
      data: {
        total: attendeesData.length,
        attendees: attendeesData,
      },
    });
  } catch (error) {
    console.error('Get attendees error:', {
      message: error.message,
      stack: error.stack,
      response: error.response?.data,
    });

    const status = error.response?.status || 500;
    res.status(status).json({
      error: status === 500 ? 'Server Error' : 'Fetch Failed',
      message: error.response?.data?.message || error.message || 'Failed to fetch attendees',
    });
  }
};