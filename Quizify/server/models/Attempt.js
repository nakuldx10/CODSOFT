import mongoose from 'mongoose';

const attemptSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  quizId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Quiz',
    required: true,
  },
  score: {
    type: Number,
    required: true,
  },
  totalQuestions: {
    type: Number,
    required: true,
  },
  percentage: {
    type: Number,
    required: true,
  },
  passed: {
    type: Boolean,
    required: true,
  },
  answers: [
    {
      questionIndex: Number,
      selectedAnswer: Number,
      isCorrect: Boolean,
    },
  ],
  timeTaken: {
    type: Number,
  },
  attemptedAt: {
    type: Date,
    default: Date.now,
  },
});

const Attempt = mongoose.model('Attempt', attemptSchema);

export default Attempt;
