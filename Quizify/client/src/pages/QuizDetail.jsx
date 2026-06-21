import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { FiCalendar, FiHelpCircle, FiUsers, FiClock, FiAward, FiRotateCcw, FiBarChart, FiShare2 } from 'react-icons/fi';
import { getQuizById } from '../api/quizApi';
import { AuthContext } from '../context/AuthContext';
import Leaderboard from '../components/dashboard/Leaderboard';
import QuizDetailSkeleton from '../components/skeletons/QuizDetailSkeleton';
import usePageTitle from '../hooks/usePageTitle';
import PageTransition from '../components/PageTransition';

const QuizDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);

  usePageTitle(quiz ? quiz.title : 'Quiz Details');

  useEffect(() => {
    fetchQuiz();
  }, [id]);

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

  const handleStartQuiz = () => {
    if (!user) {
      toast.error('Please login to take this quiz', { id: 'auth-toast' });
      navigate('/login', { state: { from: `/quiz/${id}` } });
      return;
    }
    // Navigate to actual quiz taking page (Phase 5)
    navigate(`/quiz/${id}/take`);
  };

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success('🔗 Link copied to clipboard!');
  };

  if (loading) {
    return (
      <PageTransition>
        <QuizDetailSkeleton />
      </PageTransition>
    );
  }

  if (!quiz) return null;

  const questionCount = quiz.questions?.length || 0;
  const estimatedTime = questionCount; // 1 min per question approx
  const authorName = quiz.createdBy?.name || 'Anonymous';
  const authorInitial = authorName.charAt(0).toUpperCase();
  const createdAt = new Date(quiz.createdAt).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric'
  });

  return (
    <PageTransition>
      <div className="min-h-screen bg-[#FDFBF7] pt-24 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
        
        {/* BREADCRUMB */}
        <div className="text-sm text-[#6B7280] mb-6 flex items-center gap-2">
          <Link to="/" className="hover:text-[#2D6A4F] transition-colors">Home</Link>
          <span>/</span>
          <Link to="/quizzes" className="hover:text-[#2D6A4F] transition-colors">Quizzes</Link>
          <span>/</span>
          <span className="text-[#1A1A1A] font-semibold truncate max-w-[200px]">{quiz.title}</span>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* LEFT COLUMN */}
          <div className="lg:w-[65%]">
            
            {/* HERO CARD */}
            <div className="bg-white rounded-md border border-[#E5E0D8] shadow-card p-6 sm:p-8">
              <div className="flex gap-2">
                <span className="bg-[#D8F3DC] text-[#2D6A4F] px-3 py-1 rounded-sm text-xs font-semibold">
                  {quiz.category}
                </span>
                <span className="bg-orange-50 text-orange-600 border border-orange-200 px-3 py-1 rounded-sm text-xs font-semibold">
                  {quiz.difficulty}
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl font-extrabold text-[#1A1A1A] mt-4 leading-tight">
                {quiz.title}
              </h1>

              <div className="flex flex-wrap items-center gap-4 mt-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-sm bg-[#F0FAF2] text-[#2D6A4F] flex items-center justify-center text-sm font-bold">
                    {authorInitial}
                  </div>
                  <span className="text-[#6B7280] text-sm">Created by <span className="font-semibold text-[#1A1A1A]">{authorName}</span></span>
                </div>
                <span className="text-[#9CA3AF] hidden sm:inline">•</span>
                <div className="flex items-center gap-1 text-[#9CA3AF] text-sm">
                  <FiCalendar />
                  <span>{createdAt}</span>
                </div>
              </div>

              <p className="text-[#3D3D3D] text-base mt-6 leading-relaxed">
                {quiz.description}
              </p>

              {/* STATS STRIP */}
              <div className="flex flex-wrap gap-4 sm:gap-8 bg-[#FDFBF7] rounded-md p-4 sm:p-6 mt-8 border border-[#E5E0D8]">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-sm bg-white border border-[#E5E0D8] shadow-sm flex items-center justify-center text-[#2D6A4F]">
                    <FiHelpCircle className="text-xl" />
                  </div>
                  <div>
                    <div className="text-[#1A1A1A] font-bold">{questionCount}</div>
                    <div className="text-[#9CA3AF] text-xs uppercase tracking-wider">Questions</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-sm bg-white border border-[#E5E0D8] shadow-sm flex items-center justify-center text-[#2D6A4F]">
                    <FiUsers className="text-xl" />
                  </div>
                  <div>
                    <div className="text-[#1A1A1A] font-bold">{quiz.totalAttempts || 0}</div>
                    <div className="text-[#9CA3AF] text-xs uppercase tracking-wider">Attempts</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-sm bg-white border border-[#E5E0D8] shadow-sm flex items-center justify-center text-[#2D6A4F]">
                    <FiClock className="text-xl" />
                  </div>
                  <div>
                    <div className="text-[#1A1A1A] font-bold">~{estimatedTime} min</div>
                    <div className="text-[#9CA3AF] text-xs uppercase tracking-wider">Est. Time</div>
                  </div>
                </div>
              </div>
            </div>

            {/* QUESTIONS PREVIEW CARD */}
            <div className="bg-white rounded-md border border-[#E5E0D8] shadow-card p-6 sm:p-8 mt-6">
              <div className="flex justify-between items-center mb-1">
                <h2 className="text-[#1A1A1A] font-bold text-lg flex items-center gap-2">
                  📋 Questions Preview
                </h2>
                <div className="bg-[#D8F3DC] text-[#2D6A4F] text-xs font-bold px-2 py-1 rounded-sm">
                  {questionCount} Questions
                </div>
              </div>
              <p className="text-[#9CA3AF] text-sm mb-6">
                Preview the first 3 questions. Start the quiz to see all questions.
              </p>

              <div className="space-y-0">
                {quiz.questions.slice(0, 3).map((q, idx) => (
                  <div key={idx} className={`flex items-start gap-4 py-5 ${idx !== 2 && idx !== Math.min(quiz.questions.length, 3) - 1 ? 'border-b border-[#E5E0D8]' : ''}`}>
                    <div className="w-8 h-8 rounded-sm bg-[#F0FAF2] text-[#2D6A4F] font-bold flex items-center justify-center text-sm flex-shrink-0 mt-0.5 border border-[#2D6A4F]/20">
                      {idx + 1}
                    </div>
                    <div>
                      <h4 className="text-[#1A1A1A] font-medium text-sm sm:text-base">{q.questionText}</h4>
                      <div className="flex flex-wrap gap-2 mt-3">
                        {q.options.map((opt, oIdx) => (
                          <div key={oIdx} className="bg-[#FDFBF7] border border-[#E5E0D8] text-[#6B7280] rounded-sm px-3 py-1.5 text-xs">
                            {opt}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {questionCount > 3 && (
                <div 
                  onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                  className="text-center text-[#2D6A4F] font-medium text-sm pt-6 mt-2 border-t border-[#E5E0D8] cursor-pointer hover:underline"
                >
                  ... and {questionCount - 3} more questions.
                </div>
              )}
            </div>

            {/* LEADERBOARD CARD */}
            <Leaderboard quizId={quiz._id} quizTitle={quiz.title} />

          </div>

          {/* RIGHT COLUMN */}
          <div className="lg:w-[35%] relative">
            <div className="sticky top-24">
              
              {/* START PANEL CARD */}
              <div className="bg-white rounded-md shadow-card border border-[#E5E0D8] p-6 sm:p-8 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#2D6A4F]/5 rounded-bl-[100px] -z-10 group-hover:scale-110 transition-transform"></div>
                
                <div className="bg-[#2D6A4F] rounded-md p-6 text-center mb-6 shadow-btn transform group-hover:-translate-y-1 transition-transform">
                  <div className="text-white text-4xl mb-2">⚡</div>
                  <h3 className="text-white font-bold text-lg">Ready to Test Your Knowledge?</h3>
                  <p className="text-white/80 text-sm mt-1">{questionCount} questions • ~{estimatedTime} min</p>
                </div>

                <div className="space-y-4 mb-8">
                  <div className="flex items-start gap-3">
                    <div className="bg-[#F0FAF2] p-2 rounded-sm text-[#2D6A4F] mt-0.5"><FiHelpCircle /></div>
                    <span className="text-[#3D3D3D] text-sm leading-relaxed">{questionCount} Multiple Choice Questions</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="bg-[#F0FAF2] p-2 rounded-sm text-[#2D6A4F] mt-0.5"><FiAward /></div>
                    <span className="text-[#3D3D3D] text-sm leading-relaxed">Pass mark: 60% or above</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="bg-[#F0FAF2] p-2 rounded-sm text-[#2D6A4F] mt-0.5"><FiRotateCcw /></div>
                    <span className="text-[#3D3D3D] text-sm leading-relaxed">Retake as many times as you like</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="bg-[#F0FAF2] p-2 rounded-sm text-[#2D6A4F] mt-0.5"><FiBarChart /></div>
                    <span className="text-[#3D3D3D] text-sm leading-relaxed">Instant results and review</span>
                  </div>
                </div>

                <button
                  onClick={handleStartQuiz}
                  className="w-full bg-[#2D6A4F] text-white rounded-md py-4 font-bold text-lg shadow-btn hover:bg-[#1B4332] hover:scale-[1.02] transition-all"
                >
                  Start Quiz ⚡
                </button>

                <div className="flex items-center my-6">
                  <div className="flex-1 border-t border-[#E5E0D8]"></div>
                  <span className="px-3 text-[#9CA3AF] text-sm">or</span>
                  <div className="flex-1 border-t border-[#E5E0D8]"></div>
                </div>

                <button
                  onClick={copyLink}
                  className="w-full bg-white text-[#1A1A1A] border-2 border-[#E5E0D8] rounded-md py-3 font-semibold flex items-center justify-center gap-2 hover:border-[#2D6A4F] hover:text-[#2D6A4F] transition-colors"
                >
                  <FiShare2 /> Copy Quiz Link
                </button>

                {/* Creator Mini Card */}
                <div className="mt-8 bg-[#FDFBF7] rounded-md p-4 border border-[#E5E0D8]">
                  <div className="text-[#9CA3AF] text-[10px] uppercase font-bold tracking-wider mb-2">Quiz By</div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-sm bg-[#F0FAF2] text-[#2D6A4F] flex items-center justify-center font-bold shadow-sm">
                      {authorInitial}
                    </div>
                    <div>
                      <div className="text-[#1A1A1A] font-semibold text-sm">{authorName}</div>
                      <div className="text-[#9CA3AF] text-xs">Quizify Creator</div>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
    </PageTransition>
  );
};

export default QuizDetail;
