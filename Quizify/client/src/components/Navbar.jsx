import React, { useContext, useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { FaBolt, FaBars, FaTimes } from 'react-icons/fa';
import { FiChevronDown, FiGrid, FiEdit, FiUser, FiLogOut } from 'react-icons/fi';
import toast from 'react-hot-toast';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close menus on route change
  useEffect(() => {
    setDropdownOpen(false);
    setMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = async () => {
    await logout();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  const getInitial = (name) => name ? name.charAt(0).toUpperCase() : '?';

  return (
    <nav
      className={`fixed top-0 z-50 w-full transition-all duration-300 ${
        scrolled ? 'bg-[#1A1A1A] shadow-lg' : 'bg-[#1A1A1A]'
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link to={user ? '/dashboard' : '/'} className="flex items-center gap-2">
              <FaBolt className="text-xl text-[#40916C]" />
              <span className="font-sans text-2xl font-extrabold tracking-wide text-[#40916C]">
                Quizify
              </span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:block">
            <div className="ml-4 flex items-center md:ml-6 gap-4">
              {user ? (
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="flex items-center gap-2 hover:bg-white/5 rounded-md px-2 py-1.5 transition-colors border border-transparent focus:border-[#40916C]"
                  >
                    <div className="w-8 h-8 rounded-md bg-[#2D6A4F] text-white font-bold text-sm flex items-center justify-center">
                      {getInitial(user.name)}
                    </div>
                    <span className="text-gray-300 hover:text-white text-sm font-medium">{user.name.split(' ')[0]}</span>
                    <FiChevronDown className={`text-gray-300 hover:text-white transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {/* Dropdown */}
                  {dropdownOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-modal border border-[#E5E0D8] py-2 z-50 animate-scale-in origin-top-right">
                      <div className="px-4 py-3 border-b border-[#E5E0D8] mb-2">
                        <div className="text-[#1A1A1A] font-bold text-sm truncate">{user.name}</div>
                        <div className="text-[#6B7280] text-xs mt-0.5 truncate">{user.email}</div>
                      </div>
                      
                      <button onClick={() => navigate('/dashboard')} className="w-full text-left px-4 py-2.5 text-sm text-[#3D3D3D] hover:bg-[#F0FAF2] hover:text-[#2D6A4F] flex items-center gap-3 transition-colors">
                        <FiGrid className="text-lg" /> Dashboard
                      </button>
                      <button onClick={() => navigate('/create-quiz')} className="w-full text-left px-4 py-2.5 text-sm text-[#3D3D3D] hover:bg-[#F0FAF2] hover:text-[#2D6A4F] flex items-center gap-3 transition-colors">
                        <FiEdit className="text-lg" /> Create Quiz
                      </button>
                      <button onClick={() => navigate('/dashboard/profile')} className="w-full text-left px-4 py-2.5 text-sm text-[#3D3D3D] hover:bg-[#F0FAF2] hover:text-[#2D6A4F] flex items-center gap-3 transition-colors">
                        <FiUser className="text-lg" /> My Profile
                      </button>
                      
                      <div className="border-t border-[#E5E0D8] my-2"></div>
                      
                      <button onClick={handleLogout} className="w-full text-left px-4 py-2.5 text-sm text-[#D62828] hover:bg-red-50 flex items-center gap-3 transition-colors">
                        <FiLogOut className="text-lg" /> Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="border border-[#40916C] text-[#40916C] bg-transparent hover:bg-[#40916C] hover:text-white rounded-md px-4 py-2 font-medium transition-colors duration-200"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="rounded-md bg-[#2D6A4F] px-4 py-2 font-medium text-white shadow-btn transition-all duration-200 hover:bg-[#1B4332]"
                  >
                    Register
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="inline-flex items-center justify-center rounded-md p-2 text-[#40916C] hover:bg-white/10 focus:outline-none"
            >
              {menuOpen ? <FaTimes className="h-6 w-6" /> : <FaBars className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-[#1A1A1A] pb-4 pt-2 border-t border-[#3D3D3D]">
          <div className="flex flex-col space-y-1 px-4">
            {user ? (
              <>
                <div className="px-3 py-3 border-b border-[#3D3D3D] mb-2 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-md bg-[#2D6A4F] text-white font-bold flex items-center justify-center text-lg">
                    {getInitial(user.name)}
                  </div>
                  <div>
                    <div className="text-white font-bold">{user.name}</div>
                    <div className="text-gray-300 text-xs">{user.email}</div>
                  </div>
                </div>
                
                <button
                  onClick={() => { navigate('/dashboard'); setMenuOpen(false); }}
                  className="w-full text-left rounded-md px-3 py-3 text-base font-medium text-gray-300 hover:text-white hover:bg-[#2D6A4F] flex items-center gap-3"
                >
                  <FiGrid /> Dashboard
                </button>
                <button
                  onClick={() => { navigate('/create-quiz'); setMenuOpen(false); }}
                  className="w-full text-left rounded-md px-3 py-3 text-base font-medium text-gray-300 hover:text-white hover:bg-[#2D6A4F] flex items-center gap-3"
                >
                  <FiEdit /> Create Quiz
                </button>
                <button
                  onClick={() => { navigate('/dashboard/profile'); setMenuOpen(false); }}
                  className="w-full text-left rounded-md px-3 py-3 text-base font-medium text-gray-300 hover:text-white hover:bg-[#2D6A4F] flex items-center gap-3"
                >
                  <FiUser /> Profile
                </button>
                
                <button
                  onClick={() => { handleLogout(); setMenuOpen(false); }}
                  className="w-full text-left rounded-md px-3 py-3 text-base font-medium text-[#E76F51] hover:bg-[#D62828] hover:text-white flex items-center gap-3 mt-4"
                >
                  <FiLogOut /> Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setMenuOpen(false)}
                  className="block rounded-md border border-[#40916C] text-[#40916C] bg-transparent hover:bg-[#40916C] hover:text-white px-3 py-3 text-base font-medium mt-2 text-center"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMenuOpen(false)}
                  className="block rounded-md px-3 py-3 text-base font-medium text-white bg-[#2D6A4F] hover:bg-[#1B4332] mt-2 text-center"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
