import React from 'react';
import { FiCheck, FiX } from 'react-icons/fi';

const AnswerReview = ({ questions, answers, filter }) => {
  const filteredIndexes = answers.reduce((acc, ans, idx) => {
    if (filter === 'all') acc.push(idx);
    else if (filter === 'correct' && ans.isCorrect) acc.push(idx);
    else if (filter === 'wrong' && !ans.isCorrect) acc.push(idx);
    return acc;
  }, []);

  if (filteredIndexes.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-md shadow-card border border-[#E5E0D8] mt-6">
        <p className="text-[#6B7280]">No questions match this filter.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 mt-6">
      {filteredIndexes.map((idx) => {
        const question = questions[idx];
        const answerObj = answers[idx];
        const { selectedAnswer, correctAnswer, isCorrect } = answerObj;
        const isSkipped = selectedAnswer === -1 || selectedAnswer === null;

        // Card styling based on result
        let cardClass = '';
        let badgeClass = '';
        let badgeText = '';
        let numberClass = '';

        if (isCorrect) {
          cardClass = 'border-l-4 border-[#40916C] bg-[#F0FAF2]';
          badgeClass = 'bg-[#D8F3DC] text-[#2D6A4F]';
          badgeText = '✅ Correct';
          numberClass = 'bg-[#2D6A4F] text-white';
        } else if (isSkipped) {
          cardClass = 'border-l-4 border-[#E5E0D8] bg-[#FDFBF7]';
          badgeClass = 'bg-[#E5E0D8] text-[#6B7280]';
          badgeText = '⏭️ Skipped';
          numberClass = 'bg-[#9CA3AF] text-white';
        } else {
          cardClass = 'border-l-4 border-[#D62828] bg-red-50/50';
          badgeClass = 'bg-red-100 text-[#D62828]';
          badgeText = '❌ Incorrect';
          numberClass = 'bg-[#D62828] text-white';
        }

        return (
          <div key={idx} className={`rounded-md p-6 shadow-card ${cardClass}`}>
            <div className="flex justify-between items-start mb-4">
              <div className={`w-8 h-8 rounded-sm font-bold text-sm flex items-center justify-center flex-shrink-0 ${numberClass}`}>
                {idx + 1}
              </div>
              <div className={`px-3 py-1 rounded-sm text-xs font-bold ${badgeClass}`}>
                {badgeText}
              </div>
            </div>

            <h3 className="text-[#1A1A1A] font-semibold text-lg mb-6 leading-relaxed">
              {question.questionText}
            </h3>

            <div className="flex flex-col gap-3">
              {question.options.map((opt, optIdx) => {
                const isThisCorrect = correctAnswer === optIdx;
                const isThisSelected = selectedAnswer === optIdx;
                const letter = String.fromCharCode(65 + optIdx);

                let optCardClass = 'bg-white border-[#E5E0D8] hover:border-[#9CA3AF]';
                let optCircleClass = 'bg-[#F5F0E8] text-[#6B7280]';
                let optTextClass = 'text-[#6B7280]';
                let rightIcon = null;

                if (isThisCorrect) {
                  optCardClass = 'bg-[#D8F3DC] border-[#40916C]/50';
                  optCircleClass = 'bg-[#2D6A4F] text-white';
                  optTextClass = 'text-[#2D6A4F] font-semibold';
                  rightIcon = <FiCheck className="text-[#2D6A4F] text-xl" />;
                } else if (isThisSelected && !isThisCorrect) {
                  optCardClass = 'bg-red-50 border-[#D62828]/50';
                  optCircleClass = 'bg-[#D62828] text-white';
                  optTextClass = 'text-[#D62828] font-semibold';
                  rightIcon = <FiX className="text-[#D62828] text-xl" />;
                }

                return (
                  <div key={optIdx} className={`flex items-center gap-3 rounded-md p-4 border transition-colors ${optCardClass}`}>
                    <div className={`w-8 h-8 rounded-sm flex items-center justify-center font-bold text-sm flex-shrink-0 ${optCircleClass}`}>
                      {letter}
                    </div>
                    <div className={`flex-1 ${optTextClass}`}>
                      {opt}
                    </div>
                    {rightIcon && <div className="flex-shrink-0">{rightIcon}</div>}
                  </div>
                );
              })}
            </div>

            {(!isCorrect || isSkipped) && (
              <div className="mt-6 bg-orange-50 border-l-4 border-orange-400 rounded-r-md p-4">
                <div className="flex items-start gap-2">
                  <span className="text-lg">💡</span>
                  <div>
                    <span className="text-orange-800 font-semibold text-sm block mb-1">Correct Answer:</span>
                    <span className="text-orange-700 text-sm">{question.options[correctAnswer]}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default AnswerReview;
