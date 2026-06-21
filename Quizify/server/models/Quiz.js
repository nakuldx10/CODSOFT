import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema({
  questionText: {
    type: String,
    required: true,
    trim: true,
  },
  options: {
    type: [String],
    required: true,
    validate: [arrayLimit, '{PATH} must have exactly 4 options'],
  },
  correctAnswer: {
    type: Number,
    required: true,
    min: 0,
    max: 3,
  },
});

function arrayLimit(val) {
  return val.length === 4;
}

const quizSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100,
  },
  description: {
    type: String,
    required: true,
    trim: true,
    maxlength: 500,
  },
  category: {
    type: String,
    required: true,
    enum: [
      'General Knowledge',
      'Science',
      'Technology',
      'Mathematics',
      'History',
      'Geography',
      'Sports',
      'Entertainment',
      'Language',
      'Other',
    ],
  },
  difficulty: {
    type: String,
    required: true,
    enum: ['Easy', 'Medium', 'Hard'],
  },
  questions: {
    type: [questionSchema],
    validate: [questionsLimit, 'A quiz must have at least 1 question'],
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  totalAttempts: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  isPublished: {
    type: Boolean,
    default: true,
  },
});

function questionsLimit(val) {
  return val.length > 0;
}

const Quiz = mongoose.model('Quiz', quizSchema);

export default Quiz;
