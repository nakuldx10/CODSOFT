import React, { useState, useEffect, useContext } from 'react';
import { getQuizLeaderboard } from '../../api/quizApi';
import { AuthContext } from '../../context/AuthContext';
import { FiClock } from 'react-icons/fi';

const Leaderboard = ({ quizId }) => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const res = await getQuizLeaderboard(quizId);
        setLeaderboard(res.data.leaderboard);
      } catch (err) {
        console.error("Failed to fetch leaderboard");
      } finally {
        setLoading(false);
      }
    };
    if (quizId) fetchLeaderboard();
  }, [quizId]);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}m ${s}s`;
  };

  const getInitial = (name) => name ? name.charAt(0).toUpperCase() : '?';

  if (loading) {
    return (
      <div className="bg-white rounded-md border border-[#E5E0D8] shadow-card p-8 mt-6">
        <h3 className="text-[#1A1A1A] font-bold text-xl mb-6">🏆 Leaderboard</h3>
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-12 bg-[#E5E0D8] rounded-md animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  if (leaderboard.length === 0) {
    return (
      <div className="bg-white rounded-md border border-[#E5E0D8] shadow-card p-8 mt-6 text-center">
        <h3 className="text-[#1A1A1A] font-bold text-xl mb-2">🏆 Leaderboard</h3>
        <p className="text-[#9CA3AF] py-8">No attempts yet. Be the first to take this quiz! 🚀</p>
      </div>
    );
  }

  const top3 = leaderboard.slice(0, 3);
  const rest = leaderboard.slice(3, 10);

  // Pad top3 array to ensure rendering layout doesn't break if < 3 entries
  const r1 = top3[0];
  const r2 = top3[1];
  const r3 = top3[2];

  return (
    <div className="bg-white rounded-md border border-[#E5E0D8] shadow-card p-6 sm:p-8 mt-6 animate-fade-in">
      <h3 className="text-[#1A1A1A] font-bold text-xl">🏆 Leaderboard</h3>
      <p className="text-[#9CA3AF] text-sm mt-1 mb-8">Top 10 scores for this quiz</p>

      {/* TOP 3 PODIUM */}
      <div className="flex items-end justify-center gap-2 sm:gap-6 mb-12 h-56">
        
        {/* RANK 2 */}
        {r2 && (
          <div className="flex flex-col items-center animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <div className="relative mb-3">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center text-white font-black text-xl shadow-lg ring-4 ring-white">
                {getInitial(r2.userId?.name)}
              </div>
              <div className="absolute -bottom-2 -right-2 bg-gray-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold border-2 border-white">2</div>
            </div>
            <div className="w-24 sm:w-28 bg-gradient-to-t from-[#E5E0D8] to-[#FDFBF7] rounded-t-md p-3 text-center border-t border-x border-[#E5E0D8] shadow-inner h-32 flex flex-col justify-end">
              <div className="font-bold text-[#1A1A1A] text-xs sm:text-sm truncate w-full">{r2.userId?.name || 'Anon'}</div>
              <div className="font-black text-[#3D3D3D] text-lg mt-1">{r2.percentage}%</div>
              <div className="text-[10px] text-[#9CA3AF] mt-1">{formatTime(r2.timeTaken)}</div>
            </div>
          </div>
        )}

        {/* RANK 1 */}
        {r1 && (
          <div className="flex flex-col items-center animate-slide-up z-10">
            <div className="text-3xl animate-bounce">👑</div>
            <div className="relative mb-3">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-yellow-400 to-amber-500 flex items-center justify-center text-white font-black text-2xl shadow-xl ring-4 ring-white">
                {getInitial(r1.userId?.name)}
              </div>
              <div className="absolute -bottom-2 -right-2 bg-amber-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold border-2 border-white">1</div>
            </div>
            <div className="w-28 sm:w-32 bg-gradient-to-t from-amber-100 to-amber-50/50 rounded-t-md p-4 text-center border-t border-x border-amber-200 shadow-[inset_0_4px_6px_rgba(251,191,36,0.2)] h-40 flex flex-col justify-end">
              <div className="font-bold text-[#1A1A1A] text-sm truncate w-full">{r1.userId?.name || 'Anon'}</div>
              <div className="font-black text-amber-600 text-xl mt-1">{r1.percentage}%</div>
              <div className="text-[10px] sm:text-xs text-amber-500/70 mt-1">{formatTime(r1.timeTaken)}</div>
            </div>
          </div>
        )}

        {/* RANK 3 */}
        {r3 && (
          <div className="flex flex-col items-center animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <div className="relative mb-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-600 to-amber-800 flex items-center justify-center text-white font-black text-lg shadow-md ring-4 ring-white">
                {getInitial(r3.userId?.name)}
              </div>
              <div className="absolute -bottom-2 -right-2 bg-amber-900 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold border-2 border-white">3</div>
            </div>
            <div className="w-24 sm:w-28 bg-gradient-to-t from-orange-100/50 to-orange-50/30 rounded-t-md p-3 text-center border-t border-x border-orange-200 shadow-inner h-24 flex flex-col justify-end">
              <div className="font-bold text-[#1A1A1A] text-xs sm:text-sm truncate w-full">{r3.userId?.name || 'Anon'}</div>
              <div className="font-black text-orange-700 text-lg mt-1">{r3.percentage}%</div>
              <div className="text-[10px] text-[#9CA3AF] mt-1">{formatTime(r3.timeTaken)}</div>
            </div>
          </div>
        )}

      </div>

      {/* REST OF LIST (Ranks 4-10) */}
      {rest.length > 0 && (
        <div className="bg-white rounded-md border border-[#E5E0D8] overflow-hidden">
          {rest.map((entry, index) => {
            const rank = index + 4;
            const isCurrentUser = user && entry.userId?._id === user.id; // User ID from auth context is typically user.id

            return (
              <div key={entry._id} className={`flex items-center gap-3 sm:gap-4 px-4 sm:px-6 py-4 border-b border-[#F5F0E8] last:border-b-0 transition-colors ${isCurrentUser ? 'bg-[#F0FAF2] border-l-4 border-[#2D6A4F]' : 'hover:bg-[#F5F0E8]'}`}>
                
                <div className="w-6 font-bold text-[#9CA3AF] text-sm text-center">{rank}</div>
                
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-sm bg-[#F0FAF2] text-[#2D6A4F] border border-[#2D6A4F]/20 font-bold flex items-center justify-center text-sm flex-shrink-0">
                  {getInitial(entry.userId?.name)}
                </div>
                
                <div className="flex-1 min-w-0 flex items-center gap-2">
                  <span className="font-semibold text-[#1A1A1A] text-sm truncate">{entry.userId?.name || 'Anonymous'}</span>
                  {isCurrentUser && <span className="bg-[#2D6A4F] text-white text-[10px] px-2 py-0.5 rounded-sm font-bold uppercase tracking-wider">You</span>}
                </div>

                {/* Score bar hidden on mobile */}
                <div className="hidden md:block flex-1 max-w-[150px] mx-4">
                  <div className="w-full h-1.5 bg-[#E5E0D8] rounded-full overflow-hidden">
                    <div className="h-full bg-[#2D6A4F] rounded-full" style={{ width: `${entry.percentage}%` }}></div>
                  </div>
                </div>

                <div className="font-black text-[#2D6A4F] text-base w-12 text-right">{entry.percentage}%</div>
                
                <div className="text-xs text-[#9CA3AF] w-12 sm:w-16 flex items-center justify-end gap-1"><FiClock className="hidden sm:inline"/> {formatTime(entry.timeTaken)}</div>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};

export default Leaderboard;
