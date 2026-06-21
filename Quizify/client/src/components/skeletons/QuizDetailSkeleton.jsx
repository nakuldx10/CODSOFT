import React from 'react';

const QuizDetailSkeleton = () => {
  return (
    <div className="min-h-screen bg-[#FDFBF7] pt-24 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-8">
        
        {/* LEFT COLUMN */}
        <div className="lg:w-[65%] space-y-6">
          {/* Hero Card */}
          <div className="bg-white rounded-md shadow-card border border-[#E5E0D8] p-8 animate-pulse">
            <div className="flex gap-2">
              <div className="w-20 h-5 bg-[#E5E0D8] rounded-sm"></div>
              <div className="w-16 h-5 bg-[#E5E0D8] rounded-sm"></div>
            </div>
            
            <div className="w-3/4 h-8 bg-[#E5E0D8] rounded-md mt-6"></div>
            
            <div className="flex items-center gap-3 mt-4">
              <div className="w-8 h-8 rounded-sm bg-[#E5E0D8]"></div>
              <div className="w-32 h-4 bg-[#E5E0D8] rounded-md"></div>
            </div>
            
            <div className="space-y-2 mt-6">
              <div className="w-full h-4 bg-[#E5E0D8] rounded-md"></div>
              <div className="w-full h-4 bg-[#E5E0D8] rounded-md"></div>
              <div className="w-2/3 h-4 bg-[#E5E0D8] rounded-md"></div>
            </div>

            <div className="w-full h-16 bg-[#E5E0D8] rounded-md mt-8"></div>
          </div>

          {/* Questions Preview */}
          <div className="bg-white rounded-md shadow-card border border-[#E5E0D8] p-6 mt-6 animate-pulse">
            <div className="w-48 h-6 bg-[#E5E0D8] rounded-md mb-6"></div>
            
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-start gap-4 py-4">
                <div className="w-8 h-8 rounded-sm bg-[#E5E0D8] flex-shrink-0"></div>
                <div className="w-full h-4 bg-[#E5E0D8] rounded-md mt-2"></div>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="lg:w-[35%]">
          <div className="bg-white rounded-md shadow-card p-8 border border-[#E5E0D8] animate-pulse sticky top-24">
            <div className="w-full h-28 bg-[#E5E0D8] rounded-md mb-6"></div>
            
            <div className="space-y-4 mb-8">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-sm bg-[#E5E0D8] flex-shrink-0"></div>
                  <div className="w-full h-4 bg-[#E5E0D8] rounded-md"></div>
                </div>
              ))}
            </div>

            <div className="w-full h-14 bg-[#E5E0D8] rounded-md mb-4"></div>
            <div className="w-full h-12 bg-[#E5E0D8] rounded-md"></div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default QuizDetailSkeleton;
