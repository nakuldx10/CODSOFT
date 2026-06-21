import React from 'react';

const QuizCardSkeleton = () => {
  return (
    <div className="bg-white rounded-md shadow-card border border-[#E5E0D8] p-6 w-full h-[260px] animate-pulse">
      {/* Top row pills */}
      <div className="flex gap-2 mb-4">
        <div className="w-20 h-5 bg-[#E5E0D8] rounded-sm"></div>
        <div className="w-16 h-5 bg-[#E5E0D8] rounded-sm"></div>
      </div>
      
      {/* Title */}
      <div className="w-full h-6 bg-[#E5E0D8] rounded-md mt-4"></div>
      <div className="w-3/4 h-6 bg-[#E5E0D8] rounded-md mt-2"></div>
      
      {/* Author Row */}
      <div className="flex items-center gap-3 mt-4">
        <div className="w-8 h-8 rounded-sm bg-[#E5E0D8] flex-shrink-0"></div>
        <div className="w-24 h-4 bg-[#E5E0D8] rounded-md"></div>
      </div>
      
      {/* Divider */}
      <div className="w-full h-px bg-[#E5E0D8] mt-4"></div>
      
      {/* Bottom Row */}
      <div className="flex justify-between items-center mt-4 pt-2">
        <div className="w-32 h-4 bg-[#E5E0D8] rounded-md"></div>
        <div className="w-20 h-8 bg-[#E5E0D8] rounded-md"></div>
      </div>
    </div>
  );
};

export default QuizCardSkeleton;
