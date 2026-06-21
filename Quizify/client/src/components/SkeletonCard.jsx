import React from 'react';

const SkeletonCard = ({ viewMode = 'grid' }) => {
  if (viewMode === 'list') {
    return (
      <div className="w-full flex items-center gap-6 bg-white rounded-md shadow-card p-5 border border-[#E5E0D8] relative overflow-hidden">
        <div className="w-1.5 bg-[#E5E0D8] rounded-sm self-stretch absolute left-0 top-4 bottom-4"></div>
        <div className="flex-1 pl-4">
          <div className="flex gap-2 mb-3">
            <div className="w-24 h-6 bg-[#E5E0D8] rounded-sm animate-pulse"></div>
            <div className="w-20 h-6 bg-[#E5E0D8] rounded-sm animate-pulse"></div>
          </div>
          <div className="w-3/4 h-6 bg-[#E5E0D8] rounded-md animate-pulse mb-3"></div>
          <div className="flex gap-4">
            <div className="w-32 h-4 bg-[#E5E0D8] rounded animate-pulse"></div>
            <div className="w-24 h-4 bg-[#E5E0D8] rounded animate-pulse"></div>
          </div>
        </div>
        <div className="w-28 h-10 bg-[#E5E0D8] rounded-md animate-pulse flex-shrink-0"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-md shadow-card p-6 border border-[#E5E0D8] w-full">
      <div className="flex justify-between items-start mb-4">
        <div className="w-24 h-6 bg-[#E5E0D8] rounded-sm animate-pulse"></div>
        <div className="w-16 h-6 bg-[#E5E0D8] rounded-sm animate-pulse"></div>
      </div>
      <div className="w-full h-6 bg-[#E5E0D8] rounded-md animate-pulse mb-2"></div>
      <div className="w-3/4 h-6 bg-[#E5E0D8] rounded-md animate-pulse mb-4"></div>
      
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 bg-[#E5E0D8] rounded-sm animate-pulse"></div>
        <div className="w-24 h-4 bg-[#E5E0D8] rounded animate-pulse"></div>
      </div>

      <div className="border-t border-[#E5E0D8] mt-4 mb-4"></div>

      <div className="flex justify-between items-center">
        <div className="flex gap-4">
          <div className="w-20 h-4 bg-[#E5E0D8] rounded animate-pulse"></div>
          <div className="w-20 h-4 bg-[#E5E0D8] rounded animate-pulse"></div>
        </div>
        <div className="w-24 h-9 bg-[#E5E0D8] rounded-md animate-pulse"></div>
      </div>
    </div>
  );
};

export default SkeletonCard;
