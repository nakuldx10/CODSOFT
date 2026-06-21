import React from 'react';
import { FiHelpCircle, FiCheck } from 'react-icons/fi';

const QuestionDisplay = ({ question, questionIndex, totalQuestions, selectedAnswer, onSelectAnswer }) => {
  if (!question) return null;

  return (
    <div className="bg-white rounded-md border border-[#E5E0D8] shadow-card p-8 animate-fade-in" key={questionIndex}>
      <div className="flex items-center gap-2 text-[#2D6A4F] font-semibold text-sm mb-4">
        <FiHelpCircle className="text-lg" />
        <span>Question {questionIndex + 1} of {totalQuestions}</span>
      </div>

      <h2 className="text-[#1A1A1A] text-xl font-bold leading-relaxed">
        {question.questionText}
      </h2>

      <div className="mt-8 flex flex-col gap-4">
        {question.options.map((option, idx) => {
          const isSelected = selectedAnswer === idx;
          const letter = String.fromCharCode(65 + idx);

          return (
            <div
              key={idx}
              onClick={() => onSelectAnswer(idx)}
              className={`w-full flex items-center gap-4 rounded-md p-5 cursor-pointer border-2 transition-all duration-200 active:scale-[0.98] ${
                isSelected
                  ? 'border-[#2D6A4F] bg-[#2D6A4F] text-white shadow-btn translate-x-1'
                  : 'border-[#E5E0D8] bg-white hover:border-[#2D6A4F] hover:bg-[#F0FAF2] hover:translate-x-1'
              }`}
            >
              <div className={`w-10 h-10 rounded-sm font-bold flex items-center justify-center flex-shrink-0 transition-colors ${
                isSelected ? 'bg-white/20 text-white' : 'bg-[#F5F0E8] text-[#6B7280]'
              }`}>
                {letter}
              </div>

              <div className={`flex-1 text-base ${isSelected ? 'font-semibold text-white' : 'text-[#3D3D3D]'}`}>
                {option}
              </div>

              {isSelected && (
                <div className="w-6 h-6 rounded-sm bg-white flex items-center justify-center flex-shrink-0 animate-scale-in">
                  <FiCheck className="text-[#2D6A4F] text-lg font-bold" />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default QuestionDisplay;
