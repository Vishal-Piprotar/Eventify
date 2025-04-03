import express from 'express';
import authMiddleware from '../middlewares/authMiddleware.js';
import {
  createEvent,
  getEvents,
  getEventById,
  updateEvent,
  deleteEvent,
  getEventAttendees,
  getMyEvents
} from '../controllers/eventController.js';

const router = express.Router();

router.post('/', authMiddleware, createEvent);
router.get('/', getEvents);
router.get('/my-events', authMiddleware, getMyEvents);
router.get('/:id', getEventById);
router.put('/:id', authMiddleware, updateEvent);
router.delete('/:id', authMiddleware, deleteEvent);
router.get('/:id/attendees', getEventAttendees);

export default router;
