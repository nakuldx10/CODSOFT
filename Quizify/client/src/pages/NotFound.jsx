import React from 'react';
import { useNavigate } from 'react-router-dom';
import usePageTitle from '../hooks/usePageTitle';
import PageTransition from '../components/PageTransition';

const NotFound = () => {
  usePageTitle('Page Not Found');
  const navigate = useNavigate();

  return (
    <PageTransition>
      <div className="min-h-screen bg-teal-light flex flex-col items-center justify-center relative overflow-hidden font-sans">
        
        {/* Animated Background Illustration */}
        <div className="relative">
          <h1 className="text-[180px] font-black leading-none select-none text-navy text-center">
            4<span className="text-teal inline-block animate-bounce">0</span>4
          </h1>
          
          <div className="absolute top-0 -left-12 text-4xl animate-spin" style={{ animationDuration: '8s' }}>❓</div>
          <div className="absolute -top-4 -right-10 text-4xl animate-float">🧠</div>
          <div className="absolute bottom-4 -left-8 text-4xl animate-float" style={{ animationDelay: '1s' }}>📝</div>
          <div className="absolute -bottom-2 -right-6 text-4xl animate-bounce" style={{ animationDelay: '0.5s' }}>⚡</div>
        </div>

        {/* Content Card */}
        <div className="bg-white rounded-3xl shadow-2xl px-8 sm:px-12 py-10 max-w-md w-full mx-4 text-center mt-8 z-10">
          <div className="text-6xl mb-4">🔍</div>
          <h2 className="text-navy text-2xl font-extrabold mt-4">Oops! Page Not Found</h2>
          <p className="text-gray-400 text-base mt-3 leading-relaxed">
            Looks like this quiz doesn't exist or the page has been moved.
          </p>

          <div className="mt-6 bg-gray-50 rounded-2xl p-5 text-left border border-gray-100">
            <div className="text-gray-500 text-sm font-semibold mb-3">Try these instead:</div>
            <div className="space-y-3">
              <button onClick={() => navigate('/')} className="flex items-center gap-2 py-1 text-sm text-teal hover:underline font-medium w-full text-left">
                🏠 Go to Home
              </button>
              <button onClick={() => navigate('/quizzes')} className="flex items-center gap-2 py-1 text-sm text-teal hover:underline font-medium w-full text-left">
                📚 Browse Quizzes
              </button>
              <button onClick={() => navigate('/dashboard')} className="flex items-center gap-2 py-1 text-sm text-teal hover:underline font-medium w-full text-left">
                📊 My Dashboard
              </button>
            </div>
          </div>

          <div className="mt-8 space-y-3">
            <button 
              onClick={() => navigate('/')}
              className="w-full bg-teal text-white rounded-2xl py-4 font-bold shadow-lg hover:scale-105 transition-transform"
            >
              ← Back to Home
            </button>
            <button 
              onClick={() => navigate('/quizzes')}
              className="w-full bg-white text-navy border-2 border-navy rounded-2xl py-3 font-semibold hover:bg-gray-50 transition-colors"
            >
              Browse Quizzes →
            </button>
          </div>
        </div>

        {/* Branding Footer */}
        <div className="mt-12 text-center z-10">
          <div className="text-teal font-bold text-lg flex items-center justify-center gap-2">
            ⚡ Quizify
          </div>
          <div className="text-gray-400 text-sm mt-1">
            Create. Share. Quiz. Repeat.
          </div>
        </div>

      </div>
    </PageTransition>
  );
};

export default NotFound;
