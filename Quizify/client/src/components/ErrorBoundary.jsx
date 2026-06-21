import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error('Quizify Error Caught in Boundary:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#E8FAF9] flex items-center justify-center flex-col text-center p-6 font-sans">
          
          <div className="text-8xl mb-6 animate-bounce">
            ⚡
          </div>
          
          <h1 className="text-4xl font-extrabold text-navy mb-4">
            Something went wrong
          </h1>
          
          <p className="text-gray-500 max-w-md mb-8 text-lg">
            Quizify hit an unexpected error. Don't worry, your data is safe. Let's get you back on track.
          </p>
          
          <button
            onClick={() => window.location.href = '/'}
            className="bg-teal text-white px-8 py-4 rounded-2xl font-bold shadow-lg hover:scale-105 transition-transform"
          >
            Back to Home
          </button>

          <div className="mt-12 text-gray-400 text-sm">
            <p>If this issue persists, please contact support.</p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
