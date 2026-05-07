import express from 'express';
import { signup, login, getMe, logout, updateProfile, uploadAvatar } from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';
import { loginLimiter, signupLimiter } from '../middleware/rateLimiter.js';
import { validateSignup, validateLogin } from '../middleware/validation.js';
import upload from '../middleware/upload.js';

const router = express.Router();

router.post('/signup', signupLimiter, validateSignup, signup);
router.post('/login', loginLimiter, validateLogin, login);
router.get('/me', protect, getMe);
router.post('/logout', protect, logout);
router.put('/updateprofile', protect, updateProfile);
router.post('/upload-avatar', protect, upload.single('avatar'), uploadAvatar);

export default router;
