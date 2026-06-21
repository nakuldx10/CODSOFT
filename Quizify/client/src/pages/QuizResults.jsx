import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { FiShare2, FiRefreshCcw, FiList, FiHome } from 'react-icons/fi';
import ResultScoreCard from '../components/ResultScoreCard';
import AnswerReview from '../components/AnswerReview';
import usePageTitle from '../hooks/usePageTitle';
import PageTransition from '../components/PageTransition';

const QuizResults = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [resultData, setResultData] = useState(null);
  const [filter, setFilter] = useState('all'); // 'all' | 'correct' | 'wrong'

  usePageTitle('Quiz Results');

  useEffect(() => {
    // Try to get data from location state first, then fallback to sessionStorage
    let data = location.state?.result;
    
    if (!data) {
      const sessionData = sessionStorage.getItem('quizResult');
      if (sessionData) {
        try {
          data = JSON.parse(sessionData);
        } catch (e) {
          console.error("Failed to parse session data", e);
        }
      }
    }

    if (!data || !data.attempt || !data.quiz) {
      toast.error('No recent quiz result found.');
      navigate('/quizzes', { replace: true });
      return;
    }

    setResultData(data);
  }, [location, navigate]);

  if (!resultData) return null;

  const { attempt, quiz } = resultData;

  const handleShare = () => {
    const text = `I scored ${attempt.percentage}% on "${quiz.title}" on Quizify! 🎉`;
    navigator.clipboard.writeText(text);
    toast.success('Result copied to clipboard!');
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-[#FDFBF7] font-sans text-[#1A1A1A] pb-20">
      
      {/* SECTION 1 - SCORE HERO */}
      <ResultScoreCard
        score={attempt.score}
        totalQuestions={attempt.totalQuestions}
        percentage={attempt.percentage}
        passed={attempt.passed}
        timeTaken={attempt.timeTaken}
      />

      {/* SECTION 2 - ACTION BUTTONS */}
      <section className="bg-white py-8 px-6 border-b border-[#E5E0D8] shadow-card relative z-10 -mt-6">
        <div className="max-w-4xl mx-auto flex flex-wrap justify-center gap-4">
          <button
            onClick={() => navigate(`/quiz/${id}/take`, { replace: true })}
            className="flex items-center gap-2 bg-[#2D6A4F] text-white rounded-md px-6 sm:px-8 py-4 font-bold shadow-btn hover:bg-[#1B4332] hover:scale-105 transition-all w-full sm:w-auto justify-center"
          >
            <FiRefreshCcw /> Try Again
          </button>
          
          <button
            onClick={() => navigate('/quizzes')}
            className="flex items-center gap-2 bg-white text-[#1A1A1A] border-2 border-[#E5E0D8] rounded-md px-6 sm:px-8 py-4 font-semibold hover:border-[#2D6A4F] hover:text-[#2D6A4F] transition-colors w-full sm:w-auto justify-center"
          >
            <FiList /> Browse Quizzes
          </button>
          
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 bg-white text-[#6B7280] border-2 border-[#E5E0D8] rounded-md px-6 sm:px-8 py-4 font-semibold hover:border-[#6B7280] hover:text-[#1A1A1A] transition-colors w-full sm:w-auto justify-center"
          >
            <FiHome /> Home
          </button>

          {attempt.passed && (
            <button
              onClick={handleShare}
              className="flex items-center gap-2 bg-gradient-to-r from-yellow-400 to-orange-400 text-white rounded-md px-6 sm:px-8 py-4 font-bold shadow-btn hover:scale-105 transition-all w-full sm:w-auto justify-center"
            >
              <FiShare2 /> Share Result
            </button>
          )}
        </div>
      </section>

      {/* SECTION 3 - DETAILED REVIEW */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 pt-16">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h2 className="text-[#1A1A1A] text-2xl font-bold flex items-center gap-2">
              <span>📋</span> Answer Review
            </h2>
            <p className="text-[#9CA3AF] text-sm mt-1">{attempt.totalQuestions} Questions</p>
          </div>

          <div className="flex bg-white rounded-md shadow-card border border-[#E5E0D8] p-1 w-full sm:w-auto">
            <button
              onClick={() => setFilter('all')}
              className={`flex-1 sm:flex-none px-4 py-2 rounded-sm text-sm font-semibold transition-colors ${
                filter === 'all' ? 'bg-[#2D6A4F] text-white shadow-btn' : 'text-[#6B7280] hover:bg-[#F5F0E8]'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilter('correct')}
              className={`flex-1 sm:flex-none px-4 py-2 rounded-sm text-sm font-semibold transition-colors ${
                filter === 'correct' ? 'bg-[#2D6A4F] text-white shadow-btn' : 'text-[#6B7280] hover:bg-[#F5F0E8]'
              }`}
            >
              ✅ Correct
            </button>
            <button
              onClick={() => setFilter('wrong')}
              className={`flex-1 sm:flex-none px-4 py-2 rounded-sm text-sm font-semibold transition-colors ${
                filter === 'wrong' ? 'bg-[#2D6A4F] text-white shadow-btn' : 'text-[#6B7280] hover:bg-[#F5F0E8]'
              }`}
            >
              ❌ Wrong
            </button>
          </div>
        </div>

        <AnswerReview 
          questions={quiz.questions} 
          answers={attempt.answers} 
          filter={filter} 
        />
      </section>

      {/* SECTION 4 - QUIZ INFO FOOTER */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 mt-12 pt-12 border-t border-[#E5E0D8]">
        <div className="bg-white rounded-md shadow-card border border-[#E5E0D8] p-6 sm:p-8 flex flex-col sm:flex-row justify-between items-center gap-6 text-center sm:text-left">
          <div>
            <h4 className="text-[#1A1A1A] font-bold text-lg">{quiz.title}</h4>
            <p className="text-[#9CA3AF] text-sm mt-1">
              Want to learn more about this topic?
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
            <button 
              onClick={() => navigate(`/quiz/${id}`)}
              className="text-[#2D6A4F] font-semibold text-sm hover:underline hover:text-[#1B4332] w-full sm:w-auto py-2"
            >
              View Quiz Details
            </button>
            <span className="hidden sm:inline text-[#E5E0D8]">|</span>
            <button 
              onClick={() => navigate('/quizzes')}
              className="text-[#6B7280] font-semibold text-sm hover:text-[#1A1A1A] hover:underline w-full sm:w-auto py-2"
            >
              Browse Similar Quizzes
            </button>
          </div>
        </div>
      </section>

    </div>
    </PageTransition>
  );
};

export default QuizResults;
