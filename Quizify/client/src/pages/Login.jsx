import React, { useState, useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { FaEye, FaEyeSlash, FaBolt, FaPencilAlt, FaShareAlt, FaChartBar } from 'react-icons/fa';
import toast from 'react-hot-toast';
import usePageTitle from '../hooks/usePageTitle';
import PageTransition from '../components/PageTransition';

const Login = () => {
  usePageTitle('Login');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const location = useLocation();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await login(formData.email, formData.password);
      toast.success('Welcome back! 👋');
      const from = location.state?.from || '/dashboard';
      navigate(from, { replace: true });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Invalid credentials');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PageTransition>
      <div className="flex min-h-screen">
        {/* LEFT SIDE PANEL (Desktop Only) */}
        <div className="hidden lg:flex flex-col justify-center items-start w-2/5 bg-[#2D6A4F] p-12 min-h-screen relative">
          <div className="flex flex-col h-full w-full max-w-md mx-auto">
            <div className="mt-8">
              <Link to="/" className="flex items-center gap-2">
                <span className="text-white text-3xl font-black">⚡ Quizify</span>
              </Link>
              <p className="text-white/70 text-lg mt-2">Create. Share. Quiz. Repeat.</p>
              
              <div className="w-16 h-px bg-white/20 my-8"></div>
              
              <div className="flex flex-col gap-6 mt-6">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-sm bg-white flex items-center justify-center shrink-0">
                    <FaPencilAlt className="text-[#2D6A4F] text-sm" />
                  </div>
                  <div>
                    <h4 className="text-white font-semibold text-sm">Create Instantly</h4>
                    <p className="text-white/60 text-xs mt-0.5">Build quizzes in minutes</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-sm bg-white flex items-center justify-center shrink-0">
                    <FaShareAlt className="text-[#2D6A4F] text-sm" />
                  </div>
                  <div>
                    <h4 className="text-white font-semibold text-sm">Share Anywhere</h4>
                    <p className="text-white/60 text-xs mt-0.5">Send to friends or students</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-sm bg-white flex items-center justify-center shrink-0">
                    <FaChartBar className="text-[#2D6A4F] text-sm" />
                  </div>
                  <div>
                    <h4 className="text-white font-semibold text-sm">Track Results</h4>
                    <p className="text-white/60 text-xs mt-0.5">See scores and leaderboards</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-auto mb-8 border-l-2 border-white/30 pl-4">
              <p className="text-white/60 text-sm italic">
                "Learning is fun when you make it a game."
              </p>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE PANEL */}
        <div className="w-full lg:w-3/5 bg-[#FDFBF7] flex items-center justify-center min-h-screen p-8">
          <div className="w-full max-w-md bg-white border border-[#E5E0D8] rounded-[10px] shadow-card p-8">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-[#1A1A1A]">Welcome back</h2>
              <p className="mt-1 text-sm text-[#6B7280]">Sign in to continue to Quizify</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-[#3D3D3D]">Email</label>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full bg-white rounded-md border border-[#E5E0D8] px-4 py-3 text-[#1A1A1A] placeholder-[#9CA3AF] focus:border-[#2D6A4F] focus:outline-none focus:ring-0 focus:shadow-focus transition-shadow"
                  placeholder="you@example.com"
                />
              </div>

              <div className="relative">
                <label className="mb-1.5 block text-sm font-medium text-[#3D3D3D]">Password</label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full bg-white rounded-md border border-[#E5E0D8] px-4 py-3 text-[#1A1A1A] placeholder-[#9CA3AF] focus:border-[#2D6A4F] focus:outline-none focus:ring-0 focus:shadow-focus transition-shadow"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-[38px] text-[#9CA3AF] hover:text-[#2D6A4F] transition-colors"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="flex w-full mt-6 justify-center rounded-md bg-[#2D6A4F] px-4 py-3 font-semibold text-white transition-all hover:bg-[#1B4332] disabled:opacity-70"
              >
                {isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <div className="h-5 w-5 animate-spin rounded-full border-t-2 border-white"></div>
                    <span>Signing in...</span>
                  </div>
                ) : (
                  'Sign In'
                )}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-[#6B7280]">
              New to Quizify?{' '}
              <Link to="/register" className="font-semibold text-[#2D6A4F] hover:underline">
                Create Account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default Login;
