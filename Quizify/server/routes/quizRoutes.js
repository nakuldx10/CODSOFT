import express from 'express';
import {
  createQuiz,
  getAllQuizzes,
  getQuizById,
  updateQuiz,
  deleteQuiz,
  getUserQuizzes,
  getQuizLeaderboard,
} from '../controllers/quizController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(getAllQuizzes)
  .post(protect, createQuiz);

router.get('/user/me', protect, getUserQuizzes);

router.route('/:id')
  .get(getQuizById)
  .put(protect, updateQuiz)
  .delete(protect, deleteQuiz);

router.get('/:id/leaderboard', getQuizLeaderboard);

export default router;
