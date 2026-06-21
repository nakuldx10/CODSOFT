import React, { useEffect, useRef } from 'react';
import { FiPlay, FiTrendingUp, FiAward, FiCheckCircle, FiEdit, FiHelpCircle } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

const StatsOverview = ({ stats, attempts, setActiveTab }) => {
  const navigate = useNavigate();
  const barsRef = useRef([]);

  useEffect(() => {
    // Trigger progress bar animations on mount
    setTimeout(() => {
      barsRef.current.forEach(bar => {
        if (bar) {
          bar.style.width = bar.dataset.width;
        }
      });
    }, 100);
  }, [stats]);

  if (!stats) return null;

  const {
    totalAttempts,
    totalCreated,
    avgPercentage,
    passRate,
    passedCount,
    failedCount,
    totalQuestionsAnswered,
    bestScore,
    categoryStats
  } = stats;

  const recentAttempts = attempts.slice(0, 5);

  const getBarColor = (score) => {
    if (score >= 80) return 'bg-[#2D6A4F]';
    if (score >= 60) return 'bg-[#40916C]';
    if (score >= 40) return 'bg-orange-500';
    return 'bg-[#D62828]';
  };

  return (
    <div className="animate-fade-in">
      
      {/* ROW 1: Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        
        {/* Card 1 */}
        <div className="bg-white rounded-md border border-[#E5E0D8] shadow-card p-6 hover:-translate-y-1 hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] transition-all duration-300">
          <div className="w-12 h-12 bg-[#F0FAF2] rounded-md flex items-center justify-center text-[#2D6A4F] text-xl border border-[#2D6A4F]/20">
            <FiPlay />
          </div>
          <div className="text-[#1A1A1A] text-4xl font-black mt-4">{totalAttempts}</div>
          <div className="text-[#6B7280] text-sm mt-1 font-semibold">Quizzes Taken</div>
          <div className="text-xs mt-3 font-medium">
            <span className="text-[#2D6A4F]">{passedCount} passed</span> • <span className="text-[#D62828]">{failedCount} failed</span>
          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-white rounded-md border border-[#E5E0D8] shadow-card p-6 hover:-translate-y-1 hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] transition-all duration-300">
          <div className="w-12 h-12 bg-[#F0FAF2] rounded-md flex items-center justify-center text-[#2D6A4F] text-xl border border-[#2D6A4F]/20">
            <FiTrendingUp />
          </div>
          <div className="text-[#1A1A1A] text-4xl font-black mt-4">{avgPercentage}%</div>
          <div className="text-[#6B7280] text-sm mt-1 font-semibold">Average Score</div>
          <div className="w-full h-1.5 bg-[#E5E0D8] rounded-full mt-3 overflow-hidden">
            <div className="h-full bg-[#2D6A4F] transition-all duration-1000 ease-out w-0" data-width={`${avgPercentage}%`} ref={el => barsRef.current.push(el)}></div>
          </div>
        </div>

        {/* Card 3 */}
        <div className="bg-white rounded-md border border-[#E5E0D8] shadow-card p-6 hover:-translate-y-1 hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] transition-all duration-300">
          <div className="w-12 h-12 bg-[#F0FAF2] rounded-md flex items-center justify-center text-[#2D6A4F] text-xl border border-[#2D6A4F]/20">
            <FiAward />
          </div>
          <div className="text-[#1A1A1A] text-4xl font-black mt-4">{bestScore}%</div>
          <div className="text-[#6B7280] text-sm mt-1 font-semibold">Best Score</div>
          <div className="text-orange-500 text-xs mt-3 font-semibold">Personal record 🏆</div>
        </div>

        {/* Card 4 */}
        <div className="bg-white rounded-md border border-[#E5E0D8] shadow-card p-6 hover:-translate-y-1 hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] transition-all duration-300">
          <div className="w-12 h-12 bg-[#F0FAF2] rounded-md flex items-center justify-center text-[#2D6A4F] text-xl border border-[#2D6A4F]/20">
            <FiCheckCircle />
          </div>
          <div className="text-[#1A1A1A] text-4xl font-black mt-4">{passRate}%</div>
          <div className="text-[#6B7280] text-sm mt-1 font-semibold">Pass Rate</div>
          <div className="text-[#9CA3AF] text-xs mt-3 font-medium">{passedCount} of {totalAttempts} passed</div>
        </div>

      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <div className="bg-white rounded-md border border-[#E5E0D8] shadow-card p-6 hover:-translate-y-1 hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] transition-all duration-300">
          <div className="w-12 h-12 bg-[#F0FAF2] rounded-md flex items-center justify-center text-[#2D6A4F] text-xl border border-[#2D6A4F]/20">
            <FiEdit />
          </div>
          <div className="text-[#1A1A1A] text-4xl font-black mt-4">{totalCreated}</div>
          <div className="text-[#6B7280] text-sm mt-1 font-semibold">Quizzes Created</div>
        </div>
        
        <div className="bg-white rounded-md border border-[#E5E0D8] shadow-card p-6 hover:-translate-y-1 hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] transition-all duration-300">
          <div className="w-12 h-12 bg-[#F0FAF2] rounded-md flex items-center justify-center text-[#2D6A4F] text-xl border border-[#2D6A4F]/20">
            <FiHelpCircle />
          </div>
          <div className="text-[#1A1A1A] text-4xl font-black mt-4">{totalQuestionsAnswered}</div>
          <div className="text-[#6B7280] text-sm mt-1 font-semibold">Questions Answered</div>
          <div className="text-[#9CA3AF] text-xs mt-3 font-medium">Across all attempts</div>
        </div>
      </div>

      {/* ROW 2: Two Column Layout */}
      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* LEFT: Recent Activity */}
        <div className="lg:w-[60%]">
          <h3 className="text-[#1A1A1A] font-bold text-xl">🕐 Recent Activity</h3>
          <p className="text-[#9CA3AF] text-sm mb-6">Your last 5 quiz attempts</p>

          {recentAttempts.length === 0 ? (
            <div className="bg-white rounded-md shadow-card border border-[#E5E0D8] p-10 text-center">
              <div className="text-5xl mb-4">🎯</div>
              <h4 className="text-[#1A1A1A] font-bold text-lg">No attempts yet</h4>
              <p className="text-[#9CA3AF] text-sm mt-2">Start taking quizzes to see your activity here.</p>
              <button 
                onClick={() => navigate('/quizzes')}
                className="mt-6 bg-[#2D6A4F] text-white rounded-md px-6 py-2.5 font-semibold hover:bg-[#1B4332] transition-colors shadow-btn"
              >
                Browse Quizzes
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {recentAttempts.map((attempt) => {
                const date = new Date(attempt.attemptedAt).toLocaleDateString('en-US', {
                  month: 'short', day: 'numeric', year: 'numeric'
                });

                return (
                  <div key={attempt._id} className="bg-white border border-[#E5E0D8] rounded-md p-4 shadow-sm hover:shadow-card hover:border-[#2D6A4F]/50 transition flex items-center gap-4 cursor-pointer" onClick={() => navigate(`/quiz/${attempt.quizId._id}/results`, { state: { result: { attempt, quiz: attempt.quizId } } })}>
                    <div className={`w-12 h-12 rounded-sm flex items-center justify-center text-white font-black text-sm flex-shrink-0 ${attempt.passed ? 'bg-[#2D6A4F]' : 'bg-[#D62828]'}`}>
                      {attempt.percentage}%
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-[#1A1A1A] font-semibold text-sm truncate">{attempt.quizId?.title || 'Unknown Quiz'}</h4>
                      <div className="text-xs text-[#9CA3AF] mt-1 flex items-center gap-2">
                        {attempt.quizId?.category && <span className="bg-[#F5F0E8] px-2 py-0.5 rounded-sm">{attempt.quizId.category}</span>}
                        <span>{date}</span>
                      </div>
                    </div>
                    <div className="flex-shrink-0">
                      {attempt.passed 
                        ? <span className="bg-[#D8F3DC] text-[#2D6A4F] border border-[#40916C]/30 px-3 py-1 rounded-sm text-xs font-bold">✅ Passed</span>
                        : <span className="bg-red-50 text-[#D62828] border border-[#D62828]/30 px-3 py-1 rounded-sm text-xs font-bold">❌ Failed</span>
                      }
                    </div>
                  </div>
                );
              })}

              <div className="text-right mt-4">
                <button 
                  onClick={() => setActiveTab('attempts')}
                  className="text-[#2D6A4F] text-sm font-semibold hover:underline hover:text-[#1B4332]"
                >
                  View All Attempts &rarr;
                </button>
              </div>
            </div>
          )}
        </div>

        {/* RIGHT: Category Performance */}
        <div className="lg:w-[40%]">
          <h3 className="text-[#1A1A1A] font-bold text-xl">📂 Performance by Category</h3>
          <p className="text-[#9CA3AF] text-sm mb-6">Average score per topic</p>

          <div className="bg-white rounded-md shadow-card border border-[#E5E0D8] p-6">
            {categoryStats.length === 0 ? (
              <p className="text-[#9CA3AF] text-sm text-center py-8">Take more quizzes to see category stats</p>
            ) : (
              <div className="space-y-6">
                {categoryStats.map((cat, idx) => (
                  <div key={idx}>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-[#1A1A1A] text-sm font-medium">{cat.category}</span>
                      <span className="text-[#2D6A4F] font-bold text-sm">{cat.avgScore}%</span>
                    </div>
                    <div className="w-full h-2.5 bg-[#E5E0D8] rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all duration-1000 ease-out w-0 ${getBarColor(cat.avgScore)}`}
                        data-width={`${cat.avgScore}%`}
                        ref={el => barsRef.current.push(el)}
                      ></div>
                    </div>
                    <div className="text-[#9CA3AF] text-xs mt-1">{cat.attempts} attempt{cat.attempts !== 1 ? 's' : ''}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>

    </div>
  );
};

export default StatsOverview;
