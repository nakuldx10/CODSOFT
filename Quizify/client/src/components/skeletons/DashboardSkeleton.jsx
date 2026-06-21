import React from 'react';

const DashboardSkeleton = () => {
  return (
    <div className="min-h-screen bg-[#FDFBF7] font-sans text-[#1A1A1A]">
      
      {/* DASHBOARD HERO HEADER SKELETON */}
      <div className="bg-[#1A1A1A] pt-24 pb-12 px-6 animate-pulse">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          
          {/* Left Side */}
          <div>
            <div className="w-32 h-4 bg-white/20 rounded-md mb-2"></div>
            <div className="w-48 h-10 bg-white/30 rounded-md"></div>
            <div className="w-40 h-4 bg-white/20 rounded-md mt-4"></div>
            
            <div className="flex flex-wrap gap-3 mt-6">
              <div className="w-32 h-10 bg-white/30 rounded-md"></div>
              <div className="w-36 h-10 bg-white/20 rounded-md"></div>
            </div>
          </div>

          {/* Right Side Mini Stats */}
          <div className="hidden lg:flex gap-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white/10 rounded-md p-5 border border-white/20 min-w-28">
                <div className="w-16 h-8 bg-white/30 rounded-sm mx-auto"></div>
                <div className="w-20 h-3 bg-white/20 rounded-sm mx-auto mt-2"></div>
              </div>
            ))}
          </div>

        </div>
      </div>

      {/* DASHBOARD TAB NAVIGATION SKELETON */}
      <div className="bg-white sticky top-16 z-40 shadow-sm border-b border-[#E5E0D8] animate-pulse">
        <div className="max-w-7xl mx-auto px-6 overflow-x-auto">
          <div className="flex gap-8 py-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="w-24 h-6 bg-[#E5E0D8] rounded-sm"></div>
            ))}
          </div>
        </div>
      </div>

      {/* DASHBOARD CONTENT AREA SKELETON */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 animate-pulse">
        
        {/* Grid Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mb-8">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white p-6 rounded-md shadow-card border border-[#E5E0D8]">
              <div className="w-10 h-10 bg-[#D8F3DC] rounded-sm mb-4"></div>
              <div className="w-16 h-8 bg-[#E5E0D8] rounded-sm mb-1"></div>
              <div className="w-24 h-4 bg-[#E5E0D8] rounded-sm"></div>
            </div>
          ))}
        </div>

        {/* Lower Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <div className="h-[400px] bg-white rounded-md shadow-card border border-[#E5E0D8] p-6">
              <div className="w-48 h-6 bg-[#E5E0D8] rounded-md mb-6"></div>
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="w-12 h-12 bg-[#F5F0E8] rounded-md"></div>
                    <div className="flex-1 space-y-2 py-1">
                      <div className="w-3/4 h-4 bg-[#E5E0D8] rounded-sm"></div>
                      <div className="w-1/2 h-3 bg-[#E5E0D8] rounded-sm"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <div className="lg:col-span-1">
            <div className="h-[400px] bg-white rounded-md shadow-card border border-[#E5E0D8] p-6">
              <div className="w-40 h-6 bg-[#E5E0D8] rounded-md mb-6"></div>
              <div className="space-y-6">
                {[...Array(4)].map((_, i) => (
                  <div key={i}>
                    <div className="flex justify-between mb-2">
                      <div className="w-20 h-4 bg-[#E5E0D8] rounded-sm"></div>
                      <div className="w-10 h-4 bg-[#E5E0D8] rounded-sm"></div>
                    </div>
                    <div className="w-full h-2 bg-[#E5E0D8] rounded-sm"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};

export default DashboardSkeleton;
