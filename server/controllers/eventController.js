// controllers/eventController.js
import axios from 'axios';
import conn from '../config/salesforce.js';

const getSfApiBaseUrl = () => `${conn.get().instanceUrl}/services/apexrest/events`;

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

export const createEvent = async (req, res) => {
  try {
    const { name, startDate, endDate, description, status, capacity, location } = req.body;
    const userId = req.headers['x-user-id'] || req.user?.id;

    if (!req.user) return res.status(401).json({ error: 'Unauthorized', message: 'User must be authenticated to create events' });
    if (!['Organizer', 'Admin'].includes(req.user.role)) return res.status(403).json({ error: 'Forbidden', message: 'Only Organizers and Admins can create events' });
    if (!name || !startDate || !endDate) return res.status(400).json({ error: 'Bad Request', message: 'Name, startDate, and endDate are required' });

    const eventData = { name, startDate, endDate, description: description || '', status: status || 'Scheduled', capacity: capacity || null, location: location || 'Virtual' };

    const response = await axios.post(getSfApiBaseUrl(), eventData, getAuthHeader(userId));

    if (response.data.statusCode !== 201) return res.status(response.data.statusCode || 400).json({ error: 'Creation Failed', message: response.data.message || 'Failed to create event in Salesforce' });

    const responseData = typeof response.data.data === 'string' ? JSON.parse(response.data.data) : response.data.data;

    res.status(201).json({
      success: true,
      message: 'Event created successfully',
      data: { id: responseData.eventId || responseData.Id, ...eventData, ownerId: userId, createdBy: userId },
    });
  } catch (error) {
    console.error('Event creation error:', error);
    res.status(error.response?.status || 500).json({ error: 'Creation Failed', message: error.message });
  }
};

export const getEvents = async (req, res) => {
  try {
    const response = await axios.get(getSfApiBaseUrl(), {
      headers: {
        'Authorization': `Bearer ${conn.get().accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (response.data.statusCode !== 200) return res.status(response.data.statusCode || 400).json({ error: 'Fetch Failed', message: response.data.message });

    const eventsData = typeof response.data.data === 'string' ? JSON.parse(response.data.data) : response.data.data;
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

    res.status(200).json({ success: true, message: 'Events retrieved successfully', data: { total: formattedEvents.length, events: formattedEvents } });
  } catch (error) {
    console.error('Get events error:', error);
    res.status(error.response?.status || 500).json({ error: 'Fetch Failed', message: error.message });
  }
};

// controllers/eventController.js

export const getEventById = async (req, res) => {
  try {
    const eventId = req.params.id;
    if (!eventId) {
      console.warn('[getEventById] No event ID provided in request params');
      return res.status(400).json({ error: 'Bad Request', message: 'Event ID is required' });
    }

    console.log(`[getEventById] Requested Event ID: ${eventId}`);

    const headers = {
      'Authorization': `Bearer ${conn.get().accessToken}`,
      'Content-Type': 'application/json',
    };

    const response = await axios.get(getSfApiBaseUrl(), { headers });

    const eventsData = typeof response.data.data === 'string'
      ? JSON.parse(response.data.data)
      : response.data.data;

    console.log(`[getEventById] Total events fetched from Salesforce: ${eventsData.length}`);
    console.log('[getEventById] Event IDs:', eventsData.map(e => e.Id));

    // 🔍 Case-insensitive match
    const event = eventsData.find(e => e.Id?.toLowerCase() === eventId.toLowerCase());

    if (!event) {
      console.warn(`[getEventById] No matching event found for ID: ${eventId}`);
      return res.status(404).json({ error: 'Not Found', message: `Event with ID ${eventId} not found` });
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

    console.log('[getEventById] Matched Event:', formattedEvent);

    res.status(200).json({
      success: true,
      message: 'Event retrieved successfully',
      data: formattedEvent,
    });
  } catch (error) {
    console.error('[getEventById] Error occurred:', error);
    res.status(error.response?.status || 500).json({
      error: 'Fetch Failed',
      message: error.message,
    });
  }
};




export const updateEvent = async (req, res) => {
  try {
    const userId = req.headers['x-user-id'] || req.user.id;
    const eventId = req.params.id;
    const { name, startDate, endDate, description, status, capacity, location } = req.body;

    if (!req.user) return res.status(401).json({ error: 'Unauthorized', message: 'User must be authenticated to update events' });
    if (!['Organizer', 'Admin'].includes(req.user.role)) return res.status(403).json({ error: 'Forbidden', message: 'Only Organizers and Admins can update events' });
    if (!eventId) return res.status(400).json({ error: 'Bad Request', message: 'Event ID is required' });

    if (req.user.role === 'Organizer') {
      const eventResponse = await axios.get(getSfApiBaseUrl(), getAuthHeader(userId));
      const eventsData = typeof eventResponse.data.data === 'string' ? JSON.parse(eventResponse.data.data) : eventResponse.data.data;
      const event = eventsData.find(e => e.Id === eventId);
      if (!event || event.Custom_Users__c !== userId) return res.status(403).json({ error: 'Forbidden', message: 'Organizers can only update their own events' });
    }

    const eventData = { name, startDate, endDate, description, status, capacity, location };
    const response = await axios.put(`${getSfApiBaseUrl()}/${eventId}`, eventData, getAuthHeader(userId));

    if (response.data.statusCode !== 200) return res.status(response.data.statusCode || 400).json({ error: 'Update Failed', message: response.data.message });

    res.status(200).json({ success: true, message: 'Event updated successfully', data: { id: eventId, ...eventData, ownerId: userId } });
  } catch (error) {
    console.error('Update event error:', error);
    res.status(error.response?.status || 500).json({ error: 'Update Failed', message: error.message });
  }
};

export const deleteEvent = async (req, res) => {
  try {
    const userId = req.headers['x-user-id'] || req.user.id;
    const eventId = req.params.id;

    if (!req.user) return res.status(401).json({ error: 'Unauthorized', message: 'User must be authenticated to delete events' });
    if (!['Organizer', 'Admin'].includes(req.user.role)) return res.status(403).json({ error: 'Forbidden', message: 'Only Organizers and Admins can delete events' });
    if (!eventId) return res.status(400).json({ error: 'Bad Request', message: 'Event ID is required' });

    if (req.user.role === 'Organizer') {
      const eventResponse = await axios.get(getSfApiBaseUrl(), getAuthHeader(userId));
      const eventsData = typeof eventResponse.data.data === 'string' ? JSON.parse(eventResponse.data.data) : eventResponse.data.data;
      const event = eventsData.find(e => e.Id === eventId);
      if (!event || event.Custom_Users__c !== userId) return res.status(403).json({ error: 'Forbidden', message: 'Organizers can only delete their own events' });
    }

    const response = await axios.delete(`${getSfApiBaseUrl()}/${eventId}`, getAuthHeader(userId));
    if (response.data.statusCode !== 200) return res.status(response.data.statusCode || 400).json({ error: 'Deletion Failed', message: response.data.message });

    res.status(200).json({ success: true, message: 'Event deleted successfully', data: { id: eventId } });
  } catch (error) {
    console.error('Delete event error:', error);
    res.status(error.response?.status || 500).json({ error: 'Deletion Failed', message: error.message });
  }
};

export const getEventAttendees = async (req, res) => {
  try {
    const eventId = req.params.id;
    if (!eventId) return res.status(400).json({ error: 'Bad Request', message: 'Event ID is required' });

    const headers = {
      'Authorization': `Bearer ${conn.get().accessToken}`,
      'Content-Type': 'application/json',
    };

    const response = await axios.get(`${getSfApiBaseUrl()}/${eventId}/attendees`, { headers });
    if (response.data.statusCode !== 200) return res.status(response.data.statusCode || 400).json({ error: 'Fetch Failed', message: response.data.message });

    const attendeesData = typeof response.data.data === 'string' ? JSON.parse(response.data.data) : response.data.data;
    res.status(200).json({ success: true, message: 'Attendees retrieved successfully', data: { total: attendeesData.length, attendees: attendeesData } });
  } catch (error) {
    console.error('Get attendees error:', error);
    res.status(error.response?.status || 500).json({ error: 'Fetch Failed', message: error.message });
  }
};

export const getMyEvents = async (req, res) => {
  try {
    const userId = req.headers['x-user-id'] || req.user?.id;
    if (!req.user) return res.status(401).json({ error: 'Unauthorized', message: 'User must be authenticated to view events' });
    if (!['Organizer', 'Admin'].includes(req.user.role)) return res.status(403).json({ error: 'Forbidden', message: 'Only Organizers and Admins can view their events' });

    const response = await axios.get(getSfApiBaseUrl(), getAuthHeader(userId));
    if (response.data.statusCode !== 200) return res.status(response.data.statusCode || 400).json({ error: 'Fetch Failed', message: response.data.message });

    const eventsData = typeof response.data.data === 'string' ? JSON.parse(response.data.data) : response.data.data;
    const myEvents = req.user.role === 'Organizer' ? eventsData.filter(event => event.Custom_Users__c === userId) : eventsData;

    const formattedEvents = myEvents.map(event => ({
      id: event.Id,
      name: event.Name,
      startDate: event.startDate__c,
      endDate: event.endDate__c,
      description: event.Description__c || '',
      status: event.Status__c || 'Scheduled',
      capacity: event.Capacity__c || null,
      location: event.Location__c || 'Virtual',
      ownerId: event.Custom_Users__c,
    }));

    res.status(200).json({ success: true, message: 'My events retrieved successfully', data: { total: formattedEvents.length, events: formattedEvents } });
  } catch (error) {
    console.error('Get my events error:', error);
    res.status(error.response?.status || 500).json({ error: 'Fetch Failed', message: error.message });
  }
};

export default {
  createEvent,
  getEvents,
  getEventById,
  updateEvent,
  deleteEvent,
  getMyEvents,
  getEventAttendees,
};
