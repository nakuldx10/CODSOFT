import React, { useEffect } from 'react';
import { FiClock } from 'react-icons/fi';

const QuizTimer = ({ timeElapsed, setTimeElapsed, isRunning }) => {
  useEffect(() => {
    let interval;
    if (isRunning) {
      interval = setInterval(() => {
        setTimeElapsed((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning, setTimeElapsed]);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const isWarning = timeElapsed >= 600; // Warning after 10 mins

  return (
    <div className={`flex items-center gap-2 rounded-md px-4 py-2 font-mono font-bold transition-colors ${
      isWarning ? 'bg-orange-50 text-orange-600 border border-orange-200' : 'bg-[#F0FAF2] text-[#2D6A4F] border border-[#2D6A4F]/20'
    }`}>
      <FiClock className="text-lg" />
      {formatTime(timeElapsed)}
    </div>
  );
};

export default QuizTimer;
