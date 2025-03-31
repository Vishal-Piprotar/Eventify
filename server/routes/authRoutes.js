import express from 'express';
import { register, login,getProfile, editProfile } from '../controllers/authController.js';
import authMiddleware from "../middlewares/authMiddleware.js"

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/profile', authMiddleware, getProfile);
router.put('/profile', authMiddleware, editProfile);

export default router;