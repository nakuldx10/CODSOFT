import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from '../../api/axios';
import useAuth from '../../hooks/useAuth';
import { timeAgo } from '../../utils/timeAgo';

const statusBadge = {
  open: 'bg-green-500/10 text-green-500 border-green-500/20',
  closed: 'bg-red-500/10 text-red-500 border-red-500/20',
};

const appStatusBadge = {
  'Pending': 'bg-gray-500/10 text-gray-500',
  'Under Review': 'bg-blue-500/10 text-blue-500',
  'Interview Scheduled': 'bg-amber-500/10 text-amber-500',
  'Selected': 'bg-green-500/10 text-green-500',
  'Rejected': 'bg-red-500/10 text-red-500',
};

/* Skeleton blocks */
const MetricSkeleton = () => (
  <div className="bg-card-bg dark:bg-[#14152E] rounded-xl border border-border-color dark:border-[#2A2B45] p-5 animate-pulse">
    <div className="h-4 w-24 bg-surface-bg dark:bg-[#1C1D3A] rounded mb-3"></div>
    <div className="h-8 w-16 bg-surface-bg dark:bg-[#1C1D3A] rounded"></div>
  </div>
);

const JobRowSkeleton = () => (
  <div className="flex items-center justify-between py-4 border-b border-border-color dark:border-[#2A2B45] animate-pulse">
    <div className="space-y-2 flex-1">
      <div className="h-4 w-48 bg-surface-bg dark:bg-[#1C1D3A] rounded"></div>
      <div className="h-3 w-32 bg-surface-bg dark:bg-[#1C1D3A] rounded"></div>
    </div>
    <div className="h-6 w-20 bg-surface-bg dark:bg-[#1C1D3A] rounded-full"></div>
  </div>
);

const AppSkeleton = () => (
  <div className="flex items-center gap-3 py-3 border-b border-border-color dark:border-[#2A2B45] animate-pulse">
    <div className="w-8 h-8 rounded-full bg-surface-bg dark:bg-[#1C1D3A]"></div>
    <div className="flex-1 space-y-1.5">
      <div className="h-3 w-28 bg-surface-bg dark:bg-[#1C1D3A] rounded"></div>
      <div className="h-2.5 w-20 bg-surface-bg dark:bg-[#1C1D3A] rounded"></div>
    </div>
  </div>
);

import { usePageTitle } from '../../hooks/usePageTitle';

const EmployerDashboard = () => {
  usePageTitle('Employer Dashboard');
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [recentApps, setRecentApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const jobsRes = await axios.get('/api/jobs/employer/mine');
        const jobsList = jobsRes.data.jobs || jobsRes.data || [];
        setJobs(jobsList);

        // Fetch applications for the first 3 jobs that have applicants
        const appsPromises = jobsList.slice(0, 3).map((job) =>
          axios.get(`/api/applications/job/${job._id}`).catch(() => ({ data: [] }))
        );
        const appsResults = await Promise.all(appsPromises);
        const allApps = appsResults
          .flatMap((res) => {
            const data = res.data.applications || res.data || [];
            return Array.isArray(data) ? data : [];
          })
          .sort((a, b) => new Date(b.appliedAt) - new Date(a.appliedAt))
          .slice(0, 5);
        setRecentApps(allApps);
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

  const totalJobs = jobs.length;
  const totalApplicants = jobs.reduce((sum, j) => sum + (j.applicantCount || 0), 0);
  const activeJobs = jobs.filter((j) => j.status === 'open').length;
  const closedJobs = jobs.filter((j) => j.status === 'closed').length;

  const metrics = [
    { label: 'Total Jobs Posted', value: totalJobs, icon: 'M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z', color: 'text-primary bg-primary/10' },
    { label: 'Total Applicants', value: totalApplicants, icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z', color: 'text-accent bg-accent/10' },
    { label: 'Active Jobs', value: activeJobs, icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z', color: 'text-green-500 bg-green-500/10' },
    { label: 'Jobs Closed', value: closedJobs, icon: 'M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636', color: 'text-red-500 bg-red-500/10' },
  ];

  const recentJobs = jobs.slice(0, 5);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <svg className="w-16 h-16 text-red-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4.5c-.77-.833-2.694-.833-3.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
        <h3 className="text-lg font-bold text-red-500 mb-1">Something went wrong</h3>
        <p className="text-sm text-text-muted dark:text-[#8B8FA8]">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Greeting */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold">
          Welcome back, {user?.companyName || user?.name} 👋
        </h1>
        <p className="text-text-muted dark:text-[#8B8FA8] mt-1">
          Here's an overview of your hiring activity.
        </p>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {loading
          ? Array.from({ length: 4 }).map((_, i) => <MetricSkeleton key={i} />)
          : metrics.map((m, i) => (
              <div
                key={i}
                className="bg-card-bg dark:bg-[#14152E] rounded-xl border border-border-color dark:border-[#2A2B45] p-5 hover:border-primary/40 transition-colors"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${m.color}`}>
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={m.icon} />
                    </svg>
                  </div>
                  <span className="text-xs font-medium text-text-muted dark:text-[#8B8FA8]">{m.label}</span>
                </div>
                <p className="text-2xl font-bold">{m.value}</p>
              </div>
            ))}
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Recent Job Posts (2/3) */}
        <div className="lg:col-span-2 bg-card-bg dark:bg-[#14152E] rounded-xl border border-border-color dark:border-[#2A2B45] p-5 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold">Recent Job Posts</h2>
            <Link
              to="/employer/jobs"
              className="text-xs font-semibold text-primary hover:text-primary-dark transition-colors"
            >
              View All Jobs →
            </Link>
          </div>

          {loading ? (
            <div className="space-y-0">
              {Array.from({ length: 5 }).map((_, i) => (
                <JobRowSkeleton key={i} />
              ))}
            </div>
          ) : recentJobs.length === 0 ? (
            <div className="text-center py-10">
              <svg className="w-12 h-12 mx-auto text-text-muted dark:text-[#8B8FA8] mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <p className="text-sm text-text-muted dark:text-[#8B8FA8]">No jobs posted yet</p>
              <Link to="/employer/post-job" className="btn-primary text-sm mt-3 inline-block">
                Post Your First Job
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-border-color dark:divide-[#2A2B45]">
              {recentJobs.map((job) => (
                <div key={job._id} className="py-4 first:pt-0 last:pb-0">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="min-w-0">
                      <h3 className="font-semibold text-sm truncate">{job.title}</h3>
                      <div className="flex flex-wrap items-center gap-2 mt-1 text-xs text-text-muted dark:text-[#8B8FA8]">
                        <span className="inline-flex items-center gap-1">
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          {job.applicantCount || 0} applicants
                        </span>
                        <span>•</span>
                        <span>{timeAgo(job.createdAt)}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className={`px-2.5 py-1 rounded-full border text-[10px] font-semibold capitalize ${statusBadge[job.status] || statusBadge.open}`}>
                        {job.status}
                      </span>
                      <Link
                        to={`/employer/jobs`}
                        className="text-xs font-medium text-text-muted dark:text-[#8B8FA8] hover:text-primary transition-colors px-2 py-1"
                      >
                        Edit
                      </Link>
                      <Link
                        to={`/employer/applications?jobId=${job._id}`}
                        className="text-xs font-medium text-primary hover:text-primary-dark transition-colors px-2 py-1"
                      >
                        View Applicants
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right: Recent Applications (1/3) */}
        <div className="bg-card-bg dark:bg-[#14152E] rounded-xl border border-border-color dark:border-[#2A2B45] p-5 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold">Recent Applications</h2>
            <Link
              to="/employer/applications"
              className="text-xs font-semibold text-primary hover:text-primary-dark transition-colors"
            >
              View All →
            </Link>
          </div>

          {loading ? (
            <div>
              {Array.from({ length: 4 }).map((_, i) => (
                <AppSkeleton key={i} />
              ))}
            </div>
          ) : recentApps.length === 0 ? (
            <div className="text-center py-8">
              <svg className="w-10 h-10 mx-auto text-text-muted dark:text-[#8B8FA8] mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p className="text-xs text-text-muted dark:text-[#8B8FA8]">No applications yet</p>
            </div>
          ) : (
            <div className="divide-y divide-border-color dark:divide-[#2A2B45]">
              {recentApps.map((app) => (
                <div key={app._id} className="py-3 first:pt-0 last:pb-0">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold bg-primary/10 text-primary">
                      {(app.candidate?.name || 'U').charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold truncate">{app.candidate?.name || 'Unknown'}</p>
                      <p className="text-[11px] text-text-muted dark:text-[#8B8FA8] truncate">
                        {app.job?.title || 'Job'} • {timeAgo(app.appliedAt)}
                      </p>
                    </div>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold flex-shrink-0 ${appStatusBadge[app.status] || 'bg-gray-500/10 text-gray-500'}`}>
                      {app.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmployerDashboard;
