// controllers/eventController.js
import axios from 'axios';
import conn from '../config/salesforce.js';

// Base URL for Salesforce REST API events endpoint
const getSfApiBaseUrl = () => `${conn.get().instanceUrl}/services/apexrest/events`;

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

// Create a new event
export const createEvent = async (req, res) => {
  try {
    const { name, startDate, endDate, description, status, capacity, location } = req.body;
    const userId = req.headers['x-user-id'] || req.user.id;

    // Authentication and authorization check
    if (!req.user) {
      return res.status(401).json({ 
        error: 'Unauthorized',
        message: 'User must be authenticated to create events' 
      });
    }
    if (req.user.role !== 'Organizer' && req.user.role !== 'Admin') {
      return res.status(403).json({ 
        error: 'Forbidden',
        message: 'Only Organizers and Admins can create events' 
      });
    }

    // Input validation
    if (!name || !startDate || !endDate) {
      return res.status(400).json({ 
        error: 'Bad Request',
        message: 'Name, startDate, and endDate are required' 
      });
    }

    const eventData = {
      name,
      startDate,
      endDate,
      description: description || '',
      status: status || 'Scheduled',
      capacity: capacity || null,
      location: location || 'Virtual',
    };

    const response = await axios.post(getSfApiBaseUrl(), eventData, getAuthHeader(userId));

    if (response.data.statusCode !== 201) {
      return res.status(response.data.statusCode || 400).json({ 
        error: 'Creation Failed',
        message: response.data.message || 'Failed to create event in Salesforce' 
      });
    }

    const responseData = typeof response.data.data === 'string'
      ? JSON.parse(response.data.data)
      : response.data.data;

    res.status(201).json({
      success: true,
      message: 'Event created successfully',
      data: {
        id: responseData.eventId,
        ...eventData,
        ownerId: userId,
        createdBy: userId,
      },
    });
  } catch( error) {
    console.error('Event creation error:', {
      message: error.message,
      stack: error.stack,
      response: error.response?.data,
    });

    const status = error.response?.status || 500;
    res.status(status).json({
      error: status === 500 ? 'Server Error' : 'Creation Failed',
      message: error.response?.data?.message || error.message || 'Failed to create event',
    });
  }
};

// Get all events
export const getEvents = async (req, res) => {
  try {
    const response = await axios.get(getSfApiBaseUrl(), {
      headers: {
        'Authorization': `Bearer ${conn.get().accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (response.data.statusCode !== 200) {
      return res.status(response.data.statusCode || 400).json({
        error: 'Fetch Failed',
        message: response.data.message || 'Failed to fetch events from Salesforce',
      });
    }

    const eventsData = typeof response.data.data === 'string'
      ? JSON.parse(response.data.data)
      : response.data.data;

    const formattedEvents = eventsData.map(event => ({
      id: event.Id,
      name: event.Name,
      startDate: event.startDate__c,
      endDate: event.endDate__c,
      description: event.Description__c || '',
      status: event.Status__c || 'Scheduled',
      capacity: event.Capacity__c || null,
      location: event.Location__c || 'Virtual',
    }));

    res.status(200).json({
      success: true,
      message: 'Events retrieved successfully',
      data: {
        total: formattedEvents.length,
        events: formattedEvents,
      },
    });
  } catch (error) {
    console.error('Get events error:', {
      message: error.message,
      stack: error.stack,
      response: error.response?.data,
    });

    const status = error.response?.status || 500;
    res.status(status).json({
      error: status === 500 ? 'Server Error' : 'Fetch Failed',
      message: error.response?.data?.message || error.message || 'Failed to fetch events',
    });
  }
};


// Get single event by ID
// export const getEventById = async (req, res) => {
//   try {
//     const userId = req.headers['x-user-id'] || req.user.id;
//     const eventId = req.params.id;

//     if (!req.user) {
//       return res.status(401).json({ 
//         error: 'Unauthorized',
//         message: 'User must be authenticated to view event' 
//       });
//     }
//     if (!eventId) {
//       return res.status(400).json({ 
//         error: 'Bad Request',
//         message: 'Event ID is required' 
//       });
//     }

//     const response = await axios.get(getSfApiBaseUrl(), getAuthHeader(userId));

//     if (response.data.statusCode !== 200) {
//       return res.status(response.data.statusCode || 400).json({ 
//         error: 'Fetch Failed',
//         message: response.data.message || 'Failed to fetch events from Salesforce' 
//       });
//     }

//     const eventsData = typeof response.data.data === 'string'
//       ? JSON.parse(response.data.data)
//       : response.data.data;

//     const event = eventsData.find(e => e.Id === eventId);
//     if (!event) {
//       return res.status(404).json({ 
//         error: 'Not Found',
//         message: 'Event not found' 
//       });
//     }

//     const formattedEvent = {
//       id: event.Id,
//       name: event.Name,
//       startDate: event.startDate__c,
//       endDate: event.endDate__c,
//       description: event.Description__c || '',
//       status: event.Status__c || 'Scheduled',
//       capacity: event.Capacity__c || null,
//       location: event.Location__c || 'Virtual',
//       ownerId: event.Custom_Users__c,
//     };

//     res.status(200).json({
//       success: true,
//       message: 'Event retrieved successfully',
//       data: formattedEvent,
//     });
//   } catch (error) {
//     console.error('Get event error:', {
//       message: error.message,
//       stack: error.stack,
//       response: error.response?.data,
//     });

//     const status = error.response?.status || 500;
//     res.status(status).json({
//       error: status === 500 ? 'Server Error' : 'Fetch Failed',
//       message: error.response?.data?.message || error.message || 'Failed to fetch event',
//     });
//   }
// };

export const getEventById = async (req, res) => {
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

    const response = await axios.get(getSfApiBaseUrl(), { headers });

    if (response.data.statusCode !== 200) {
      return res.status(response.data.statusCode || 400).json({ 
        error: 'Fetch Failed',
        message: response.data.message || 'Failed to fetch events from Salesforce' 
      });
    }

    const eventsData = typeof response.data.data === 'string'
      ? JSON.parse(response.data.data)
      : response.data.data;

    const event = eventsData.find(e => e.Id === eventId);
    if (!event) {
      return res.status(404).json({ 
        error: 'Not Found',
        message: 'Event not found' 
      });
    }

    const formattedEvent = {
      id: event.Id,
      name: event.Name,
      startDate: event.startDate__c,
      endDate: event.endDate__c,
      description: event.Description__c || '',
      status: event.Status__c || 'Scheduled',
      capacity: event.Capacity__c || null,
      location: event.Location__c || 'Virtual',
    };

    res.status(200).json({
      success: true,
      message: 'Event retrieved successfully',
      data: formattedEvent,
    });
  } catch (error) {
    console.error('Get event error:', {
      message: error.message,
      stack: error.stack,
      response: error.response?.data,
    });

    const status = error.response?.status || 500;
    res.status(status).json({
      error: status === 500 ? 'Server Error' : 'Fetch Failed',
      message: error.response?.data?.message || error.message || 'Failed to fetch event',
    });
  }
};

// Update an event
export const updateEvent = async (req, res) => {
  try {
    const userId = req.headers['x-user-id'] || req.user.id;
    const eventId = req.params.id;
    const { name, startDate, endDate, description, status, capacity, location } = req.body;

    if (!req.user) {
      return res.status(401).json({ 
        error: 'Unauthorized',
        message: 'User must be authenticated to update events' 
      });
    }
    if (req.user.role !== 'Organizer' && req.user.role !== 'Admin') {
      return res.status(403).json({ 
        error: 'Forbidden',
        message: 'Only Organizers and Admins can update events' 
      });
    }
    if (!eventId) {
      return res.status(400).json({ 
        error: 'Bad Request',
        message: 'Event ID is required' 
      });
    }

    // Check ownership for Organizers
    if (req.user.role === 'Organizer') {
      const eventResponse = await axios.get(getSfApiBaseUrl(), getAuthHeader(userId));
      const eventsData = typeof eventResponse.data.data === 'string'
        ? JSON.parse(eventResponse.data.data)
        : eventResponse.data.data;
      const event = eventsData.find(e => e.Id === eventId);
      if (!event || event.Custom_Users__c !== userId) {
        return res.status(403).json({ 
          error: 'Forbidden',
          message: 'Organizers can only update their own events' 
        });
      }
    }

    const eventData = {
      name: name || undefined,
      startDate: startDate || undefined,
      endDate: endDate || undefined,
      description: description || '',
      status: status || 'Scheduled',
      capacity: capacity || null,
      location: location || 'Virtual',
    };

    const response = await axios.put(
      `${getSfApiBaseUrl()}/${eventId}`,
      eventData,
      getAuthHeader(userId)
    );

    if (response.data.statusCode !== 200) {
      return res.status(response.data.statusCode || 400).json({ 
        error: 'Update Failed',
        message: response.data.message || 'Failed to update event in Salesforce' 
      });
    }

    res.status(200).json({
      success: true,
      message: 'Event updated successfully',
      data: {
        id: eventId,
        ...eventData,
        ownerId: userId,
      },
    });
  } catch (error) {
    console.error('Update event error:', {
      message: error.message,
      stack: error.stack,
      response: error.response?.data,
    });

    const status = error.response?.status || 500;
    res.status(status).json({
      error: status === 500 ? 'Server Error' : 'Update Failed',
      message: error.response?.data?.message || error.message || 'Failed to update event',
    });
  }
};

// Delete an event
export const deleteEvent = async (req, res) => {
  try {
    const userId = req.headers['x-user-id'] || req.user.id;
    const eventId = req.params.id;

    if (!req.user) {
      return res.status(401).json({ 
        error: 'Unauthorized',
        message: 'User must be authenticated to delete events' 
      });
    }
    if (req.user.role !== 'Organizer' && req.user.role !== 'Admin') {
      return res.status(403).json({ 
        error: 'Forbidden',
        message: 'Only Organizers and Admins can delete events' 
      });
    }
    if (!eventId) {
      return res.status(400).json({ 
        error: 'Bad Request',
        message: 'Event ID is required' 
      });
    }

    // Check ownership for Organizers
    if (req.user.role === 'Organizer') {
      const eventResponse = await axios.get(getSfApiBaseUrl(), getAuthHeader(userId));
      const eventsData = typeof eventResponse.data.data === 'string'
        ? JSON.parse(eventResponse.data.data)
        : eventResponse.data.data;
      const event = eventsData.find(e => e.Id === eventId);
      if (!event || event.Custom_Users__c !== userId) {
        return res.status(403).json({ 
          error: 'Forbidden',
          message: 'Organizers can only delete their own events' 
        });
      }
    }

    const response = await axios.delete(
      `${getSfApiBaseUrl()}/${eventId}`,
      getAuthHeader(userId)
    );

    if (response.data.statusCode !== 200) {
      return res.status(response.data.statusCode || 400).json({ 
        error: 'Deletion Failed',
        message: response.data.message || 'Failed to delete event in Salesforce' 
      });
    }

    res.status(200).json({
      success: true,
      message: 'Event deleted successfully',
      data: { id: eventId },
    });
  } catch (error) {
    console.error('Delete event error:', {
      message: error.message,
      stack: error.stack,
      response: error.response?.data,
    });

    const status = error.response?.status || 500;
    res.status(status).json({
      error: status === 500 ? 'Server Error' : 'Deletion Failed',
      message: error.response?.data?.message || error.message || 'Failed to delete event',
    });
  }
};

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

export default {
  createEvent,
  getEvents,
  getEventById,
  updateEvent,
  deleteEvent,
  getEventAttendees,
};