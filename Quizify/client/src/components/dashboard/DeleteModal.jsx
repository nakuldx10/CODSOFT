import React from 'react';

const DeleteModal = ({ isOpen, quizTitle, onConfirm, onCancel, isDeleting }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-[#1A1A1A]/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white rounded-md shadow-card border border-[#E5E0D8] max-w-sm w-full p-8 animate-scale-in">
        <div className="text-5xl text-center mb-4">🗑️</div>
        <h2 className="text-[#1A1A1A] text-2xl font-bold text-center">Delete Quiz?</h2>
        <p className="text-[#2D6A4F] font-semibold text-center mt-2 italic px-4 truncate">"{quizTitle}"</p>

        <div className="mt-6 bg-red-50 border border-[#D62828]/30 rounded-md p-4 text-center">
          <p className="text-[#D62828] text-sm font-medium leading-relaxed">
            ⚠️ This action cannot be undone. All attempts and scores for this quiz will also be deleted permanently.
          </p>
        </div>

        <div className="flex flex-col gap-3 mt-8">
          <button
            onClick={onConfirm}
            disabled={isDeleting}
            className="w-full bg-[#D62828] text-white rounded-md py-3 font-bold hover:bg-[#D62828]/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center h-12 shadow-btn"
          >
            {isDeleting ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : 'Yes, Delete Quiz'}
          </button>
          
          <button
            onClick={onCancel}
            disabled={isDeleting}
            className="w-full bg-white border-2 border-[#E5E0D8] text-[#1A1A1A] rounded-md py-3 font-semibold hover:bg-[#F5F0E8] transition-colors disabled:opacity-50 disabled:cursor-not-allowed h-12"
          >
            Keep Quiz
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;
