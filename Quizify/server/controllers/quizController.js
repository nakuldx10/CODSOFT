import Quiz from '../models/Quiz.js';

// @desc    Create a quiz
// @route   POST /api/quizzes
// @access  Private
export const createQuiz = async (req, res) => {
  try {
    const { title, description, category, difficulty, questions, isPublished } = req.body;

    // Validation
    if (!title || !description || !category || !difficulty) {
      return res.status(400).json({ success: false, message: 'Please provide all required fields' });
    }

    if (!questions || questions.length === 0) {
      return res.status(400).json({ success: false, message: 'A quiz must have at least one question' });
    }

    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      if (!q.questionText || !q.options || q.options.length !== 4 || q.correctAnswer === undefined || q.correctAnswer < 0 || q.correctAnswer > 3) {
        return res.status(400).json({ success: false, message: `Invalid question format at index ${i}` });
      }
    }

    const quiz = await Quiz.create({
      title,
      description,
      category,
      difficulty,
      questions,
      createdBy: req.user._id,
      isPublished: isPublished !== undefined ? isPublished : true,
    });

    res.status(201).json({ success: true, quiz });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// @desc    Get all published quizzes
// @route   GET /api/quizzes
// @access  Public
export const getAllQuizzes = async (req, res) => {
  try {
    const {
      category,
      difficulty,
      search,
      limit,
      page = 1,
      sort = 'newest'
    } = req.query;

    let query = { isPublished: true };

    if (category && category !== 'All') {
      query.category = category;
    }

    if (difficulty && difficulty !== 'All') {
      query.difficulty = difficulty;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const sortOptions = {
      newest:   { createdAt: -1 },
      oldest:   { createdAt: 1 },
      popular:  { totalAttempts: -1 },
      az:       { title: 1 }
    };

    const pageSize = parseInt(limit) || 12;
    const skip = (parseInt(page) - 1) * pageSize;

    const total = await Quiz.countDocuments(query);
    const quizzes = await Quiz
      .find(query)
      .populate('createdBy', 'name')
      .sort(sortOptions[sort] || sortOptions.newest)
      .skip(skip)
      .limit(pageSize);

    res.json({
      success: true,
      count: quizzes.length,
      total,
      totalPages: Math.ceil(total / pageSize),
      currentPage: parseInt(page),
      quizzes
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// @desc    Get single quiz
// @route   GET /api/quizzes/:id
// @access  Public
export const getQuizById = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id).populate('createdBy', 'name');

    if (!quiz) {
      return res.status(404).json({ success: false, message: 'Quiz not found' });
    }

    res.json({ success: true, quiz });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// @desc    Update a quiz
// @route   PUT /api/quizzes/:id
// @access  Private
export const updateQuiz = async (req, res) => {
  try {
    let quiz = await Quiz.findById(req.params.id);

    if (!quiz) {
      return res.status(404).json({ success: false, message: 'Quiz not found' });
    }

    // Check ownership
    if (quiz.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to update this quiz' });
    }

    const { title, description, category, difficulty, questions, isPublished } = req.body;

    if (questions) {
      if (questions.length === 0) {
        return res.status(400).json({ success: false, message: 'A quiz must have at least one question' });
      }
      for (let i = 0; i < questions.length; i++) {
        const q = questions[i];
        if (!q.questionText || !q.options || q.options.length !== 4 || q.correctAnswer === undefined || q.correctAnswer < 0 || q.correctAnswer > 3) {
          return res.status(400).json({ success: false, message: `Invalid question format at index ${i}` });
        }
      }
    }

    quiz = await Quiz.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.json({ success: true, quiz });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// @desc    Delete a quiz
// @route   DELETE /api/quizzes/:id
// @access  Private
export const deleteQuiz = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);

    if (!quiz) {
      return res.status(404).json({ success: false, message: 'Quiz not found' });
    }

    // Check ownership
    if (quiz.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this quiz' });
    }

    await quiz.deleteOne();

    res.json({ success: true, message: 'Quiz removed' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// @desc    Get user's quizzes
// @route   GET /api/quizzes/user/me
// @access  Private
export const getUserQuizzes = async (req, res) => {
  try {
    const quizzes = await Quiz.find({ createdBy: req.user._id }).sort({ createdAt: -1 });
    res.json({ success: true, quizzes });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// @desc    Get quiz leaderboard
// @route   GET /api/quizzes/:id/leaderboard
// @access  Public
export const getQuizLeaderboard = async (req, res) => {
  try {
    // Need to dynamically import Attempt or mongoose.model('Attempt') to avoid circular deps
    // Assuming Attempt is imported or we can use mongoose.model
    import('../models/Attempt.js').then(async ({ default: Attempt }) => {
      const leaderboard = await Attempt.find({ quizId: req.params.id })
        .sort({ percentage: -1, timeTaken: 1 })
        .limit(10)
        .populate('userId', 'name');

      res.json({ success: true, leaderboard });
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};
