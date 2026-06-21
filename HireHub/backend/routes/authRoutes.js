const express = require('express');
const router = express.Router();
const { register, login, refreshToken, logout, getMe, updateProfile, uploadResume, changePassword } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const rateLimit = require('express-rate-limit');

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { success: false, message: 'Too many attempts, please try again after 15 minutes' }
});
const uploadMiddleware = require('../middleware/uploadMiddleware');

router.post('/register', authLimiter, register);
router.post('/login', authLimiter, login);
router.get('/refresh', refreshToken);
router.post('/logout', logout);
router.get('/me', protect, getMe);
router.put('/profile', protect, uploadMiddleware.single('avatar'), updateProfile);
router.put('/resume', protect, uploadMiddleware.single('resume'), uploadResume);
router.put('/change-password', protect, changePassword);

module.exports = router;
