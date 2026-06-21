import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { getDashboardStats, getUserQuizzes } from '../api/quizApi';
import api from '../api/axios'; // Need attempts from API, quizApi exports a few explicitly

import StatsOverview from '../components/dashboard/StatsOverview';
import MyQuizzes from '../components/dashboard/MyQuizzes';
import AttemptHistory from '../components/dashboard/AttemptHistory';
import ProfileCard from '../components/dashboard/ProfileCard';
import DashboardSkeleton from '../components/skeletons/DashboardSkeleton';
import usePageTitle from '../hooks/usePageTitle';
import PageTransition from '../components/PageTransition';

const Dashboard = () => {
  usePageTitle('Dashboard');
  const { tab } = useParams();
  const navigate = useNavigate();
  const { user, setUser, logout } = useContext(AuthContext);

  const [activeTab, setActiveTab] = useState(tab || 'overview');
  const [stats, setStats] = useState(null);
  const [myQuizzes, setMyQuizzes] = useState([]);
  const [attempts, setAttempts] = useState([]);
  const [loading, setLoading] = useState(true);

  const validTabs = ['overview', 'quizzes', 'attempts', 'profile'];

  useEffect(() => {
    if (tab && validTabs.includes(tab)) {
      setActiveTab(tab);
    } else if (tab) {
      navigate('/dashboard/overview', { replace: true });
    }
  }, [tab, navigate]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [statsRes, quizzesRes, attemptsRes] = await Promise.all([
        getDashboardStats(),
        getUserQuizzes(),
        api.get('/api/attempts/user') // direct API call
      ]);
      setStats(statsRes.data.stats);
      setMyQuizzes(quizzesRes.data.quizzes);
      setAttempts(attemptsRes.data.attempts);
    } catch (err) {
      console.error("Failed to load dashboard data", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleTabChange = (newTab) => {
    setActiveTab(newTab);
    navigate(`/dashboard/${newTab}`, { replace: true });
  };

  const currentHour = new Date().getHours();
  let greeting = 'Good evening,';
  if (currentHour < 12) greeting = 'Good morning,';
  else if (currentHour < 17) greeting = 'Good afternoon,';

  const monthYear = new Date(user?.createdAt || Date.now()).toLocaleDateString('en-US', {
    month: 'long', year: 'numeric'
  });

  if (loading && !stats) {
    return (
      <PageTransition>
        <DashboardSkeleton />
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div className="min-h-screen bg-[#FDFBF7] font-sans text-[#1A1A1A]">
        
        {/* DASHBOARD HERO HEADER */}
      <div className="bg-gradient-to-br from-[#1A1A1A] to-[#2D6A4F] pt-24 pb-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          
          {/* LEFT: Greeting */}
          <div>
            <div className="text-white/70 text-lg font-medium">{greeting}</div>
            <h1 className="text-white text-4xl sm:text-5xl font-extrabold mt-1 tracking-tight">
              {user?.name} <span className="animate-pulse inline-block">👋</span>
            </h1>
            <div className="text-white/60 text-sm mt-2">Member since {monthYear}</div>
            
            <div className="flex flex-wrap gap-3 mt-6">
              <button onClick={() => navigate('/create-quiz')} className="bg-white text-[#1A1A1A] rounded-md px-5 py-2.5 font-semibold text-sm hover:scale-105 transition-transform shadow-btn">
                ⚡ Create Quiz
              </button>
              <button onClick={() => navigate('/quizzes')} className="bg-white/10 text-white border border-white/30 rounded-md px-5 py-2.5 font-semibold text-sm hover:bg-white/20 transition-colors backdrop-blur-sm">
                🔍 Browse Quizzes
              </button>
            </div>
          </div>

          {/* RIGHT: Mini Stats (Desktop) */}
          {stats && (
            <div className="hidden lg:flex gap-4">
              <div className="bg-white/10 rounded-md p-5 border border-white/20 text-center min-w-28 backdrop-blur-md hover:bg-white/20 transition-colors cursor-default">
                <div className="text-white text-3xl font-black">{stats.totalCreated}</div>
                <div className="text-white/70 text-xs mt-1 font-semibold uppercase tracking-wider">Quizzes Made</div>
              </div>
              <div className="bg-white/10 rounded-md p-5 border border-white/20 text-center min-w-28 backdrop-blur-md hover:bg-white/20 transition-colors cursor-default">
                <div className="text-white text-3xl font-black">{stats.totalAttempts}</div>
                <div className="text-white/70 text-xs mt-1 font-semibold uppercase tracking-wider">Quizzes Taken</div>
              </div>
              <div className="bg-white/10 rounded-md p-5 border border-white/20 text-center min-w-28 backdrop-blur-md hover:bg-white/20 transition-colors cursor-default">
                <div className="text-white text-3xl font-black">{stats.avgPercentage}%</div>
                <div className="text-white/70 text-xs mt-1 font-semibold uppercase tracking-wider">Avg Score</div>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* DASHBOARD TAB NAVIGATION */}
      <div className="bg-white sticky top-16 z-40 shadow-sm border-b border-[#E5E0D8]">
        <div className="max-w-7xl mx-auto px-6 overflow-x-auto scrollbar-hide">
          <div className="flex">
            
            <button 
              onClick={() => handleTabChange('overview')}
              className={`py-4 px-6 text-sm font-semibold flex items-center gap-2 whitespace-nowrap transition-all border-b-2 ${activeTab === 'overview' ? 'text-[#2D6A4F] border-[#2D6A4F] bg-[#F0FAF2]' : 'text-[#6B7280] border-transparent hover:text-[#1A1A1A] hover:bg-[#F5F0E8]'}`}
            >
              📊 Overview
            </button>
            
            <button 
              onClick={() => handleTabChange('quizzes')}
              className={`py-4 px-6 text-sm font-semibold flex items-center gap-2 whitespace-nowrap transition-all border-b-2 ${activeTab === 'quizzes' ? 'text-[#2D6A4F] border-[#2D6A4F] bg-[#F0FAF2]' : 'text-[#6B7280] border-transparent hover:text-[#1A1A1A] hover:bg-[#F5F0E8]'}`}
            >
              📝 My Quizzes
              {myQuizzes.length > 0 && (
                <span className={`rounded-sm text-[10px] px-2 py-0.5 font-bold min-w-5 text-center ${activeTab === 'quizzes' ? 'bg-[#2D6A4F] text-white' : 'bg-[#E5E0D8] text-[#6B7280]'}`}>{myQuizzes.length}</span>
              )}
            </button>
            
            <button 
              onClick={() => handleTabChange('attempts')}
              className={`py-4 px-6 text-sm font-semibold flex items-center gap-2 whitespace-nowrap transition-all border-b-2 ${activeTab === 'attempts' ? 'text-[#2D6A4F] border-[#2D6A4F] bg-[#F0FAF2]' : 'text-[#6B7280] border-transparent hover:text-[#1A1A1A] hover:bg-[#F5F0E8]'}`}
            >
              🏃 My Attempts
              {attempts.length > 0 && (
                <span className={`rounded-sm text-[10px] px-2 py-0.5 font-bold min-w-5 text-center ${activeTab === 'attempts' ? 'bg-[#2D6A4F] text-white' : 'bg-[#E5E0D8] text-[#6B7280]'}`}>{attempts.length}</span>
              )}
            </button>
            
            <button 
              onClick={() => handleTabChange('profile')}
              className={`py-4 px-6 text-sm font-semibold flex items-center gap-2 whitespace-nowrap transition-all border-b-2 ${activeTab === 'profile' ? 'text-[#2D6A4F] border-[#2D6A4F] bg-[#F0FAF2]' : 'text-[#6B7280] border-transparent hover:text-[#1A1A1A] hover:bg-[#F5F0E8]'}`}
            >
              👤 Profile
            </button>

          </div>
        </div>
      </div>

      {/* DASHBOARD CONTENT AREA */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <>
          {activeTab === 'overview' && <StatsOverview stats={stats} attempts={attempts} setActiveTab={handleTabChange} />}
            {activeTab === 'quizzes' && <MyQuizzes quizzes={myQuizzes} loading={loading} onRefresh={fetchData} />}
            {activeTab === 'attempts' && <AttemptHistory attempts={attempts} loading={loading} />}
            {activeTab === 'profile' && <ProfileCard user={user} stats={stats} onUpdate={setUser} onLogout={() => { logout(); navigate('/login'); }} />}
          </>
      </div>

    </div>
    </PageTransition>
  );
};

export default Dashboard;
