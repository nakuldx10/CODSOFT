import React, { useState, useEffect, useRef, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaPencilAlt, FaShareAlt, FaChartBar, FaEnvelope, FaPhone, FaMapMarkerAlt, FaLinkedin, FaGithub, FaTwitter } from 'react-icons/fa';
import api from '../api/axios';
import { AuthContext } from '../context/AuthContext';
import QuizCard from '../components/QuizCard';
import SkeletonCard from '../components/SkeletonCard';
import usePageTitle from '../hooks/usePageTitle';
import PageTransition from '../components/PageTransition';

// --- CountUp Hook for Stats ---
const useCountUp = (end, duration = 2000) => {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;
    let startTimestamp = null;
    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      setCount(Math.floor(progress * end));
      if (progress < 1) window.requestAnimationFrame(step);
    };
    window.requestAnimationFrame(step);
  }, [isVisible, end, duration]);

  return [count, ref];
};

const Landing = () => {
  usePageTitle('Home');
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  
  // Stats Hooks
  const [quizzesCount, statsRef] = useCountUp(10, 2000);
  const [attemptsCount] = useCountUp(50, 2000);
  const [usersCount] = useCountUp(8, 2000);

  // Featured Quizzes State
  const [featuredQuizzes, setFeaturedQuizzes] = useState([]);
  const [loadingQuizzes, setLoadingQuizzes] = useState(true);

  // Fallback realistic placeholder data
  const placeholders = [
    { _id: '1', title: 'General Knowledge Basics', questionsCount: 10, difficulty: 'Easy', category: 'General Knowledge', authorName: 'QuizMaster' },
    { _id: '2', title: 'World Geography Challenge', questionsCount: 15, difficulty: 'Medium', category: 'Geography', authorName: 'GeoPro' },
    { _id: '3', title: 'JavaScript Fundamentals', questionsCount: 12, difficulty: 'Hard', category: 'Technology', authorName: 'CodeNinja' },
    { _id: '4', title: 'Famous Historical Events', questionsCount: 8, difficulty: 'Easy', category: 'History', authorName: 'HistoryBuff' },
    { _id: '5', title: 'Human Body Science', questionsCount: 10, difficulty: 'Medium', category: 'Science', authorName: 'AstroGeek' },
    { _id: '6', title: 'Bollywood Blockbusters', questionsCount: 20, difficulty: 'Easy', category: 'Entertainment', authorName: 'PopStar' },
  ];

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const res = await api.get('/api/quizzes?limit=6');
        if (res.data.success && res.data.quizzes.length > 0) {
          setFeaturedQuizzes(res.data.quizzes);
        } else {
          setFeaturedQuizzes(placeholders);
        }
      } catch (error) {
        setFeaturedQuizzes(placeholders);
      } finally {
        setLoadingQuizzes(false);
      }
    };
    fetchQuizzes();
  }, []);

  return (
    <PageTransition>
      <div className="font-sans text-[#1A1A1A] min-h-screen bg-[#FDFBF7]">
        
        {/* SECTION 1 - HERO */}
      <section className="relative min-h-screen flex items-center pt-20 pb-12 overflow-hidden px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center w-full">
          {/* Left Column */}
          <div className="animate-slide-up space-y-6 z-10">
            <div className="inline-block bg-[#D8F3DC] text-[#1B4332] rounded-sm border border-[#2D6A4F] px-4 py-1 text-sm font-medium">
              ✨ The Smartest Way to Learn
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight">
              <span className="block text-[#1A1A1A]">Create. Share.</span>
              <span className="block text-[#2D6A4F]">Quiz.</span>
              <span className="block text-[#1A1A1A]">Repeat.</span>
            </h1>
            <p className="text-[#6B7280] text-lg max-w-md">
              Build engaging quizzes in minutes, share them with the world, and track every score — all in one place.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button 
                onClick={() => navigate(user ? '/dashboard' : '/register')}
                className="bg-[#2D6A4F] text-white rounded-md px-6 py-3 font-semibold shadow-btn hover:bg-[#1B4332]"
              >
                {user ? 'Go to Dashboard →' : 'Start Creating →'}
              </button>
              <button 
                onClick={() => navigate('/quizzes')}
                className="bg-white text-[#1A1A1A] border-2 border-[#E5E0D8] rounded-md px-6 py-3 font-semibold hover:border-[#2D6A4F] hover:text-[#2D6A4F]"
              >
                Explore Quizzes
              </button>
            </div>
            <p className="text-[#9CA3AF] text-sm mt-4">
              🎯 10,000+ quizzes created  •  50,000+ attempts made
            </p>
          </div>

          {/* Right Column */}
          <div className="relative flex justify-center lg:justify-end mt-12 lg:mt-0 z-10">
            {/* Floating Mock Card */}
            <div className="animate-float bg-white border border-[#E5E0D8] rounded-md shadow-card p-8 w-full max-w-sm relative z-20">
              <div className="w-full bg-[#EDE8E0] rounded-sm h-1.5 mb-6">
                <div className="bg-[#2D6A4F] h-1.5 rounded-sm" style={{ width: '60%' }}></div>
              </div>
              <p className="text-center text-[#9CA3AF] text-sm mb-4">Question 6 of 13</p>
              <h3 className="text-center text-[#1A1A1A] font-bold text-lg mb-6">
                WHICH PLANET IS CLOSEST TO THE SUN?
              </h3>
              <div className="space-y-3">
                <div className="bg-[#2D6A4F] text-white rounded-md border border-[#2D6A4F] p-3 flex items-center gap-3">
                  <div className="w-6 h-6 rounded-sm bg-white/20 text-white flex items-center justify-center text-xs font-bold">A</div>
                  <span className="font-medium">Mercury</span>
                </div>
                <div className="bg-white border border-[#E5E0D8] text-[#3D3D3D] rounded-md p-3 flex items-center gap-3">
                  <div className="w-6 h-6 rounded-sm bg-[#F5F0E8] text-[#6B7280] flex items-center justify-center text-xs font-bold">B</div>
                  <span className="font-medium">Venus</span>
                </div>
                <div className="bg-white border border-[#E5E0D8] text-[#3D3D3D] rounded-md p-3 flex items-center gap-3">
                  <div className="w-6 h-6 rounded-sm bg-[#F5F0E8] text-[#6B7280] flex items-center justify-center text-xs font-bold">C</div>
                  <span className="font-medium">Earth</span>
                </div>
                <div className="bg-white border border-[#E5E0D8] text-[#3D3D3D] rounded-md p-3 flex items-center gap-3">
                  <div className="w-6 h-6 rounded-sm bg-[#F5F0E8] text-[#6B7280] flex items-center justify-center text-xs font-bold">D</div>
                  <span className="font-medium">Mars</span>
                </div>
              </div>
            </div>

            {/* Decorative Emojis */}
            <div className="absolute top-0 -left-8 text-4xl animate-float-delay rotate-[-15deg] z-0">🌿</div>
            <div className="absolute -top-6 -right-4 text-4xl animate-float rotate-[10deg] z-0" style={{animationDelay: '0.5s'}}>🍊</div>
            <div className="absolute bottom-4 -left-10 text-4xl animate-float rotate-[20deg] z-0" style={{animationDelay: '1s'}}>👟</div>
            <div className="absolute -bottom-6 -right-6 text-4xl animate-float-delay rotate-[-10deg] z-0" style={{animationDelay: '1.2s'}}>🚲</div>
            <div className="absolute top-1/2 -left-12 text-4xl animate-float rotate-[5deg] z-0" style={{animationDelay: '0.8s'}}>🌸</div>
          </div>
        </div>
      </section>

      {/* SECTION 2 - STATS BAR */}
      <section ref={statsRef} className="bg-[#1A1A1A] py-12 w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-wrap justify-center items-center gap-8 md:gap-16">
          <div className="text-center">
            <h2 className="text-[#40916C] text-4xl font-bold">{quizzesCount}K+</h2>
            <p className="text-[#9CA3AF] text-sm mt-1">Quizzes Created</p>
          </div>
          <div className="hidden md:block w-px h-12 bg-white/10"></div>
          <div className="text-center">
            <h2 className="text-[#40916C] text-4xl font-bold">{attemptsCount}K+</h2>
            <p className="text-[#9CA3AF] text-sm mt-1">Quiz Attempts</p>
          </div>
          <div className="hidden md:block w-px h-12 bg-white/10"></div>
          <div className="text-center">
            <h2 className="text-[#40916C] text-4xl font-bold">{usersCount}K+</h2>
            <p className="text-[#9CA3AF] text-sm mt-1">Active Users</p>
          </div>
        </div>
      </section>

      {/* SECTION 3 - HOW IT WORKS */}
      <section className="bg-white py-20 px-6">
        <div className="max-w-7xl mx-auto animate-fade-in">
          <div className="text-center mb-16">
            <span className="text-[#2D6A4F] text-xs font-bold tracking-[0.1em] uppercase">SIMPLE PROCESS</span>
            <h2 className="text-[#1A1A1A] text-3xl md:text-4xl font-bold mt-2">How Quizify Works</h2>
            <p className="text-[#6B7280] text-lg mt-3">Three simple steps to quiz mastery</p>
          </div>
          
          <div className="relative grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Desktop Arrows connecting cards */}
            <div className="hidden md:block absolute top-1/3 left-[28%] text-[#2D6A4F] text-3xl">➔</div>
            <div className="hidden md:block absolute top-1/3 right-[28%] text-[#2D6A4F] text-3xl">➔</div>

            <div className="bg-white border border-[#E5E0D8] rounded-md shadow-card p-8 text-center hover:-translate-y-1 hover:border-[#2D6A4F] transition-all">
              <div className="relative mx-auto w-20 h-20 bg-[#D8F3DC] rounded-full flex items-center justify-center">
                <FaPencilAlt className="text-[#2D6A4F] text-3xl" />
                <span className="absolute -top-2 -right-2 bg-[#2D6A4F] text-white text-xs font-bold px-2 py-1 rounded-sm">01</span>
              </div>
              <h3 className="text-[#1A1A1A] text-xl font-bold mt-6">Build Your Quiz</h3>
              <p className="text-[#6B7280] text-sm mt-3">Add questions, set multiple choice options, and define correct answers in minutes.</p>
            </div>

            <div className="bg-white border border-[#E5E0D8] rounded-md shadow-card p-8 text-center hover:-translate-y-1 hover:border-[#2D6A4F] transition-all">
              <div className="relative mx-auto w-20 h-20 bg-[#D8F3DC] rounded-full flex items-center justify-center">
                <FaShareAlt className="text-[#2D6A4F] text-3xl" />
                <span className="absolute -top-2 -right-2 bg-[#2D6A4F] text-white text-xs font-bold px-2 py-1 rounded-sm">02</span>
              </div>
              <h3 className="text-[#1A1A1A] text-xl font-bold mt-6">Share Instantly</h3>
              <p className="text-[#6B7280] text-sm mt-3">Get a unique link for your quiz and share it with friends, students, or colleagues.</p>
            </div>

            <div className="bg-white border border-[#E5E0D8] rounded-md shadow-card p-8 text-center hover:-translate-y-1 hover:border-[#2D6A4F] transition-all">
              <div className="relative mx-auto w-20 h-20 bg-[#D8F3DC] rounded-full flex items-center justify-center">
                <FaChartBar className="text-[#2D6A4F] text-3xl" />
                <span className="absolute -top-2 -right-2 bg-[#2D6A4F] text-white text-xs font-bold px-2 py-1 rounded-sm">03</span>
              </div>
              <h3 className="text-[#1A1A1A] text-xl font-bold mt-6">Track Results</h3>
              <p className="text-[#6B7280] text-sm mt-3">See who attempted your quiz, review scores, and identify knowledge gaps easily.</p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 4 - FEATURED QUIZZES */}
      <section className="bg-[#F5F0E8] py-20 px-6">
        <div className="max-w-7xl mx-auto animate-fade-in">
          <div className="text-center mb-16">
            <span className="text-[#2D6A4F] text-xs font-bold tracking-[0.1em] uppercase">TRENDING NOW</span>
            <h2 className="text-[#1A1A1A] text-3xl md:text-4xl font-bold mt-2">Popular Quizzes</h2>
            <p className="text-[#6B7280] text-lg mt-3">Jump in and test your knowledge</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {loadingQuizzes ? (
              Array(6).fill(0).map((_, i) => <SkeletonCard key={i} viewMode="grid" />)
            ) : (
              featuredQuizzes.map(quiz => (
                <QuizCard key={quiz._id} quiz={quiz} viewMode="grid" />
              ))
            )}
          </div>
          
          <div className="flex justify-center mt-12">
            <button 
              onClick={() => navigate('/quizzes')}
              className="bg-white border-2 border-[#E5E0D8] text-[#1A1A1A] rounded-md px-8 py-3 font-semibold hover:border-[#2D6A4F] hover:text-[#2D6A4F] transition-colors"
            >
              View All Quizzes
            </button>
          </div>
        </div>
      </section>

      {/* SECTION 5 - WHY QUIZIFY */}
      <section className="bg-white py-20 px-6">
        <div className="max-w-7xl mx-auto animate-fade-in">
          <div className="text-center mb-16 lg:hidden">
            <h2 className="text-[#1A1A1A] text-3xl font-bold">Why Choose Quizify?</h2>
            <p className="text-[#6B7280] mt-2">Everything you need to create amazing quizzes</p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left side text */}
            <div className="order-2 lg:order-1">
              <h2 className="hidden lg:block text-[#1A1A1A] text-4xl font-bold leading-tight">
                Built for creators,<br/>learners, and everyone<br/>in between.
              </h2>
              <p className="text-[#6B7280] mt-6 text-lg leading-relaxed">
                Whether you're a teacher, trainer, or just someone who loves trivia — Quizify gives you the tools to create, share, and enjoy quizzes like never before.
              </p>
              <button 
                onClick={() => navigate('/register')}
                className="mt-8 bg-[#2D6A4F] text-white rounded-md px-8 py-3 font-semibold shadow-btn hover:bg-[#1B4332] transition-colors"
              >
                Get Started Free →
              </button>
            </div>

            {/* Right side grid */}
            <div className="order-1 lg:order-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="bg-[#FDFBF7] border border-[#E5E0D8] rounded-md p-6 hover:-translate-y-1 transition-transform">
                <div className="text-3xl mb-3">⚡</div>
                <h4 className="text-[#1A1A1A] font-bold text-base">Instant Feedback</h4>
                <p className="text-[#6B7280] text-sm mt-2">Get real-time scores and correct answers the moment you finish a quiz.</p>
              </div>
              <div className="bg-[#FDFBF7] border border-[#E5E0D8] rounded-md p-6 hover:-translate-y-1 transition-transform">
                <div className="text-3xl mb-3">🔒</div>
                <h4 className="text-[#1A1A1A] font-bold text-base">Secure & Private</h4>
                <p className="text-[#6B7280] text-sm mt-2">Your data is protected with JWT authentication and encrypted passwords.</p>
              </div>
              <div className="bg-[#FDFBF7] border border-[#E5E0D8] rounded-md p-6 hover:-translate-y-1 transition-transform">
                <div className="text-3xl mb-3">📱</div>
                <h4 className="text-[#1A1A1A] font-bold text-base">Mobile Friendly</h4>
                <p className="text-[#6B7280] text-sm mt-2">Quizify works perfectly on phones, tablets, and desktops.</p>
              </div>
              <div className="bg-[#FDFBF7] border border-[#E5E0D8] rounded-md p-6 hover:-translate-y-1 transition-transform">
                <div className="text-3xl mb-3">📊</div>
                <h4 className="text-[#1A1A1A] font-bold text-base">Score Tracking</h4>
                <p className="text-[#6B7280] text-sm mt-2">Review your quiz history and track improvement over time.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 6 - CTA BANNER */}
      <section className="bg-[#2D6A4F] relative overflow-hidden py-20 px-6">
        {/* Decorative Circles */}
        <div className="absolute top-0 left-0 w-64 h-64 border-[40px] border-white/10 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 border-[60px] border-white/10 rounded-full translate-x-1/3 translate-y-1/3"></div>
        
        <div className="relative z-10 max-w-4xl mx-auto text-center animate-fade-in">
          <h2 className="text-white text-4xl md:text-5xl font-extrabold leading-tight">Ready to Start Quizzing?</h2>
          <p className="text-white/80 text-xl mt-4">Join thousands of creators and learners on Quizify today.</p>
          <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
            <button 
              onClick={() => navigate(user ? '/create-quiz' : '/register')}
              className="bg-white text-[#2D6A4F] rounded-md px-8 py-4 font-bold shadow-lg hover:scale-105 transition-transform"
            >
              Create a Quiz
            </button>
            <button 
              onClick={() => navigate('/quizzes')}
              className="bg-transparent text-white border-2 border-white/50 rounded-md px-8 py-4 font-bold hover:bg-white/10 transition-colors"
            >
              Browse Quizzes
            </button>
          </div>
        </div>
      </section>

      {/* SECTION 7 - FOOTER */}
      <footer className="bg-[#111111] py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 text-white">
            
            {/* Col 1 */}
            <div>
              <Link to="/" className="flex items-center gap-2">
                <span className="text-[#40916C] text-2xl font-bold">⚡ Quizify</span>
              </Link>
              <p className="text-[#6B7280] text-sm mt-3 max-w-xs">Create. Share. Quiz. Repeat.</p>
              <div className="flex gap-4 mt-6">
                <a href="#" className="w-10 h-10 rounded-md bg-[#1F1F1F] flex items-center justify-center hover:bg-[#2D6A4F] transition-colors">
                  <FaGithub />
                </a>
                <a href="#" className="w-10 h-10 rounded-md bg-[#1F1F1F] flex items-center justify-center hover:bg-[#2D6A4F] transition-colors">
                  <FaLinkedin />
                </a>
                <a href="#" className="w-10 h-10 rounded-md bg-[#1F1F1F] flex items-center justify-center hover:bg-[#2D6A4F] transition-colors">
                  <FaTwitter />
                </a>
              </div>
            </div>

            {/* Col 2 */}
            <div>
              <h4 className="text-white font-semibold text-sm uppercase tracking-[0.1em] mb-4">Platform</h4>
              <ul className="space-y-3">
                <li><Link to="/" className="text-[#9CA3AF] text-sm hover:text-[#40916C] transition-colors">Home</Link></li>
                <li><Link to="/quizzes" className="text-[#9CA3AF] text-sm hover:text-[#40916C] transition-colors">Browse Quizzes</Link></li>
                <li><Link to="/create-quiz" className="text-[#9CA3AF] text-sm hover:text-[#40916C] transition-colors">Create Quiz</Link></li>
                <li><span className="text-[#9CA3AF] text-sm flex items-center gap-2">Leaderboard <span className="text-[#40916C] text-xs">(coming soon)</span></span></li>
              </ul>
            </div>

            {/* Col 3 */}
            <div>
              <h4 className="text-white font-semibold text-sm uppercase tracking-[0.1em] mb-4">Support</h4>
              <ul className="space-y-3">
                <li><a href="#" className="text-[#9CA3AF] text-sm hover:text-[#40916C] transition-colors">How It Works</a></li>
                <li><a href="#" className="text-[#9CA3AF] text-sm hover:text-[#40916C] transition-colors">FAQ</a></li>
                <li><a href="#" className="text-[#9CA3AF] text-sm hover:text-[#40916C] transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="text-[#9CA3AF] text-sm hover:text-[#40916C] transition-colors">Terms of Service</a></li>
              </ul>
            </div>

            {/* Col 4 */}
            <div>
              <h4 className="text-white font-semibold text-sm uppercase tracking-[0.1em] mb-4">Contact Us</h4>
              <ul className="space-y-4">
                <li className="flex items-center gap-3">
                  <FaEnvelope className="text-[#40916C]" />
                  <span className="text-[#9CA3AF] text-sm">support@quizify.in</span>
                </li>
                <li className="flex items-center gap-3">
                  <FaPhone className="text-[#40916C]" />
                  <span className="text-[#9CA3AF] text-sm">+91 98765 43210</span>
                </li>
                <li className="flex items-center gap-3">
                  <FaMapMarkerAlt className="text-[#40916C]" />
                  <span className="text-[#9CA3AF] text-sm">New Delhi, India</span>
                </li>
                <li className="flex items-center gap-3">
                  <FaLinkedin className="text-[#40916C]" />
                  <a href="#" className="text-[#9CA3AF] text-sm hover:text-[#40916C] transition-colors">linkedin.com/in/quizify</a>
                </li>
              </ul>
            </div>
          </div>

          {/* Footer Bottom */}
          <div className="border-t border-[#2A2A2A] mt-12 pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-[#6B7280] text-sm">© 2024 Quizify. All rights reserved.</p>
            <p className="text-[#6B7280] text-sm">Made with ❤️ in India</p>
          </div>
        </div>
      </footer>
    </div>
    </PageTransition>
  );
};

export default Landing;
