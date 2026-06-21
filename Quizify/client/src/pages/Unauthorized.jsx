import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import usePageTitle from '../hooks/usePageTitle';
import PageTransition from '../components/PageTransition';

const Unauthorized = () => {
  usePageTitle('Unauthorized Access');
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <PageTransition>
      <div className="min-h-screen bg-[#FDFBF7] flex flex-col items-center justify-center relative overflow-hidden font-sans">
        
        {/* Animated Background Illustration */}
        <div className="relative z-10 text-center">
          <div className="text-[120px] font-black leading-none select-none text-[#1A1A1A] flex justify-center items-center">
            <span className="inline-block animate-bounce text-8xl">🔒</span>
          </div>
        </div>

        {/* Content Card */}
        <div className="bg-white rounded-[10px] shadow-card px-8 sm:px-12 py-10 max-w-md w-full mx-4 text-center mt-8 z-10 border border-[#E5E0D8]">
          <h2 className="text-[#1A1A1A] text-3xl font-extrabold mt-2">Access Restricted</h2>
          <p className="text-[#6B7280] text-base mt-4 leading-relaxed">
            You need to be logged in to access this page. Please sign in to continue your Quizify journey.
          </p>

          <div className="mt-8 space-y-4 max-w-xs mx-auto">
            <button 
              onClick={() => navigate('/login', { state: { from: location.state?.from || '/' } })}
              className="w-full bg-[#2D6A4F] text-white rounded-md py-4 font-bold shadow-btn hover:bg-[#1B4332] transition-colors"
            >
              Login to Continue
            </button>
            <button 
              onClick={() => navigate('/register')}
              className="w-full bg-white text-[#1A1A1A] border-2 border-[#E5E0D8] rounded-md py-3 font-semibold hover:border-[#2D6A4F] hover:text-[#2D6A4F] transition-colors"
            >
              Create Free Account
            </button>
          </div>
        </div>

        {/* Branding Footer */}
        <div className="mt-12 text-center z-10">
          <div className="text-[#40916C] font-bold text-lg flex items-center justify-center gap-2">
            ⚡ Quizify
          </div>
        </div>

      </div>
    </PageTransition>
  );
};

export default Unauthorized;
