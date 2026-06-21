import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiInfo, FiHelpCircle, FiPlus } from 'react-icons/fi';
import toast from 'react-hot-toast';
import QuestionCard from '../components/QuestionCard';
import QuizProgressSidebar from '../components/QuizProgressSidebar';
import { createQuiz } from '../api/quizApi';
import usePageTitle from '../hooks/usePageTitle';
import PageTransition from '../components/PageTransition';

const CreateQuiz = () => {
  usePageTitle('Create Quiz');
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [quizData, setQuizData] = useState({
    title: '',
    description: '',
    category: '',
    difficulty: '',
    questions: [
      {
        questionText: '',
        options: ['', '', '', ''],
        correctAnswer: null,
      },
    ],
  });

  const categories = [
    { label: 'General Knowledge', icon: '🧠' },
    { label: 'Science', icon: '🔬' },
    { label: 'Technology', icon: '💻' },
    { label: 'Mathematics', icon: '📐' },
    { label: 'History', icon: '📜' },
    { label: 'Geography', icon: '🌍' },
    { label: 'Sports', icon: '⚽' },
    { label: 'Entertainment', icon: '🎬' },
    { label: 'Language', icon: '📖' },
    { label: 'Other', icon: '📌' },
  ];

  const updateQuizInfo = (field, value) => {
    setQuizData((prev) => ({ ...prev, [field]: value }));
  };

  const addQuestion = () => {
    setQuizData((prev) => ({
      ...prev,
      questions: [
        ...prev.questions,
        {
          questionText: '',
          options: ['', '', '', ''],
          correctAnswer: null,
        },
      ],
    }));
  };

  const updateQuestion = (index, updatedQuestion) => {
    setQuizData((prev) => {
      const newQuestions = [...prev.questions];
      newQuestions[index] = updatedQuestion;
      return { ...prev, questions: newQuestions };
    });
  };

  const deleteQuestion = (index) => {
    if (quizData.questions.length <= 1) return;
    setQuizData((prev) => {
      const newQuestions = [...prev.questions];
      newQuestions.splice(index, 1);
      return { ...prev, questions: newQuestions };
    });
  };

  const moveQuestion = (index, direction) => {
    if (
      (direction === -1 && index === 0) ||
      (direction === 1 && index === quizData.questions.length - 1)
    ) return;

    setQuizData((prev) => {
      const newQuestions = [...prev.questions];
      const temp = newQuestions[index];
      newQuestions[index] = newQuestions[index + direction];
      newQuestions[index + direction] = temp;
      return { ...prev, questions: newQuestions };
    });
  };

  const validateQuiz = () => {
    if (quizData.title.trim().length < 5) {
      toast.error('Title must be at least 5 characters');
      return false;
    }
    if (quizData.description.trim().length < 10) {
      toast.error('Description must be at least 10 characters');
      return false;
    }
    if (!quizData.category) {
      toast.error('Please select a category');
      return false;
    }
    if (!quizData.difficulty) {
      toast.error('Please select a difficulty level');
      return false;
    }
    if (quizData.questions.length < 1) {
      toast.error('Add at least one question');
      return false;
    }

    for (let i = 0; i < quizData.questions.length; i++) {
      const q = quizData.questions[i];
      if (!q.questionText.trim() || q.questionText.trim().length < 10) {
        toast.error(`Question ${i + 1}: Question text must be at least 10 characters`);
        return false;
      }
      if (q.options.some((opt) => !opt.trim())) {
        toast.error(`Question ${i + 1}: Fill all 4 options`);
        return false;
      }
      if (q.correctAnswer === null) {
        toast.error(`Question ${i + 1}: Select correct answer`);
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async (isPublished) => {
    if (!validateQuiz()) return;

    setIsSubmitting(true);
    try {
      const res = await createQuiz({
        ...quizData,
        isPublished,
      });

      toast.success(isPublished ? '🎉 Quiz published successfully!' : '📝 Quiz saved as draft!');
      navigate(`/dashboard`); // Assuming dashboard for now, user can see their quizzes there
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create quiz');
    } finally {
      setIsSubmitting(false);
    }
  };

  const isQuestionComplete = (q) => {
    return (
      q.questionText.trim().length >= 10 &&
      q.options.every(opt => opt.trim().length > 0) &&
      q.correctAnswer !== null
    );
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-[#FDFBF7] pt-24 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <div className="mb-8 animate-fade-in">
          <div className="text-sm text-[#9CA3AF] mb-2">
            <Link to="/" className="hover:text-[#2D6A4F] transition-colors">Home</Link> / Create Quiz
          </div>
          <h1 className="text-3xl font-bold text-[#1A1A1A]">Create New Quiz ⚡</h1>
          <p className="text-[#6B7280] mt-1">Fill in the details and add your questions below</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Main Form Area (Left) */}
          <div className="w-full lg:w-[70%]">
            
            {/* CARD 1: Quiz Details */}
            <div className="bg-white rounded-md border border-[#E5E0D8] shadow-card p-6 sm:p-8 mb-6 animate-slide-up">
              <div className="flex justify-between items-center mb-6 pb-4 border-b border-[#E5E0D8]">
                <div className="flex items-center gap-2 text-[#1A1A1A] font-bold text-lg">
                  <FiInfo className="text-[#2D6A4F]" />
                  <h2>Quiz Information</h2>
                </div>
                <div className="bg-[#D8F3DC] text-[#2D6A4F] rounded-sm text-xs font-semibold px-3 py-1">
                  Step 1 of 2
                </div>
              </div>

              <div className="space-y-5">
                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-[#1A1A1A] mb-2">Quiz Title *</label>
                  <div className="relative">
                    <input
                      type="text"
                      value={quizData.title}
                      onChange={(e) => updateQuizInfo('title', e.target.value)}
                      maxLength={100}
                      placeholder="e.g. JavaScript Fundamentals Quiz"
                      className="w-full rounded-md border border-[#E5E0D8] px-4 py-3 shadow-sm focus:border-[#2D6A4F] focus:outline-none focus:ring-0 focus:shadow-focus text-[#1A1A1A] placeholder-[#9CA3AF]"
                    />
                    <span className="absolute bottom-3 right-4 text-xs text-[#9CA3AF]">
                      {quizData.title.length}/100
                    </span>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-[#1A1A1A] mb-2">Description *</label>
                  <div className="relative">
                    <textarea
                      rows="3"
                      value={quizData.description}
                      onChange={(e) => updateQuizInfo('description', e.target.value)}
                      maxLength={500}
                      placeholder="Briefly describe what this quiz covers..."
                      className="w-full rounded-md border border-[#E5E0D8] px-4 py-3 shadow-sm focus:border-[#2D6A4F] focus:outline-none focus:ring-0 focus:shadow-focus resize-none text-[#1A1A1A] placeholder-[#9CA3AF]"
                    />
                    <span className="absolute bottom-3 right-4 text-xs text-[#9CA3AF] bg-white px-1">
                      {quizData.description.length}/500
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Category */}
                  <div>
                    <label className="block text-sm font-medium text-[#1A1A1A] mb-2">Category *</label>
                    <select
                      value={quizData.category}
                      onChange={(e) => updateQuizInfo('category', e.target.value)}
                      className="w-full bg-white rounded-md border border-[#E5E0D8] px-4 py-3 shadow-sm focus:border-[#2D6A4F] focus:outline-none focus:ring-0 focus:shadow-focus appearance-none cursor-pointer text-[#1A1A1A]"
                    >
                      <option value="" disabled>Select a category</option>
                      {categories.map((cat) => (
                        <option key={cat.label} value={cat.label}>
                          {cat.icon} {cat.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Difficulty */}
                  <div>
                    <label className="block text-sm font-medium text-[#1A1A1A] mb-2">Difficulty Level *</label>
                    <div className="flex gap-2 flex-wrap">
                      {['Easy', 'Medium', 'Hard'].map((diff) => (
                        <button
                          key={diff}
                          type="button"
                          onClick={() => updateQuizInfo('difficulty', diff)}
                          className={`flex-1 min-w-[80px] rounded-md px-4 py-2 font-medium transition-colors border ${
                            quizData.difficulty === diff
                              ? diff === 'Easy' ? 'bg-[#D8F3DC] text-[#2D6A4F] border-[#40916C]/30'
                              : diff === 'Medium' ? 'bg-orange-50 text-orange-600 border-orange-200'
                              : 'bg-red-50 text-red-600 border-red-200'
                              : 'bg-white border-[#E5E0D8] text-[#6B7280] hover:bg-[#F5F0E8]'
                          }`}
                        >
                          {diff}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* CARD 2: Questions Section */}
            <div className="bg-white rounded-md border border-[#E5E0D8] shadow-card p-6 sm:p-8 animate-slide-up" style={{ animationDelay: '0.1s' }}>
              <div className="flex justify-between items-center mb-6 pb-4 border-b border-[#E5E0D8]">
                <div className="flex items-center gap-2 text-[#1A1A1A] font-bold text-lg">
                  <FiHelpCircle className="text-[#2D6A4F]" />
                  <h2>Questions</h2>
                </div>
                <div className="bg-[#D8F3DC] text-[#2D6A4F] rounded-sm text-xs font-semibold px-3 py-1">
                  Step 2 of 2
                </div>
              </div>

              <div className="bg-[#F0FAF2] border-l-4 border-[#2D6A4F] rounded-md p-4 mb-8 text-sm text-[#3D3D3D] flex items-start gap-3">
                <span className="text-lg">💡</span>
                <p>Add at least 1 question. Each question needs 4 answer options and 1 correct answer marked.</p>
              </div>

              {/* Question Cards List */}
              <div className="space-y-6">
                {quizData.questions.map((q, index) => (
                  <QuestionCard
                    key={index}
                    index={index}
                    question={q}
                    onUpdate={updateQuestion}
                    onDelete={deleteQuestion}
                    onMoveUp={(idx) => moveQuestion(idx, -1)}
                    onMoveDown={(idx) => moveQuestion(idx, 1)}
                    isFirst={index === 0}
                    isLast={index === quizData.questions.length - 1}
                    totalQuestions={quizData.questions.length}
                  />
                ))}
              </div>

              {/* Add Question Button */}
              <button
                type="button"
                onClick={addQuestion}
                className="w-full mt-6 flex items-center justify-center gap-2 rounded-md border-2 border-dashed border-[#2D6A4F]/40 bg-[#F0FAF2] py-4 text-[#2D6A4F] font-semibold hover:bg-[#D8F3DC] transition-colors"
              >
                <FiPlus className="text-xl" />
                Add New Question
              </button>
            </div>

            {/* Bottom Action Bar */}
            <div className="sticky bottom-4 z-40 bg-white rounded-md shadow-card border border-[#E5E0D8] p-4 sm:p-6 mt-6 flex flex-col sm:flex-row justify-between items-center gap-4 animate-slide-up" style={{ animationDelay: '0.2s' }}>
              <div>
                <p className="text-[#6B7280] text-sm font-medium">{quizData.questions.length} question(s) added</p>
                <div className="flex flex-wrap gap-1 mt-2">
                  {quizData.questions.map((q, idx) => (
                    <div 
                      key={idx} 
                      className={`w-3 h-3 rounded-sm ${isQuestionComplete(q) ? 'bg-[#2D6A4F]' : 'bg-[#E5E0D8]'}`}
                      title={`Question ${idx + 1}`}
                    />
                  ))}
                </div>
              </div>
              
              <div className="flex gap-3 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => handleSubmit(false)}
                  disabled={isSubmitting}
                  className="flex-1 sm:flex-none bg-white text-[#1A1A1A] border-2 border-[#E5E0D8] rounded-md px-6 py-3 font-semibold hover:border-[#2D6A4F] hover:text-[#2D6A4F] transition-colors disabled:opacity-70"
                >
                  Save as Draft
                </button>
                <button
                  type="button"
                  onClick={() => handleSubmit(true)}
                  disabled={isSubmitting}
                  className="flex-1 sm:flex-none bg-[#2D6A4F] text-white rounded-md px-8 py-3 font-bold shadow-btn hover:bg-[#1B4332] hover:scale-[1.02] transition-transform disabled:opacity-70 flex justify-center items-center gap-2"
                >
                  {isSubmitting ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    'Publish Quiz ⚡'
                  )}
                </button>
              </div>
            </div>

          </div>

          {/* Sidebar Area (Right) */}
          <div className="w-full lg:w-[30%] order-first lg:order-last mb-6 lg:mb-0">
            <QuizProgressSidebar quizData={quizData} />
          </div>
        </div>
      </div>
    </div>
    </PageTransition>
  );
};

export default CreateQuiz;
