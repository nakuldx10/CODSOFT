import React from 'react';
import { FiArrowUp, FiArrowDown, FiTrash2 } from 'react-icons/fi';

const QuestionCard = ({
  question,
  index,
  onUpdate,
  onDelete,
  onMoveUp,
  onMoveDown,
  isFirst,
  isLast,
  totalQuestions,
}) => {
  const handleChange = (field, value) => {
    onUpdate(index, { ...question, [field]: value });
  };

  const handleOptionChange = (optIndex, value) => {
    const newOptions = [...question.options];
    newOptions[optIndex] = value;
    onUpdate(index, { ...question, options: newOptions });
  };

  return (
    <div className="relative border border-[#E5E0D8] rounded-md p-6 mb-4 hover:border-[#2D6A4F] transition-colors bg-white shadow-card">
      <div className="absolute left-0 top-4 bottom-4 w-1 bg-[#2D6A4F] rounded-r-sm"></div>

      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center">
          <div className="w-8 h-8 rounded-sm bg-[#F0FAF2] text-[#2D6A4F] font-bold flex items-center justify-center text-sm border border-[#2D6A4F]/20">
            Q{index + 1}
          </div>
          <h4 className="text-[#1A1A1A] font-semibold ml-3">Question {index + 1}</h4>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onMoveUp(index)}
            disabled={isFirst}
            className={`p-2 rounded-md text-[#9CA3AF] hover:text-[#2D6A4F] hover:bg-[#F0FAF2] transition-colors ${
              isFirst ? 'opacity-30 cursor-not-allowed' : ''
            }`}
            title="Move Up"
          >
            <FiArrowUp />
          </button>
          <button
            type="button"
            onClick={() => onMoveDown(index)}
            disabled={isLast}
            className={`p-2 rounded-md text-[#9CA3AF] hover:text-[#2D6A4F] hover:bg-[#F0FAF2] transition-colors ${
              isLast ? 'opacity-30 cursor-not-allowed' : ''
            }`}
            title="Move Down"
          >
            <FiArrowDown />
          </button>
          <button
            type="button"
            onClick={() => onDelete(index)}
            disabled={totalQuestions <= 1}
            className={`p-2 rounded-md text-[#D62828] hover:text-[#D62828] hover:bg-[#D62828]/10 transition-colors ${
              totalQuestions <= 1 ? 'opacity-30 cursor-not-allowed' : ''
            }`}
            title={totalQuestions <= 1 ? 'Cannot delete last question' : 'Delete Question'}
          >
            <FiTrash2 />
          </button>
        </div>
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium text-[#1A1A1A] mb-2">Question Text *</label>
        <textarea
          rows="2"
          value={question.questionText}
          onChange={(e) => handleChange('questionText', e.target.value)}
          placeholder="Type your question here..."
          className="w-full rounded-md border border-[#E5E0D8] px-4 py-3 shadow-sm focus:border-[#2D6A4F] focus:outline-none focus:ring-0 focus:shadow-focus resize-none text-[#1A1A1A] placeholder-[#9CA3AF]"
        />
      </div>

      <div>
        <div className="flex items-center mb-3">
          <span className="text-[#6B7280] font-medium text-sm">Answer Options *</span>
          <span className="text-[#9CA3AF] text-xs ml-2">(Click the box to mark correct answer)</span>
        </div>

        <div className="space-y-3">
          {question.options.map((option, optIndex) => {
            const isCorrect = question.correctAnswer === optIndex;
            const letter = String.fromCharCode(65 + optIndex);

            return (
              <div key={optIndex} className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => handleChange('correctAnswer', optIndex)}
                  className={`w-8 h-8 rounded-sm border-2 flex items-center justify-center transition-colors flex-shrink-0 ${
                    isCorrect ? 'border-[#2D6A4F] bg-[#2D6A4F] text-white' : 'border-[#E5E0D8] bg-white hover:border-[#2D6A4F]/50'
                  }`}
                >
                  {isCorrect && <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                </button>

                <div className={`w-8 h-8 rounded-sm font-bold flex items-center justify-center flex-shrink-0 transition-colors ${
                  isCorrect ? 'bg-[#D8F3DC] text-[#2D6A4F]' : 'bg-[#F5F0E8] text-[#6B7280]'
                }`}>
                  {letter}
                </div>

                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={option}
                    onChange={(e) => handleOptionChange(optIndex, e.target.value)}
                    placeholder={`Option ${letter}`}
                    className={`w-full rounded-md border px-4 py-3 shadow-sm focus:outline-none focus:ring-0 focus:shadow-focus transition-colors text-[#1A1A1A] placeholder-[#9CA3AF] ${
                      isCorrect 
                        ? 'border-[#2D6A4F] bg-[#F0FAF2] focus:border-[#2D6A4F]' 
                        : 'border-[#E5E0D8] bg-white focus:border-[#2D6A4F]'
                    }`}
                  />
                  {isCorrect && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 animate-fade-in">
                      <span className="bg-[#D8F3DC] text-[#2D6A4F] border border-[#40916C]/30 text-xs font-bold px-2 py-1 rounded-sm">
                        ✓ Correct
                      </span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {question.correctAnswer === null && (
          <div className="bg-orange-50 text-orange-600 rounded-md p-3 text-sm mt-4 border border-orange-100 flex items-center gap-2">
            ⚠️ Please select the correct answer
          </div>
        )}
      </div>
    </div>
  );
};

export default QuestionCard;
