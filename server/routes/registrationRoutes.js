import express from 'express';
import authMiddleware from '../middlewares/authMiddleware.js';
import { registerForEvent, getEventAttendees } from '../controllers/registrationController.js';

const router = express.Router();

router.post('/events/:id/register', authMiddleware, registerForEvent);
// router.get('/events/:id/attendees', getEventAttendees);

export default router;