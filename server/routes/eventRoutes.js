import express from 'express';
import authMiddleware from '../middlewares/authMiddleware.js';
import { createEvent, getEvents, getEventById, updateEvent, deleteEvent, getEventAttendees } from '../controllers/eventController.js';

const router = express.Router();

router.post('/', authMiddleware, createEvent);
router.get('/', getEvents); // Removed authMiddleware for public access
router.get('/:id', getEventById); // Allow fetching a single event without login
router.put('/:id', authMiddleware, updateEvent);
router.delete('/:id', authMiddleware, deleteEvent);
router.get('/:id/attendees', getEventAttendees);



export default router;
