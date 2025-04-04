// routes/attendeeRoutes.js

import express from 'express';
import attendeeController from '../controllers/attendeeController.js';

const router = express.Router();

// Register an attendee
router.post('/', attendeeController.registerAttendee);

// Get attendees for an event
router.get('/:eventId', attendeeController.getEventAttendees);

// Cancel a registration
router.put('/:attendeeId', attendeeController.cancelAttendee);

// Delete attendee record
router.delete('/:attendeeId', attendeeController.deleteAttendee);

export default router;
