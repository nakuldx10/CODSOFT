import React from 'react';
import { FaCheckCircle, FaCircle } from 'react-icons/fa';

const QuizProgressSidebar = ({ quizData }) => {
  const { title, description, category, difficulty, questions } = quizData;

  const getDifficultyColor = (diff) => {
    if (!diff) return 'bg-[#E5E0D8] text-[#9CA3AF]';
    switch (diff.toLowerCase()) {
      case 'easy': return 'bg-[#D8F3DC] text-[#2D6A4F] border border-[#40916C]/30';
      case 'medium': return 'bg-orange-50 text-orange-600 border border-orange-200';
      case 'hard': return 'bg-red-50 text-red-600 border border-red-200';
      default: return 'bg-[#E5E0D8] text-[#6B7280]';
    }
  };

  const isQuestionComplete = (q) => {
    return (
      q.questionText.trim().length >= 10 &&
      q.options.every(opt => opt.trim().length > 0) &&
      q.correctAnswer !== null
    );
  };

  const checklist = [
    { label: 'Quiz title added', isComplete: title.trim().length >= 5 },
    { label: 'Description added', isComplete: description.trim().length >= 10 },
    { label: 'Category selected', isComplete: category !== '' },
    { label: 'Difficulty selected', isComplete: difficulty !== '' },
    { label: 'At least 1 question', isComplete: questions.length >= 1 },
    { label: 'All questions complete', isComplete: questions.length > 0 && questions.every(isQuestionComplete) },
  ];

  const completeCount = checklist.filter(item => item.isComplete).length;
  const progressPercent = Math.round((completeCount / checklist.length) * 100);

  return (
    <div className="sticky top-24 space-y-4">
      {/* CARD 1: Live Preview */}
      <div className="hidden md:block bg-white rounded-md border border-[#E5E0D8] shadow-card p-6">
        <h3 className="text-[#1A1A1A] font-bold mb-4">📋 Live Preview</h3>
        <div className="border border-[#E5E0D8] rounded-md p-4 bg-[#FDFBF7]">
          <div className="flex justify-between items-center mb-3">
            <span className={`text-xs font-semibold rounded-sm px-3 py-1 ${category ? 'bg-[#D8F3DC] text-[#2D6A4F]' : 'bg-[#E5E0D8] text-[#9CA3AF]'}`}>
              {category || 'Category'}
            </span>
            <span className={`text-xs font-semibold rounded-sm px-3 py-1 ${getDifficultyColor(difficulty)}`}>
              {difficulty || 'Difficulty'}
            </span>
          </div>
          <h4 className="text-[#1A1A1A] font-bold text-base line-clamp-2 break-words">
            {title || 'Quiz Title...'}
          </h4>
          <p className="text-[#9CA3AF] text-sm mt-2 line-clamp-2 break-words min-h-[40px]">
            {description || 'Quiz description will appear here...'}
          </p>
          <div className="mt-4 pt-3 border-t border-[#E5E0D8]">
            <span className="text-[#6B7280] text-sm">📝 {questions.length} Questions</span>
          </div>
        </div>
      </div>

      {/* CARD 2: Completion Checklist */}
      <div className="bg-white rounded-md border border-[#E5E0D8] shadow-card p-6">
        <h3 className="text-[#1A1A1A] font-bold mb-4">✅ Checklist</h3>
        <ul className="space-y-3 mb-6">
          {checklist.map((item, index) => (
            <li key={index} className="flex items-center gap-3">
              {item.isComplete ? (
                <FaCheckCircle className="text-[#2D6A4F] flex-shrink-0" />
              ) : (
                <FaCircle className="text-[#E5E0D8] flex-shrink-0 border-[#E5E0D8] rounded-sm border-2 text-transparent" size={14} />
              )}
              <span className={`text-sm ${item.isComplete ? 'text-[#6B7280] line-through' : 'text-[#6B7280]'}`}>
                {item.label}
              </span>
            </li>
          ))}
        </ul>

        <div className="pt-4 border-t border-[#E5E0D8]">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-[#6B7280] font-medium">Completion</span>
            <span className="text-[#2D6A4F] font-bold">{progressPercent}%</span>
          </div>
          <div className="w-full bg-[#E5E0D8] rounded-full h-2">
            <div 
              className="bg-[#2D6A4F] h-2 rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* CARD 3: Quick Tips */}
      <div className="hidden md:block bg-[#1A1A1A] rounded-md shadow-card p-6 text-white border border-[#1A1A1A]">
        <h3 className="font-bold mb-4 text-[#FDFBF7]">💡 Tips</h3>
        <ul className="space-y-3">
          <li className="flex gap-3">
            <div className="w-5 h-5 rounded-sm bg-[#2D6A4F] text-white flex items-center justify-center text-xs font-bold flex-shrink-0">1</div>
            <span className="text-[#9CA3AF] text-xs">Keep questions clear and concise</span>
          </li>
          <li className="flex gap-3">
            <div className="w-5 h-5 rounded-sm bg-[#2D6A4F] text-white flex items-center justify-center text-xs font-bold flex-shrink-0">2</div>
            <span className="text-[#9CA3AF] text-xs">Make wrong answers believable</span>
          </li>
          <li className="flex gap-3">
            <div className="w-5 h-5 rounded-sm bg-[#2D6A4F] text-white flex items-center justify-center text-xs font-bold flex-shrink-0">3</div>
            <span className="text-[#9CA3AF] text-xs">Add at least 5 questions for a good quiz</span>
          </li>
          <li className="flex gap-3">
            <div className="w-5 h-5 rounded-sm bg-[#2D6A4F] text-white flex items-center justify-center text-xs font-bold flex-shrink-0">4</div>
            <span className="text-[#9CA3AF] text-xs">Use categories to help users find your quiz</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default QuizProgressSidebar;
