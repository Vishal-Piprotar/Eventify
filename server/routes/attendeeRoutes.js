import express from 'express';
import attendeeController from '../controllers/attendeeController.js';

const router = express.Router();

// ✅ Register an attendee
router.post('/', attendeeController.registerAttendee);

// ✅ Get all attendees for an event
router.get('/:eventId', attendeeController.getEventAttendees);

// ✅ Cancel a registration (attendee themselves)
router.put('/:attendeeId', attendeeController.cancelAttendee);

// ✅ Delete an attendee (admin or self)
router.delete('/:attendeeId', attendeeController.deleteAttendee);

// 🔁 Optional: Get all registrations for current user
router.get('/my-registrations', attendeeController.getMyAttendees);

export default router;
