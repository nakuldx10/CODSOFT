import Attempt from '../models/Attempt.js';
import Quiz from '../models/Quiz.js';

// @desc    Submit a quiz attempt
// @route   POST /api/attempts
// @access  Private
export const submitAttempt = async (req, res) => {
  try {
    const { quizId, answers, timeTaken } = req.body;

    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return res.status(404).json({ success: false, message: 'Quiz not found' });
    }

    let score = 0;
    const processedAnswers = answers.map((a) => {
      const question = quiz.questions[a.questionIndex];
      const isCorrect = a.selectedAnswer === question.correctAnswer;
      if (isCorrect) score++;
      
      return {
        questionIndex: a.questionIndex,
        selectedAnswer: a.selectedAnswer,
        correctAnswer: question.correctAnswer,
        isCorrect,
      };
    });

    const totalQuestions = quiz.questions.length;
    const percentage = Math.round((score / totalQuestions) * 100);
    const passed = percentage >= 60;

    const attempt = await Attempt.create({
      userId: req.user._id,
      quizId,
      score,
      totalQuestions,
      percentage,
      passed,
      answers: processedAnswers,
      timeTaken: timeTaken || 0,
    });

    // Increment quiz totalAttempts
    await Quiz.findByIdAndUpdate(quizId, { $inc: { totalAttempts: 1 } });

    res.status(201).json({
      success: true,
      attempt,
      quiz: {
        title: quiz.title,
        questions: quiz.questions,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// @desc    Get user's attempts
// @route   GET /api/attempts/user
// @access  Private
export const getUserAttempts = async (req, res) => {
  try {
    const attempts = await Attempt.find({ userId: req.user._id })
      .populate('quizId', 'title category difficulty questions')
      .sort({ attemptedAt: -1 });

    res.json({ success: true, attempts });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// @desc    Get single attempt by id
// @route   GET /api/attempts/:id
// @access  Private
export const getAttemptById = async (req, res) => {
  try {
    const attempt = await Attempt.findById(req.params.id)
      .populate('quizId');

    if (!attempt) {
      return res.status(404).json({ success: false, message: 'Attempt not found' });
    }

    // Verify ownership
    if (attempt.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    res.json({ success: true, attempt });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};
// @desc    Get dashboard stats
// @route   GET /api/attempts/stats
// @access  Private
export const getDashboardStats = async (req, res) => {
  try {
    const userId = req.user._id;

    // All attempts by user
    const attempts = await Attempt.find({ userId })
      .populate('quizId', 'title category difficulty');

    // All quizzes created by user
    const createdQuizzes = await Quiz.find({ createdBy: userId });

    const totalAttempts = attempts.length;
    const totalCreated = createdQuizzes.length;
    
    const avgPercentage = totalAttempts > 0
      ? Math.round(attempts.reduce((sum, a) => sum + a.percentage, 0) / totalAttempts)
      : 0;

    const passedCount = attempts.filter(a => a.passed).length;
    
    const passRate = totalAttempts > 0
      ? Math.round((passedCount / totalAttempts) * 100)
      : 0;

    const totalQuestionsAnswered = attempts.reduce((sum, a) => sum + a.totalQuestions, 0);

    const bestScore = totalAttempts > 0
      ? Math.max(...attempts.map(a => a.percentage))
      : 0;

    // Category breakdown
    const categoryMap = {};
    attempts.forEach(a => {
      if (a.quizId?.category) {
        const cat = a.quizId.category;
        if (!categoryMap[cat]) {
          categoryMap[cat] = { attempts: 0, totalPct: 0 };
        }
        categoryMap[cat].attempts++;
        categoryMap[cat].totalPct += a.percentage;
      }
    });
    
    const categoryStats = Object.entries(categoryMap).map(([cat, data]) => ({
      category: cat,
      attempts: data.attempts,
      avgScore: Math.round(data.totalPct / data.attempts)
    })).sort((a, b) => b.attempts - a.attempts);

    res.json({
      success: true,
      stats: {
        totalAttempts,
        totalCreated,
        avgPercentage,
        passRate,
        passedCount,
        failedCount: totalAttempts - passedCount,
        totalQuestionsAnswered,
        bestScore,
        categoryStats
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};
