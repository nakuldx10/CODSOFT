import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiClock } from 'react-icons/fi';

const AttemptHistory = ({ attempts, loading }) => {
  const navigate = useNavigate();
  const [statusFilter, setStatusFilter] = useState('all'); // all, passed, failed
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;

  // Extract unique categories
  const categories = ['All', ...new Set(attempts.map(a => a.quizId?.category).filter(Boolean))];

  // Calculate Summary Stats
  const total = attempts.length;
  const passed = attempts.filter(a => a.passed).length;
  const failed = total - passed;
  const avg = total > 0 ? Math.round(attempts.reduce((acc, val) => acc + val.percentage, 0) / total) : 0;

  // Filter logic
  let filtered = attempts;
  if (statusFilter === 'passed') filtered = filtered.filter(a => a.passed);
  if (statusFilter === 'failed') filtered = filtered.filter(a => !a.passed);
  if (categoryFilter !== 'All') filtered = filtered.filter(a => a.quizId?.category === categoryFilter);

  // Pagination logic
  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginated = filtered.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return m > 0 ? `${m}m ${s}s` : `${s}s`;
  };

  const handleReviewClick = (attempt) => {
    navigate(`/quiz/${attempt.quizId._id}/results`, { 
      state: { result: { attempt, quiz: attempt.quizId } } 
    });
  };

  return (
    <div className="animate-fade-in pb-12">
      
      {/* HEADER & FILTERS */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 mb-6">
        <div>
          <h2 className="text-[#1A1A1A] text-2xl font-bold">My Attempt History</h2>
          <p className="text-[#9CA3AF] text-sm mt-1">{total} total attempts</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
          {/* Status Filter */}
          <div className="flex bg-white rounded-md shadow-card border border-[#E5E0D8] p-1">
            <button onClick={() => {setStatusFilter('all'); setPage(1);}} className={`px-4 py-2 text-sm font-semibold rounded-sm flex-1 sm:flex-none transition-colors ${statusFilter === 'all' ? 'bg-[#1A1A1A] text-white' : 'text-[#6B7280] hover:bg-[#F5F0E8]'}`}>All</button>
            <button onClick={() => {setStatusFilter('passed'); setPage(1);}} className={`px-4 py-2 text-sm font-semibold rounded-sm flex-1 sm:flex-none transition-colors ${statusFilter === 'passed' ? 'bg-[#2D6A4F] text-white' : 'text-[#6B7280] hover:bg-[#F5F0E8]'}`}>✅ Passed</button>
            <button onClick={() => {setStatusFilter('failed'); setPage(1);}} className={`px-4 py-2 text-sm font-semibold rounded-sm flex-1 sm:flex-none transition-colors ${statusFilter === 'failed' ? 'bg-[#D62828] text-white' : 'text-[#6B7280] hover:bg-[#F5F0E8]'}`}>❌ Failed</button>
          </div>

          {/* Category Filter */}
          <select 
            value={categoryFilter}
            onChange={(e) => {setCategoryFilter(e.target.value); setPage(1);}}
            className="bg-white rounded-md border border-[#E5E0D8] py-2 px-4 outline-none focus:border-[#2D6A4F] text-[#1A1A1A] cursor-pointer shadow-sm text-sm font-semibold min-w-36"
          >
            {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
          </select>
        </div>
      </div>

      {/* SUMMARY STRIP */}
      {total > 0 && (
        <div className="flex flex-wrap gap-3 mb-8">
          <div className="bg-[#F0FAF2] text-[#2D6A4F] rounded-sm px-4 py-2 text-sm font-bold">🎯 {total} Attempts</div>
          <div className="bg-[#D8F3DC] text-[#2D6A4F] border border-[#40916C]/30 rounded-sm px-4 py-2 text-sm font-bold">✅ {passed} Passed</div>
          <div className="bg-red-50 text-[#D62828] border border-[#D62828]/30 rounded-sm px-4 py-2 text-sm font-bold">❌ {failed} Failed</div>
          <div className="bg-[#E5E0D8] text-[#1A1A1A] rounded-sm px-4 py-2 text-sm font-bold">📊 {avg}% Avg</div>
        </div>
      )}

      {/* LOADING */}
      {loading ? (
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="bg-white h-20 rounded-md animate-pulse"></div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-md shadow-card border border-[#E5E0D8]">
          <div className="text-6xl">🏃</div>
          <h3 className="text-[#1A1A1A] font-bold text-xl mt-4">No attempts found</h3>
          <p className="text-[#9CA3AF] mt-2">Adjust your filters or take a new quiz!</p>
          <button onClick={() => navigate('/quizzes')} className="mt-6 bg-[#2D6A4F] text-white rounded-md px-6 py-3 font-semibold hover:bg-[#1B4332] shadow-btn">
            Explore Quizzes
          </button>
        </div>
      ) : (
        <>
          {/* DESKTOP TABLE */}
          <div className="hidden md:block bg-white rounded-md shadow-card overflow-hidden border border-[#E5E0D8]">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#FDFBF7] border-b border-[#E5E0D8] text-[#6B7280] text-xs font-semibold uppercase tracking-wider">
                  <th className="py-4 px-6">Quiz</th>
                  <th className="py-4 px-4">Category</th>
                  <th className="py-4 px-4 text-center">Score</th>
                  <th className="py-4 px-4">Status</th>
                  <th className="py-4 px-4 text-right">Time</th>
                  <th className="py-4 px-4 text-right">Date</th>
                  <th className="py-4 px-6 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5E0D8]">
                {paginated.map((attempt) => {
                  const date = new Date(attempt.attemptedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
                  return (
                    <tr key={attempt._id} className="hover:bg-[#F0FAF2] transition-colors group">
                      <td className="py-4 px-6 max-w-xs">
                        <div className="text-[#1A1A1A] font-semibold text-sm truncate group-hover:text-[#2D6A4F] transition-colors">
                          {attempt.quizId?.title || 'Deleted Quiz'}
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        {attempt.quizId?.category && (
                          <span className="bg-[#F5F0E8] text-[#6B7280] px-2 py-1 rounded-sm text-xs font-semibold whitespace-nowrap">
                            {attempt.quizId.category}
                          </span>
                        )}
                      </td>
                      <td className="py-4 px-4">
                        <div className={`w-10 h-10 rounded-sm text-white font-bold text-xs flex items-center justify-center mx-auto shadow-sm ${attempt.passed ? 'bg-[#2D6A4F]' : 'bg-[#D62828]'}`}>
                          {attempt.percentage}%
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        {attempt.passed 
                          ? <span className="bg-[#D8F3DC] text-[#2D6A4F] px-3 py-1 rounded-sm text-xs font-bold border border-[#40916C]/30 whitespace-nowrap">✅ Passed</span>
                          : <span className="bg-red-50 text-[#D62828] px-3 py-1 rounded-sm text-xs font-bold border border-[#D62828]/30 whitespace-nowrap">❌ Failed</span>
                        }
                      </td>
                      <td className="py-4 px-4 text-right text-[#6B7280] text-sm whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5"><FiClock className="text-[#9CA3AF]"/> {formatTime(attempt.timeTaken)}</div>
                      </td>
                      <td className="py-4 px-4 text-right text-[#9CA3AF] text-sm whitespace-nowrap">{date}</td>
                      <td className="py-4 px-6 text-right">
                        <button onClick={() => handleReviewClick(attempt)} className="text-[#2D6A4F] font-semibold text-sm hover:underline hover:text-[#1B4332] whitespace-nowrap">
                          Review &rarr;
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* MOBILE CARDS */}
          <div className="md:hidden space-y-4">
            {paginated.map((attempt) => {
              const date = new Date(attempt.attemptedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
              return (
                <div key={attempt._id} className={`bg-white rounded-md p-5 shadow-card border-l-4 ${attempt.passed ? 'border-[#2D6A4F]' : 'border-[#D62828]'}`}>
                  
                  <div className="flex justify-between items-start gap-4">
                    <h4 className="text-[#1A1A1A] font-bold text-sm leading-tight">{attempt.quizId?.title || 'Deleted Quiz'}</h4>
                    {attempt.passed 
                      ? <span className="bg-[#D8F3DC] text-[#2D6A4F] px-2 py-0.5 rounded-sm text-[10px] font-bold border border-[#40916C]/30 whitespace-nowrap mt-0.5">✅ Pass</span>
                      : <span className="bg-red-50 text-[#D62828] px-2 py-0.5 rounded-sm text-[10px] font-bold border border-[#D62828]/30 whitespace-nowrap mt-0.5">❌ Fail</span>
                    }
                  </div>

                  {attempt.quizId?.category && (
                    <div className="mt-2 text-xs text-[#6B7280]">{attempt.quizId.category}</div>
                  )}

                  <div className="flex items-center gap-4 mt-4 bg-[#FDFBF7] rounded-md p-3 border border-[#E5E0D8]">
                    <div className={`w-12 h-12 rounded-sm text-white font-black text-sm flex items-center justify-center shadow-md ${attempt.passed ? 'bg-[#2D6A4F]' : 'bg-[#D62828]'}`}>
                      {attempt.percentage}%
                    </div>
                    <div>
                      <div className="text-[#6B7280] text-xs font-semibold uppercase tracking-wider">Score</div>
                      <div className="text-[#1A1A1A] font-bold text-sm">{attempt.score} / {attempt.totalQuestions}</div>
                    </div>
                  </div>

                  <div className="flex justify-between items-center mt-4 pt-3 border-t border-[#E5E0D8]">
                    <div className="flex flex-col gap-1">
                      <span className="text-[#9CA3AF] text-xs flex items-center gap-1"><FiClock/> {formatTime(attempt.timeTaken)}</span>
                      <span className="text-[#9CA3AF] text-xs">{date}</span>
                    </div>
                    <button onClick={() => handleReviewClick(attempt)} className="bg-[#F0FAF2] text-[#2D6A4F] px-4 py-2 rounded-sm text-sm font-bold border border-[#2D6A4F]/20">
                      Review
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* PAGINATION */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-4 mt-8">
              <button 
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-4 py-2 bg-white rounded-md shadow-card text-[#1A1A1A] font-semibold disabled:opacity-50 border border-[#E5E0D8]"
              >
                &larr; Prev
              </button>
              <span className="text-[#6B7280] text-sm font-medium">Page {page} of {totalPages}</span>
              <button 
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-4 py-2 bg-white rounded-md shadow-card text-[#1A1A1A] font-semibold disabled:opacity-50 border border-[#E5E0D8]"
              >
                Next &rarr;
              </button>
            </div>
          )}
        </>
      )}

    </div>
  );
};

export default AttemptHistory;
