import express from 'express';
import {
  registerAttendee,
  getEventAttendees,
  cancelAttendee,
  deleteAttendee,
} from '../controllers/attendeeController.js';

const router = express.Router();

// POST /api/attendees — Register a new attendee
router.post('/', registerAttendee);

// GET /api/attendees/:eventId — Get attendees for a specific event
router.get('/:eventId', getEventAttendees);

// PUT /api/attendees/cancel/:attendeeId — Cancel a registration
router.put('/cancel/:attendeeId', cancelAttendee);

// DELETE /api/attendees/:attendeeId — Delete an attendee
router.delete('/:attendeeId', deleteAttendee);

export default router;
