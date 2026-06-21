import React, { useEffect, useState } from 'react';

const ResultScoreCard = ({ score, totalQuestions, percentage, passed, timeTaken }) => {
  const [displayScore, setDisplayScore] = useState(0);
  const [displayPercentage, setDisplayPercentage] = useState(0);

  useEffect(() => {
    // Score animation
    let startTimestamp = null;
    const duration = 1500;
    
    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      
      setDisplayScore(Math.floor(progress * score));
      setDisplayPercentage(Math.floor(progress * percentage));
      
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    
    window.requestAnimationFrame(step);
  }, [score, percentage]);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return m > 0 ? `${m}m ${s}s` : `${s}s`;
  };

  const getMessage = (p) => {
    if (p === 100) return "🏆 Perfect Score! Incredible!";
    if (p >= 80) return "🌟 Outstanding Performance!";
    if (p >= 60) return "✅ Well Done! You Passed!";
    if (p >= 40) return "📚 So Close! Keep Practicing!";
    return "💪 Don't Give Up! Try Again!";
  };

  const bgGradient = passed
    ? 'from-[#1B4332] to-[#2D6A4F]' // Dark Green Theme
    : 'from-[#7F1D1D] to-[#D62828]'; // Dark Red Theme

  const wrongCount = totalQuestions - score;

  return (
    <section className={`w-full py-16 px-6 text-center bg-gradient-to-br ${bgGradient}`}>
      <div className="max-w-2xl mx-auto animate-fade-in">
        
        {/* Score Circle */}
        <div className="w-48 h-48 rounded-full mx-auto border-8 border-white/30 bg-white/10 flex flex-col items-center justify-center animate-bounce-in shadow-2xl">
          <div className="text-white text-6xl font-black leading-none">{displayScore}</div>
          <div className="text-white/70 text-2xl font-bold mt-1">/ {totalQuestions}</div>
        </div>

        {/* Percentage Badge */}
        <div className="mt-8 bg-white rounded-md px-8 py-4 inline-block shadow-lg animate-slide-up">
          <div className={`font-black text-4xl ${passed ? 'text-[#2D6A4F]' : 'text-[#D62828]'}`}>
            {displayPercentage}%
          </div>
          <div className={`mt-1 font-bold text-lg ${passed ? 'text-[#2D6A4F]' : 'text-[#D62828]'}`}>
            {passed ? '🎉 Passed!' : '😔 Failed'}
          </div>
        </div>

        <h2 className="text-white text-2xl md:text-3xl font-bold mt-8 animate-slide-up" style={{ animationDelay: '0.2s' }}>
          {getMessage(percentage)}
        </h2>

        {/* Stats Strip */}
        <div className="flex justify-center gap-8 flex-wrap mt-8 animate-slide-up" style={{ animationDelay: '0.4s' }}>
          <div className="bg-white/10 rounded-md px-6 py-3 border border-white/20 backdrop-blur-sm">
            <div className="text-white/90 text-xl font-bold flex items-center gap-2">
              <span>✅</span> {score}
            </div>
            <div className="text-white/60 text-xs uppercase tracking-wider mt-1 font-semibold">Correct</div>
          </div>
          <div className="bg-white/10 rounded-md px-6 py-3 border border-white/20 backdrop-blur-sm">
            <div className="text-white/90 text-xl font-bold flex items-center gap-2">
              <span>❌</span> {wrongCount}
            </div>
            <div className="text-white/60 text-xs uppercase tracking-wider mt-1 font-semibold">Wrong</div>
          </div>
          <div className="bg-white/10 rounded-md px-6 py-3 border border-white/20 backdrop-blur-sm">
            <div className="text-white/90 text-xl font-bold flex items-center gap-2">
              <span>⏱️</span> {formatTime(timeTaken)}
            </div>
            <div className="text-white/60 text-xs uppercase tracking-wider mt-1 font-semibold">Time</div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default ResultScoreCard;
