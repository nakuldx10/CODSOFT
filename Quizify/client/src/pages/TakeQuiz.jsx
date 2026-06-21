import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { FiX } from 'react-icons/fi';
import { getQuizById, submitAttempt } from '../api/quizApi';
import QuizTimer from '../components/QuizTimer';
import QuestionDisplay from '../components/QuestionDisplay';
import usePageTitle from '../hooks/usePageTitle';
import PageTransition from '../components/PageTransition';

const TakeQuiz = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quizStarted, setQuizStarted] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [modalType, setModalType] = useState('submit'); // 'submit' | 'exit'

  usePageTitle(quiz ? `Take: ${quiz.title}` : 'Take Quiz');

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const res = await getQuizById(id);
        setQuiz(res.data.quiz);
      } catch (err) {
        toast.error('Quiz not found');
        navigate('/quizzes');
      } finally {
        setLoading(false);
      }
    };
    fetchQuiz();
  }, [id, navigate]);

  const handleSelectAnswer = (optionIndex) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [currentIndex]: optionIndex,
    }));
  };

  const handleNext = () => {
    if (currentIndex < quiz.questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const handleSkip = () => {
    handleNext();
  };

  const initiateSubmit = () => {
    setModalType('submit');
    setShowConfirmModal(true);
  };

  const initiateExit = () => {
    setModalType('exit');
    setShowConfirmModal(true);
  };

  const executeSubmit = async () => {
    setIsSubmitting(true);
    setShowConfirmModal(false);

    const answers = quiz.questions.map((q, i) => ({
      questionIndex: i,
      selectedAnswer: selectedAnswers[i] ?? -1,
    }));

    try {
      const res = await submitAttempt({
        quizId: quiz._id,
        answers,
        timeTaken: timeElapsed,
      });

      sessionStorage.setItem('quizResult', JSON.stringify(res.data));
      navigate(`/quiz/${quiz._id}/results`, { state: { result: res.data }, replace: true });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit quiz');
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-[#2D6A4F] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!quiz) return null;

  const totalQuestions = quiz.questions.length;
  const answeredCount = Object.keys(selectedAnswers).length;
  const unansweredCount = totalQuestions - answeredCount;
  const progressPercent = ((currentIndex + 1) / totalQuestions) * 100;

  // Render Start Screen
  if (!quizStarted) {
    return (
      <PageTransition>
        <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center p-4">
          <div className="bg-white rounded-md border border-[#E5E0D8] shadow-card max-w-lg w-full p-8 md:p-10 text-center animate-scale-in">
          <div className="text-6xl animate-bounce mb-6">⚡</div>
          <h1 className="text-[#1A1A1A] text-3xl font-extrabold">Get Ready!</h1>
          <h2 className="text-[#2D6A4F] text-xl font-bold mt-2 truncate">{quiz.title}</h2>

          <div className="flex justify-center gap-6 mt-8 p-4 bg-[#F5F0E8] rounded-md">
            <div>
              <div className="text-[#1A1A1A] font-bold text-lg">📝 {totalQuestions}</div>
              <div className="text-[#6B7280] text-xs uppercase tracking-wider mt-1">Questions</div>
            </div>
            <div className="w-px bg-[#E5E0D8]"></div>
            <div>
              <div className="text-[#1A1A1A] font-bold text-lg">⏱️ ~{totalQuestions}</div>
              <div className="text-[#6B7280] text-xs uppercase tracking-wider mt-1">Minutes</div>
            </div>
            <div className="w-px bg-[#E5E0D8]"></div>
            <div>
              <div className="text-[#1A1A1A] font-bold text-lg">🏆 60%</div>
              <div className="text-[#6B7280] text-xs uppercase tracking-wider mt-1">Pass Mark</div>
            </div>
          </div>

          <div className="mt-8 bg-[#F0FAF2] border border-[#2D6A4F]/20 rounded-md p-6 text-left">
            <h3 className="text-[#1A1A1A] font-semibold mb-3 flex items-center gap-2">
              <span>📌</span> Instructions:
            </h3>
            <ul className="text-[#3D3D3D] text-sm space-y-2 pl-2">
              <li>• Read each question carefully.</li>
              <li>• Select one answer per question.</li>
              <li>• You can navigate back and change answers.</li>
              <li>• Submit when you finish all questions.</li>
            </ul>
          </div>

          <button
            onClick={() => setQuizStarted(true)}
            className="w-full mt-8 bg-[#2D6A4F] text-white rounded-md py-4 font-bold text-xl shadow-btn hover:bg-[#1B4332] hover:scale-105 transition-all"
          >
            Start Quiz ⚡
          </button>

          <button
            onClick={() => navigate(-1)}
            className="mt-4 text-[#9CA3AF] text-sm font-medium hover:text-[#2D6A4F] transition-colors"
          >
            &larr; Back to Quiz Info
          </button>
        </div>
      </div>
      </PageTransition>
    );
  }

  // Active Quiz View
  return (
    <PageTransition>
      <div className="min-h-screen bg-[#FDFBF7] flex flex-col relative">
      
      {/* Header Bar */}
      <header className="sticky top-0 z-40 bg-white shadow-sm border-b border-[#E5E0D8] px-4 sm:px-6 py-3 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex-1 w-full sm:w-auto text-center sm:text-left">
          <div className="text-[#2D6A4F] font-bold text-lg">⚡ Quizify</div>
          <div className="text-[#6B7280] text-xs truncate max-w-[200px] mx-auto sm:mx-0">{quiz.title}</div>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center w-full order-last sm:order-none">
          <div className="bg-[#F0FAF2] text-[#2D6A4F] font-semibold text-sm px-6 py-2 rounded-sm border border-[#2D6A4F]/20">
            Question {currentIndex + 1} of {totalQuestions}
          </div>
          <div className="text-[#9CA3AF] text-[10px] sm:text-xs mt-1 uppercase tracking-wider font-semibold">
            {answeredCount}/{totalQuestions} Answered
          </div>
        </div>

        <div className="flex-1 flex justify-end items-center gap-4 w-full sm:w-auto">
          <QuizTimer timeElapsed={timeElapsed} setTimeElapsed={setTimeElapsed} isRunning={!isSubmitting && !showConfirmModal} />
          <button
            onClick={initiateExit}
            className="p-2 rounded-md text-[#9CA3AF] hover:text-[#D62828] hover:bg-[#D62828]/10 transition-colors"
            title="Exit Quiz"
          >
            <FiX className="text-xl" />
          </button>
        </div>
      </header>

      {/* Progress Bar */}
      <div className="w-full h-1.5 bg-[#E5E0D8] sticky top-[72px] sm:top-[68px] z-30">
        <div 
          className="h-full bg-[#2D6A4F] transition-all duration-500 ease-out"
          style={{ width: `${progressPercent}%` }}
        ></div>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 max-w-3xl mx-auto w-full px-4 py-8 sm:py-12 flex flex-col justify-between">
        
        <div className="flex-1">
          <QuestionDisplay
            question={quiz.questions[currentIndex]}
            questionIndex={currentIndex}
            totalQuestions={totalQuestions}
            selectedAnswer={selectedAnswers[currentIndex] ?? null}
            onSelectAnswer={handleSelectAnswer}
          />
        </div>

        {/* Navigation Bar */}
        <div className="mt-12">
          {/* Question Map */}
          <div className="flex justify-center flex-wrap gap-2 mb-8 px-2 max-h-24 sm:max-h-auto overflow-y-auto hidden-scrollbar">
            {quiz.questions.map((_, idx) => {
              const isAnswered = selectedAnswers[idx] !== undefined;
              const isCurrent = idx === currentIndex;

              let circleClass = 'bg-white border border-[#E5E0D8] text-[#9CA3AF] hover:border-[#2D6A4F]/50';
              if (isCurrent) circleClass = 'bg-[#1A1A1A] text-white scale-110 shadow-md border border-[#1A1A1A]';
              else if (isAnswered) circleClass = 'bg-[#D8F3DC] text-[#2D6A4F] border border-[#40916C]/30 opacity-100';

              return (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  className={`w-9 h-9 rounded-sm flex items-center justify-center font-bold text-sm transition-all ${circleClass}`}
                  title={`Question ${idx + 1}`}
                >
                  {idx + 1}
                </button>
              );
            })}
          </div>

          {/* Prev/Next Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <button
              onClick={handlePrev}
              disabled={currentIndex === 0}
              className="w-full sm:w-auto bg-white border-2 border-[#E5E0D8] text-[#1A1A1A] rounded-md px-8 py-4 sm:py-3 font-semibold disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#F5F0E8] transition-colors"
            >
              &larr; Previous
            </button>

            {selectedAnswers[currentIndex] === undefined && currentIndex !== totalQuestions - 1 && (
              <button
                onClick={handleSkip}
                className="text-[#9CA3AF] text-sm font-medium hover:text-[#2D6A4F] transition-colors py-2"
              >
                Skip for now
              </button>
            )}

            {currentIndex < totalQuestions - 1 ? (
              <button
                onClick={handleNext}
                className="w-full sm:w-auto bg-[#2D6A4F] text-white rounded-md px-8 py-4 sm:py-3 font-semibold shadow-btn hover:bg-[#1B4332] hover:-translate-y-0.5 transition-all"
              >
                Next &rarr;
              </button>
            ) : (
              <button
                onClick={initiateSubmit}
                className={`w-full sm:w-auto text-white rounded-md px-8 py-4 sm:py-3 font-bold shadow-btn transition-all ${
                  unansweredCount === 0 
                    ? 'bg-[#2D6A4F] hover:bg-[#1B4332] hover:scale-105 shadow-[0_4px_14px_0_rgba(45,106,79,0.39)]' 
                    : 'bg-[#6B7280] hover:bg-[#3D3D3D]'
                }`}
              >
                Submit Quiz ⚡
              </button>
            )}
          </div>
        </div>

      </main>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-[#1A1A1A]/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-md shadow-card border border-[#E5E0D8] max-w-sm w-full p-8 text-center animate-scale-in">
            <div className="text-5xl mb-4">⚠️</div>
            <h2 className="text-[#1A1A1A] text-2xl font-bold">
              {modalType === 'submit' ? 'Submit Quiz?' : 'Exit Quiz?'}
            </h2>

            <div className="mt-6 bg-[#FDFBF7] border border-[#E5E0D8] rounded-md p-4">
              <div className="text-[#2D6A4F] font-semibold mb-2">
                ✅ {answeredCount} answered
              </div>
              {unansweredCount > 0 && (
                <div className="text-orange-500 font-semibold">
                  ⚠️ {unansweredCount} unanswered
                </div>
              )}
            </div>

            {modalType === 'submit' && unansweredCount > 0 && (
              <p className="text-[#6B7280] text-sm mt-4">
                Unanswered questions will be marked as incorrect.
              </p>
            )}

            {modalType === 'exit' && (
              <p className="text-[#6B7280] text-sm mt-4">
                Your progress will be lost and not saved.
              </p>
            )}

            <div className="flex flex-col sm:flex-row gap-3 mt-8">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="flex-1 bg-white border-2 border-[#E5E0D8] text-[#1A1A1A] rounded-md py-3 font-semibold hover:bg-[#F5F0E8] transition-colors"
              >
                Keep Going
              </button>
              {modalType === 'submit' ? (
                <button
                  onClick={executeSubmit}
                  className="flex-1 bg-[#2D6A4F] text-white rounded-md py-3 font-bold hover:bg-[#1B4332] shadow-btn transition-all"
                >
                  Submit ⚡
                </button>
              ) : (
                <button
                  onClick={() => navigate(-1)}
                  className="flex-1 bg-[#D62828] text-white rounded-md py-3 font-bold hover:bg-[#D62828]/80 shadow-btn transition-all"
                >
                  Exit
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Submitting Overlay */}
      {isSubmitting && (
        <div className="fixed inset-0 bg-white/95 backdrop-blur-md z-50 flex flex-col items-center justify-center animate-fade-in">
          <div className="w-20 h-20 border-4 border-[#2D6A4F] border-t-transparent rounded-full animate-spin"></div>
          <h2 className="text-[#1A1A1A] text-2xl font-bold mt-8">Calculating your results...</h2>
          <p className="text-[#6B7280] mt-2 font-medium">Please wait a moment ⚡</p>
        </div>
      )}

    </div>
    </PageTransition>
  );
};

export default TakeQuiz;
