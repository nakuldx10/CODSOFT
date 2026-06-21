import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FiHelpCircle, FiUsers } from 'react-icons/fi';

const categoryColors = {
  'Science': 'bg-blue-100 text-blue-600',
  'Technology': 'bg-purple-100 text-purple-600',
  'History': 'bg-amber-100 text-amber-600',
  'Geography': 'bg-green-100 text-green-600',
  'Sports': 'bg-red-100 text-red-600',
  'General Knowledge': 'bg-[#D8F3DC] text-[#2D6A4F]',
  'Mathematics': 'bg-indigo-100 text-indigo-600',
  'Entertainment': 'bg-pink-100 text-pink-600',
  'Language': 'bg-orange-100 text-orange-600',
  'Other': 'bg-gray-100 text-gray-600',
};

const categoryEmojis = {
  'Science': '🔬',
  'Technology': '💻',
  'History': '📜',
  'Geography': '🌍',
  'Sports': '⚽',
  'General Knowledge': '🧠',
  'Mathematics': '📐',
  'Entertainment': '🎬',
  'Language': '📖',
  'Other': '📌',
};

const difficultyColors = {
  'Easy': 'bg-[#D8F3DC] text-[#2D6A4F] border border-[#40916C]/30',
  'Medium': 'bg-orange-50 text-orange-600 border border-orange-200',
  'Hard': 'bg-red-50 text-red-600 border border-red-200',
};

const QuizCard = ({ quiz, viewMode = 'grid' }) => {
  const navigate = useNavigate();

  const authorName = quiz.createdBy?.name || 'Anonymous';
  const authorInitial = authorName.charAt(0).toUpperCase();
  const catColor = categoryColors[quiz.category] || categoryColors['Other'];
  const catEmoji = categoryEmojis[quiz.category] || categoryEmojis['Other'];
  const diffColor = difficultyColors[quiz.difficulty] || difficultyColors['Medium'];

  const handleClick = () => {
    navigate(`/quiz/${quiz._id}`);
  };

  if (viewMode === 'list') {
    return (
      <div 
        onClick={handleClick}
        className="w-full flex items-center gap-6 bg-white rounded-md shadow-card p-5 border border-[#E5E0D8] hover:border-[#2D6A4F] transition-all duration-300 cursor-pointer relative overflow-hidden group"
      >
        <div className="w-1.5 bg-[#2D6A4F] rounded-sm self-stretch absolute left-0 top-4 bottom-4"></div>
        
        <div className="flex-1 pl-4">
          <div className="flex gap-2 mb-2">
            <span className={`px-3 py-1 rounded-sm text-xs font-semibold ${catColor}`}>
              {catEmoji} {quiz.category}
            </span>
            <span className={`px-3 py-1 rounded-sm text-xs font-semibold ${diffColor}`}>
              {quiz.difficulty}
            </span>
          </div>
          
          <h3 className="text-[#1A1A1A] font-bold text-lg line-clamp-1 group-hover:text-[#2D6A4F] transition-colors">
            {quiz.title}
          </h3>
          
          <div className="flex items-center gap-4 mt-2 text-[#6B7280] text-sm">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-sm bg-[#F0FAF2] text-[#2D6A4F] flex items-center justify-center text-[10px] font-bold">
                {authorInitial}
              </div>
              <span>by {authorName}</span>
            </div>
            <span>•</span>
            <div className="flex items-center gap-1">
              <FiHelpCircle className="text-[#9CA3AF]" />
              <span>{quiz.questions?.length || 0} Questions</span>
            </div>
            <span>•</span>
            <div className="flex items-center gap-1">
              <FiUsers className="text-[#9CA3AF]" />
              <span>{quiz.totalAttempts || 0} Attempts</span>
            </div>
          </div>
        </div>

        <button className="flex-shrink-0 bg-[#2D6A4F] text-white px-5 py-2.5 rounded-md font-semibold text-sm group-hover:bg-[#1B4332] shadow-btn transition-all">
          Start Quiz →
        </button>
      </div>
    );
  }

  // Grid mode
  return (
    <div 
      onClick={handleClick}
      className="bg-white rounded-md shadow-card p-6 border border-[#E5E0D8] hover:border-[#2D6A4F] hover:-translate-y-1 transition-all duration-300 cursor-pointer group relative overflow-hidden flex flex-col h-full"
    >
      <div className="flex justify-between items-start mb-4">
        <span className={`px-3 py-1 rounded-sm text-xs font-semibold ${catColor}`}>
          {catEmoji} {quiz.category}
        </span>
        <span className={`px-3 py-1 rounded-sm text-xs font-semibold ${diffColor}`}>
          {quiz.difficulty}
        </span>
      </div>

      <h3 className="text-[#1A1A1A] font-bold text-lg line-clamp-2 group-hover:text-[#2D6A4F] transition-colors flex-1">
        {quiz.title}
      </h3>
      
      <p className="text-[#6B7280] text-sm mt-2 line-clamp-2 flex-1">
        {quiz.description}
      </p>

      <div className="flex items-center gap-2 mt-4">
        <div className="w-8 h-8 rounded-sm bg-[#F0FAF2] text-[#2D6A4F] flex items-center justify-center text-sm font-bold">
          {authorInitial}
        </div>
        <span className="text-[#6B7280] text-sm">by {authorName}</span>
      </div>

      <div className="border-t border-[#E5E0D8] mt-4 pt-4">
        <div className="flex justify-between items-center">
          <div className="flex gap-4">
            <div className="flex items-center gap-1 text-[#6B7280] text-sm">
              <FiHelpCircle className="text-[#9CA3AF]" />
              <span>{quiz.questions?.length || 0} Questions</span>
            </div>
            <div className="flex items-center gap-1 text-[#6B7280] text-sm hidden sm:flex">
              <FiUsers className="text-[#9CA3AF]" />
              <span>{quiz.totalAttempts || 0} Attempts</span>
            </div>
          </div>
          
          <button className="bg-[#2D6A4F] text-white px-4 py-2 rounded-md text-sm font-semibold group-hover:bg-[#1B4332] shadow-btn transition-all">
            Start Quiz →
          </button>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 w-full h-1 bg-[#2D6A4F] rounded-b-md scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
    </div>
  );
};

export default QuizCard;
