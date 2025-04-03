import express from 'express';
import { register, login, getProfile, editProfile, changePassword, deleteUser } from '../controllers/authController.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);

router.get('/profile', authMiddleware, getProfile);
router.put('/profile', authMiddleware, editProfile);
router.put("/change-password", authMiddleware, changePassword);
router.delete('/profile', authMiddleware, deleteUser);


export default router;
