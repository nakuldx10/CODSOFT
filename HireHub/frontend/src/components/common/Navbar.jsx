import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';


const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isAuthenticated, user, logout } = useAuth();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id) => {
    setIsMobileMenuOpen(false);
    if (location.pathname !== '/') {
      window.location.href = `/#${id}`;
      return;
    }
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-300 border-b border-border-color backdrop-blur ${
        isScrolled
          ? 'py-3 bg-white/80 dark:bg-navy-900/80 shadow-md'
          : 'py-5 bg-white/50 dark:bg-navy-900/50'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center" onClick={() => setIsMobileMenuOpen(false)}>
            <span className="text-2xl font-bold text-primary-color">
              Hire<span className="text-primary">Hub</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-8">
            <button onClick={() => scrollToSection('hero')} className="text-muted-color hover:text-primary-color transition-colors font-medium">Home</button>
            <button onClick={() => scrollToSection('jobs')} className="text-muted-color hover:text-primary-color transition-colors font-medium">Jobs</button>
            <button onClick={() => scrollToSection('about')} className="text-muted-color hover:text-primary-color transition-colors font-medium">About</button>
            <button onClick={() => scrollToSection('contact')} className="text-muted-color hover:text-primary-color transition-colors font-medium">Contact</button>
          </div>

          {/* Right Side */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <Link
                  to={user?.role === 'employer' ? '/employer/dashboard' : '/candidate/dashboard'}
                  className="btn-primary"
                >
                  Dashboard
                </Link>
                <button
                  onClick={logout}
                  className="px-4 py-2 rounded-lg text-muted-color hover:text-primary-color hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors font-medium border border-transparent hover:border-border-color"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="px-4 py-2 rounded-lg text-primary-color font-medium border border-border-color hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                  Login
                </Link>
                <Link to="/register" className="btn-primary">
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-2">

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-primary-color hover:text-primary focus:outline-none"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      <div
        className={`md:hidden absolute w-full bg-white dark:bg-navy-900 border-b border-border-color shadow-lg transition-all duration-300 ease-in-out overflow-hidden ${
          isMobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="px-4 pt-2 pb-6 space-y-4 flex flex-col">
          <button onClick={() => scrollToSection('hero')} className="text-left text-primary-color hover:text-primary font-medium py-2 border-b border-border-color">Home</button>
          <button onClick={() => scrollToSection('jobs')} className="text-left text-primary-color hover:text-primary font-medium py-2 border-b border-border-color">Jobs</button>
          <button onClick={() => scrollToSection('about')} className="text-left text-primary-color hover:text-primary font-medium py-2 border-b border-border-color">About</button>
          <button onClick={() => scrollToSection('contact')} className="text-left text-primary-color hover:text-primary font-medium py-2 border-b border-border-color">Contact</button>
          
          <div className="pt-4 flex flex-col space-y-3">
            {isAuthenticated ? (
              <>
                <Link
                  to={user?.role === 'employer' ? '/employer/dashboard' : '/candidate/dashboard'}
                  className="btn-primary text-center"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <button
                  onClick={() => {
                    logout();
                    setIsMobileMenuOpen(false);
                  }}
                  className="px-4 py-2 rounded-lg text-primary-color font-medium border border-border-color hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-center"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={() => setIsMobileMenuOpen(false)} className="px-4 py-2 rounded-lg text-primary-color font-medium border border-border-color hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-center">
                  Login
                </Link>
                <Link to="/register" onClick={() => setIsMobileMenuOpen(false)} className="btn-primary text-center">
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
