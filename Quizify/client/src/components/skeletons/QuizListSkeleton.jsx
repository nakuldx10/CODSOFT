import React from 'react';
import QuizCardSkeleton from './QuizCardSkeleton';

const QuizListSkeleton = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(8)].map((_, i) => (
        <QuizCardSkeleton key={i} />
      ))}
    </div>
  );
};

export default QuizListSkeleton;
