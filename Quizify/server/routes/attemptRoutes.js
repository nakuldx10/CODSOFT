import express from 'express';
import {
  submitAttempt,
  getUserAttempts,
  getAttemptById,
  getDashboardStats,
} from '../controllers/attemptController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .post(protect, submitAttempt);

router.get('/user', protect, getUserAttempts);

router.get('/stats', protect, getDashboardStats);

router.get('/:id', protect, getAttemptById);

export default router;
