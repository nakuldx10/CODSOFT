import React from 'react';

export const JobCardSkeleton = () => (
  <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 animate-pulse">
    <div className="flex justify-between items-start mb-4">
      <div className="space-y-3 flex-1">
        <div className="h-6 bg-gray-200 rounded w-3/4"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
      </div>
      <div className="w-12 h-12 bg-gray-200 rounded-lg ml-4"></div>
    </div>
    <div className="flex space-x-2 mb-4">
      <div className="h-6 bg-gray-200 rounded w-16"></div>
      <div className="h-6 bg-gray-200 rounded w-16"></div>
    </div>
    <div className="flex justify-between items-center pt-4 border-t border-gray-100">
      <div className="h-4 bg-gray-200 rounded w-1/4"></div>
      <div className="h-8 bg-gray-200 rounded w-24"></div>
    </div>
  </div>
);

export const ApplicationCardSkeleton = () => (
  <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 animate-pulse">
    <div className="flex justify-between items-center mb-4">
      <div className="space-y-3 flex-1">
        <div className="h-6 bg-gray-200 rounded w-1/2"></div>
        <div className="h-4 bg-gray-200 rounded w-1/3"></div>
      </div>
      <div className="h-6 bg-gray-200 rounded-full w-20"></div>
    </div>
    <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100">
      <div className="space-y-2">
        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
      </div>
      <div className="space-y-2">
        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
      </div>
    </div>
  </div>
);

export const DashboardCardSkeleton = () => (
  <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 animate-pulse">
    <div className="flex items-center">
      <div className="p-3 rounded-full bg-gray-200 w-12 h-12"></div>
      <div className="ml-4 space-y-2 flex-1">
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        <div className="h-6 bg-gray-200 rounded w-1/4"></div>
      </div>
    </div>
  </div>
);

export const NotificationSkeleton = () => (
  <div className="flex items-start p-4 border-b border-gray-100 animate-pulse">
    <div className="w-10 h-10 rounded-full bg-gray-200 mr-4"></div>
    <div className="flex-1 space-y-2">
      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
    </div>
  </div>
);
