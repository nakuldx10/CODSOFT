import { usePageTitle } from '../../hooks/usePageTitle';
import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import axios from '../../api/axios';
import ApplicantCard from '../../components/employer/ApplicantCard';

const statusFilters = ['All', 'Pending', 'Under Review', 'Interview Scheduled', 'Selected', 'Rejected'];

/* Skeletons */
const JobListSkeleton = () => (
  <div className="space-y-2 animate-pulse">
    {Array.from({ length: 5 }).map((_, i) => (
      <div key={i} className="p-3 rounded-lg space-y-2">
        <div className="h-4 w-3/4 bg-surface-bg dark:bg-[#1C1D3A] rounded"></div>
        <div className="h-3 w-1/3 bg-surface-bg dark:bg-[#1C1D3A] rounded"></div>
      </div>
    ))}
  </div>
);

const ApplicantSkeleton = () => (
  <div className="bg-card-bg dark:bg-[#14152E] rounded-xl border border-border-color dark:border-[#2A2B45] p-5 animate-pulse space-y-4">
    <div className="flex items-center gap-3">
      <div className="w-11 h-11 rounded-full bg-surface-bg dark:bg-[#1C1D3A]"></div>
      <div className="flex-1 space-y-2">
        <div className="h-4 w-32 bg-surface-bg dark:bg-[#1C1D3A] rounded"></div>
        <div className="h-3 w-24 bg-surface-bg dark:bg-[#1C1D3A] rounded"></div>
      </div>
      <div className="h-6 w-20 bg-surface-bg dark:bg-[#1C1D3A] rounded-full"></div>
    </div>
    <div className="flex gap-2">
      <div className="h-6 w-16 bg-surface-bg dark:bg-[#1C1D3A] rounded"></div>
      <div className="h-6 w-16 bg-surface-bg dark:bg-[#1C1D3A] rounded"></div>
      <div className="h-6 w-16 bg-surface-bg dark:bg-[#1C1D3A] rounded"></div>
    </div>
    <div className="h-16 bg-surface-bg dark:bg-[#1C1D3A] rounded"></div>
  </div>
);

const Applications = () => {
  usePageTitle('Applications');
  const [searchParams, setSearchParams] = useSearchParams();
  const jobIdParam = searchParams.get('jobId');

  const [jobs, setJobs] = useState([]);
  const [selectedJobId, setSelectedJobId] = useState(jobIdParam || '');
  const [applications, setApplications] = useState([]);
  const [activeFilter, setActiveFilter] = useState('All');

  const [loadingJobs, setLoadingJobs] = useState(true);
  const [loadingApps, setLoadingApps] = useState(false);
  const [error, setError] = useState('');

  // Mobile sidebar toggle
  const [showJobList, setShowJobList] = useState(!jobIdParam);

  // Fetch jobs
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoadingJobs(true);
        const res = await axios.get('/api/jobs/employer/mine');
        const jobsList = res.data.jobs || res.data || [];
        setJobs(jobsList);

        // Auto-select first job if none selected
        if (!selectedJobId && jobsList.length > 0) {
          setSelectedJobId(jobsList[0]._id);
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load jobs');
      } finally {
        setLoadingJobs(false);
      }
    };
    fetchJobs();
  }, []);

  // Fetch applications when job selected
  useEffect(() => {
    if (!selectedJobId) return;

    const fetchApps = async () => {
      try {
        setLoadingApps(true);
        const res = await axios.get(`/api/applications/job/${selectedJobId}`);
        setApplications(res.data.applications || res.data || []);
      } catch (err) {
        setApplications([]);
      } finally {
        setLoadingApps(false);
      }
    };
    fetchApps();
  }, [selectedJobId]);

  const handleJobSelect = (jobId) => {
    setSelectedJobId(jobId);
    setActiveFilter('All');
    setSearchParams({ jobId });
    setShowJobList(false); // collapse on mobile
  };

  const handleStatusUpdate = async (applicationId, newStatus) => {
    try {
      await axios.put(`/api/applications/${applicationId}/status`, { status: newStatus });
      toast.success(`Status updated to "${newStatus}"`);
      // Update local state
      setApplications((prev) =>
        prev.map((app) =>
          app._id === applicationId ? { ...app, status: newStatus } : app
        )
      );
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update status');
    }
  };

  const filteredApps = applications.filter((app) => {
    if (activeFilter === 'All') return true;
    return app.status === activeFilter;
  });

  const selectedJob = jobs.find((j) => j._id === selectedJobId);

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
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Applications</h1>
          <p className="text-text-muted dark:text-[#8B8FA8] mt-1">Review and manage candidate applications</p>
        </div>
        {/* Mobile toggle */}
        <button
          onClick={() => setShowJobList(!showJobList)}
          className="md:hidden p-2 rounded-lg bg-surface-bg dark:bg-[#1C1D3A] text-text-muted hover:text-primary transition-colors"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
          </svg>
        </button>
      </div>

      <div className="flex gap-6 relative">
        {/* Left Panel: Job List */}
        <div
          className={`${
            showJobList ? 'block' : 'hidden'
          } md:block w-full md:w-80 flex-shrink-0 bg-card-bg dark:bg-[#14152E] rounded-xl border border-border-color dark:border-[#2A2B45] overflow-hidden ${
            showJobList ? 'absolute md:relative z-20 inset-x-0 top-0' : ''
          }`}
        >
          <div className="p-4 border-b border-border-color dark:border-[#2A2B45]">
            <h2 className="text-sm font-bold text-text-muted dark:text-[#8B8FA8] uppercase tracking-wider">
              Your Jobs ({jobs.length})
            </h2>
          </div>

          <div className="max-h-[calc(100vh-280px)] overflow-y-auto">
            {loadingJobs ? (
              <div className="p-4">
                <JobListSkeleton />
              </div>
            ) : jobs.length === 0 ? (
              <div className="p-6 text-center">
                <p className="text-sm text-text-muted dark:text-[#8B8FA8]">No jobs found</p>
              </div>
            ) : (
              jobs.map((job) => (
                <button
                  key={job._id}
                  onClick={() => handleJobSelect(job._id)}
                  className={`w-full text-left p-4 border-b border-border-color dark:border-[#2A2B45] transition-colors ${
                    selectedJobId === job._id
                      ? 'bg-primary/5 border-l-2 border-l-primary'
                      : 'hover:bg-surface-bg dark:hover:bg-[#1C1D3A]'
                  }`}
                >
                  <p className={`font-semibold text-sm truncate ${selectedJobId === job._id ? 'text-primary' : ''}`}>
                    {job.title}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-text-muted dark:text-[#8B8FA8]">
                      {job.applicantCount || 0} applicant{(job.applicantCount || 0) !== 1 ? 's' : ''}
                    </span>
                    <span className={`w-1.5 h-1.5 rounded-full ${job.status === 'open' ? 'bg-green-500' : 'bg-red-500'}`}></span>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Right Panel: Applicants */}
        <div className="flex-1 min-w-0">
          {!selectedJobId ? (
            <div className="bg-card-bg dark:bg-[#14152E] rounded-xl border border-border-color dark:border-[#2A2B45] flex flex-col items-center justify-center py-20">
              <svg className="w-16 h-16 text-text-muted dark:text-[#8B8FA8] mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
              </svg>
              <h3 className="font-bold text-lg mb-1">Select a Job</h3>
              <p className="text-sm text-text-muted dark:text-[#8B8FA8]">
                Select a job from the left to view applicants
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Job info header */}
              {selectedJob && (
                <div className="bg-card-bg dark:bg-[#14152E] rounded-xl border border-border-color dark:border-[#2A2B45] p-4 flex items-center justify-between">
                  <div>
                    <h2 className="font-bold">{selectedJob.title}</h2>
                    <p className="text-xs text-text-muted dark:text-[#8B8FA8]">
                      {selectedJob.location} • {filteredApps.length} applicant{filteredApps.length !== 1 ? 's' : ''}
                    </p>
                  </div>
                </div>
              )}

              {/* Status Filter Tabs */}
              <div className="flex gap-1 overflow-x-auto pb-1 scrollbar-hide">
                {statusFilters.map((filter) => {
                  const count =
                    filter === 'All'
                      ? applications.length
                      : applications.filter((a) => a.status === filter).length;
                  return (
                    <button
                      key={filter}
                      onClick={() => setActiveFilter(filter)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                        activeFilter === filter
                          ? 'bg-primary text-white'
                          : 'bg-surface-bg dark:bg-[#1C1D3A] text-text-muted dark:text-[#8B8FA8] hover:text-primary-color'
                      }`}
                    >
                      {filter} ({count})
                    </button>
                  );
                })}
              </div>

              {/* Applicant Cards */}
              {loadingApps ? (
                <div className="space-y-4">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <ApplicantSkeleton key={i} />
                  ))}
                </div>
              ) : filteredApps.length === 0 ? (
                <div className="bg-card-bg dark:bg-[#14152E] rounded-xl border border-border-color dark:border-[#2A2B45] flex flex-col items-center justify-center py-16">
                  <svg className="w-14 h-14 text-text-muted dark:text-[#8B8FA8] mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <h3 className="font-bold mb-1">No Applications</h3>
                  <p className="text-sm text-text-muted dark:text-[#8B8FA8]">
                    {activeFilter === 'All'
                      ? 'No applications received yet'
                      : `No applications with status "${activeFilter}"`}
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredApps.map((app) => (
                    <ApplicantCard
                      key={app._id}
                      application={app}
                      onStatusUpdate={handleStatusUpdate}
                    />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Applications;
