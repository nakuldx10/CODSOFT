import { usePageTitle } from '../../hooks/usePageTitle';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from '../../api/axios';
import useAuth from '../../hooks/useAuth';
import { timeAgo } from '../../utils/timeAgo';

const Dashboard = () => {
  usePageTitle('Dashboard');
  const { user } = useAuth();
  const [applications, setApplications] = useState([]);
  const [savedCount, setSavedCount] = useState(0);
  const [recommendedJobs, setRecommendedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const calculateProfileCompletion = () => {
    if (!user) return 0;
    const fields = [
      !!user.name,
      !!user.phone,
      !!user.headline,
      !!user.bio,
      user.skills?.length > 0,
      user.education?.length > 0,
      user.experience?.length > 0,
      !!user.resume,
      !!user.avatar,
    ];
    const filled = fields.filter(Boolean).length;
    return Math.round((filled / fields.length) * 100);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const [appsRes, savedRes, jobsRes] = await Promise.all([
          axios.get('/api/applications/mine'),
          axios.get('/api/applications/saved'),
          axios.get('/api/jobs', { params: { sort: 'newest', limit: 3 } }),
        ]);
        setApplications(appsRes.data.applications || appsRes.data || []);
        const savedData = savedRes.data.savedJobs || savedRes.data || [];
        setSavedCount(Array.isArray(savedData) ? savedData.length : 0);
        setRecommendedJobs(jobsRes.data.jobs || jobsRes.data || []);
      } catch (err) {
        const message = err.response?.data?.message || err.message || 'Failed to load data';
        setError(message);
        console.error('Fetch error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const interviewCount = applications.filter(
    (app) => app.status === 'Interview Scheduled'
  ).length;

  const recentApps = applications.slice(0, 5);

  const statusColors = {
    Pending: 'bg-gray-500/10 text-gray-500',
    'Under Review': 'bg-blue-500/10 text-blue-500',
    'Interview Scheduled': 'bg-amber-500/10 text-amber-500',
    Selected: 'bg-green-500/10 text-green-500',
    Rejected: 'bg-red-500/10 text-red-500',
  };

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-6">
        <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mb-4">
          <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h2 className="text-xl font-bold mb-2">Something went wrong</h2>
        <p className="text-muted-color dark:text-[#8B8FA8] mb-4">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-5 py-2.5 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Greeting */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold dark:text-[#F1F1F5]">
          {getGreeting()}, {user?.name?.split(' ')[0]} 👋
        </h1>
        <p className="text-muted-color dark:text-[#8B8FA8] mt-1">
          Here&apos;s what&apos;s happening with your job search today.
        </p>
      </div>

      {/* Metric Cards */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-card-bg dark:bg-[#14152E] p-6 rounded-xl border border-border-color dark:border-[#2A2B45] animate-pulse">
              <div className="h-4 bg-surface-bg dark:bg-[#1C1D3A] rounded w-24 mb-3" />
              <div className="h-8 bg-surface-bg dark:bg-[#1C1D3A] rounded w-16" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
          {/* Total Applications */}
          <div className="bg-card-bg dark:bg-[#14152E] p-6 rounded-xl border border-border-color dark:border-[#2A2B45] group hover:border-primary/50 transition-colors">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-muted-color dark:text-[#8B8FA8]">Total Applications</span>
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
            </div>
            <p className="text-3xl font-bold dark:text-[#F1F1F5]">{applications.length}</p>
          </div>

          {/* Saved Jobs */}
          <div className="bg-card-bg dark:bg-[#14152E] p-6 rounded-xl border border-border-color dark:border-[#2A2B45] group hover:border-primary/50 transition-colors">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-muted-color dark:text-[#8B8FA8]">Saved Jobs</span>
              <div className="w-10 h-10 bg-amber-500/10 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                </svg>
              </div>
            </div>
            <p className="text-3xl font-bold dark:text-[#F1F1F5]">{savedCount}</p>
          </div>

          {/* Interviews Scheduled */}
          <div className="bg-card-bg dark:bg-[#14152E] p-6 rounded-xl border border-border-color dark:border-[#2A2B45] group hover:border-primary/50 transition-colors">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-muted-color dark:text-[#8B8FA8]">Interviews</span>
              <div className="w-10 h-10 bg-green-500/10 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
            <p className="text-3xl font-bold dark:text-[#F1F1F5]">{interviewCount}</p>
          </div>

          {/* Profile Completion */}
          <div className="bg-card-bg dark:bg-[#14152E] p-6 rounded-xl border border-border-color dark:border-[#2A2B45] group hover:border-primary/50 transition-colors">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-muted-color dark:text-[#8B8FA8]">Profile</span>
              <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
            </div>
            <p className="text-3xl font-bold dark:text-[#F1F1F5]">{calculateProfileCompletion()}%</p>
            <div className="mt-2 w-full bg-surface-bg dark:bg-[#1C1D3A] rounded-full h-2">
              <div
                className="bg-primary h-2 rounded-full transition-all duration-500"
                style={{ width: `${calculateProfileCompletion()}%` }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Applications (2/3) */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-bold dark:text-[#F1F1F5]">Recent Applications</h2>
            <Link to="/candidate/applied" className="text-sm font-semibold text-primary hover:text-primary/80 transition-colors">
              View All →
            </Link>
          </div>

          {loading ? (
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="bg-card-bg dark:bg-[#14152E] p-4 rounded-xl border border-border-color dark:border-[#2A2B45] animate-pulse">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-surface-bg dark:bg-[#1C1D3A] rounded-lg" />
                    <div className="flex-1">
                      <div className="h-4 bg-surface-bg dark:bg-[#1C1D3A] rounded w-40 mb-2" />
                      <div className="h-3 bg-surface-bg dark:bg-[#1C1D3A] rounded w-24" />
                    </div>
                    <div className="h-6 bg-surface-bg dark:bg-[#1C1D3A] rounded w-20" />
                  </div>
                </div>
              ))}
            </div>
          ) : recentApps.length === 0 ? (
            <div className="bg-card-bg dark:bg-[#14152E] p-8 rounded-xl border border-border-color dark:border-[#2A2B45] text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="font-bold mb-1 dark:text-[#F1F1F5]">No applications yet</h3>
              <p className="text-sm text-muted-color dark:text-[#8B8FA8] mb-4">Start browsing jobs and apply to your first position!</p>
              <Link to="/candidate/jobs" className="inline-block px-5 py-2.5 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors text-sm font-semibold">
                Browse Jobs
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {recentApps.map((app) => (
                <Link
                  key={app._id}
                  to={`/candidate/jobs/${app.job?._id}`}
                  className="block bg-card-bg dark:bg-[#14152E] p-4 rounded-xl border border-border-color dark:border-[#2A2B45] hover:border-primary/50 transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/10 text-primary rounded-lg flex items-center justify-center font-bold flex-shrink-0 overflow-hidden">
                      {app.job?.postedBy?.companyLogo ? (
                        <img src={`/uploads/${app.job.postedBy.companyLogo}`} alt="Logo" className="w-full h-full object-cover" />
                      ) : (
                        (app.job?.companyName || 'C').charAt(0).toUpperCase()
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-sm group-hover:text-primary transition-colors truncate dark:text-[#F1F1F5]">
                        {app.job?.title}
                      </h3>
                      <p className="text-xs text-muted-color dark:text-[#8B8FA8] truncate">
                        {app.job?.companyName} · Applied {timeAgo(app.appliedAt)}
                      </p>
                    </div>
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold flex-shrink-0 ${statusColors[app.status] || 'bg-gray-500/10 text-gray-500'}`}>
                      {app.status}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Recommended Jobs (1/3) */}
        <div>
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-bold dark:text-[#F1F1F5]">Recommended Jobs</h2>
            <Link to="/candidate/jobs" className="text-sm font-semibold text-primary hover:text-primary/80 transition-colors">
              Browse All →
            </Link>
          </div>

          {loading ? (
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="bg-card-bg dark:bg-[#14152E] p-4 rounded-xl border border-border-color dark:border-[#2A2B45] animate-pulse">
                  <div className="h-4 bg-surface-bg dark:bg-[#1C1D3A] rounded w-32 mb-3" />
                  <div className="h-3 bg-surface-bg dark:bg-[#1C1D3A] rounded w-24 mb-2" />
                  <div className="h-3 bg-surface-bg dark:bg-[#1C1D3A] rounded w-20" />
                </div>
              ))}
            </div>
          ) : recommendedJobs.length === 0 ? (
            <div className="bg-card-bg dark:bg-[#14152E] p-6 rounded-xl border border-border-color dark:border-[#2A2B45] text-center">
              <p className="text-sm text-muted-color dark:text-[#8B8FA8]">No jobs available right now.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {recommendedJobs.map((job) => (
                <div key={job._id} className="bg-card-bg dark:bg-[#14152E] p-4 rounded-xl border border-border-color dark:border-[#2A2B45] hover:border-primary/50 transition-colors">
                  <h3 className="font-semibold text-sm mb-1 dark:text-[#F1F1F5] line-clamp-1">{job.title}</h3>
                  <p className="text-xs text-muted-color dark:text-[#8B8FA8] mb-1">{job.companyName}</p>
                  <p className="text-xs text-muted-color dark:text-[#8B8FA8] mb-3 flex items-center gap-1">
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {job.location}
                  </p>
                  <Link
                    to={`/candidate/jobs/${job._id}`}
                    className="inline-block text-xs font-semibold text-primary hover:text-primary/80 transition-colors"
                  >
                    View →
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

