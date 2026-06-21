import { usePageTitle } from '../../hooks/usePageTitle';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from '../../api/axios';
import JobCard from '../../components/candidate/JobCard';

const SavedJobs = () => {
  usePageTitle('Saved Jobs');
  const [savedJobs, setSavedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSaved = async () => {
      try {
        setLoading(true);
        setError(null);
        const { data } = await axios.get('/api/applications/saved');
        const jobs = data.savedJobs || data || [];
        // The saved API may return saved entries with nested job objects or direct job objects
        const normalizedJobs = jobs.map((item) => item.job || item);
        setSavedJobs(normalizedJobs);
      } catch (err) {
        const message = err.response?.data?.message || err.message || 'Failed to load data';
        setError(message);
        console.error('Fetch error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchSaved();
  }, []);

  const handleSaveToggle = (jobId, saved) => {
    if (!saved) {
      setSavedJobs((prev) => prev.filter((job) => job._id !== jobId));
    }
  };

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-6">
        <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mb-4">
          <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h2 className="text-xl font-bold mb-2 dark:text-[#F1F1F5]">Something went wrong</h2>
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
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold dark:text-[#F1F1F5]">Saved Jobs</h1>
        <span className="text-sm text-muted-color dark:text-[#8B8FA8]">
          {!loading && `${savedJobs.length} saved`}
        </span>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-card-bg dark:bg-[#14152E] p-5 rounded-xl border border-border-color dark:border-[#2A2B45] animate-pulse">
              <div className="flex gap-4 mb-4">
                <div className="w-12 h-12 bg-surface-bg dark:bg-[#1C1D3A] rounded-lg" />
                <div className="flex-1">
                  <div className="h-4 bg-surface-bg dark:bg-[#1C1D3A] rounded w-3/4 mb-2" />
                  <div className="h-3 bg-surface-bg dark:bg-[#1C1D3A] rounded w-1/2" />
                </div>
              </div>
              <div className="flex gap-2 mb-4">
                <div className="h-6 bg-surface-bg dark:bg-[#1C1D3A] rounded w-16" />
                <div className="h-6 bg-surface-bg dark:bg-[#1C1D3A] rounded w-20" />
              </div>
              <div className="pt-4 border-t border-border-color dark:border-[#2A2B45] flex justify-between">
                <div className="h-4 bg-surface-bg dark:bg-[#1C1D3A] rounded w-20" />
                <div className="h-4 bg-surface-bg dark:bg-[#1C1D3A] rounded w-16" />
              </div>
            </div>
          ))}
        </div>
      ) : savedJobs.length === 0 ? (
        <div className="bg-card-bg dark:bg-[#14152E] p-10 rounded-xl border border-border-color dark:border-[#2A2B45] text-center">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
            </svg>
          </div>
          <h3 className="text-lg font-bold mb-1 dark:text-[#F1F1F5]">No saved jobs yet</h3>
          <p className="text-sm text-muted-color dark:text-[#8B8FA8] mb-4">
            Browse jobs and save ones you like!
          </p>
          <Link
            to="/candidate/jobs"
            className="inline-block px-5 py-2.5 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors text-sm font-semibold"
          >
            Browse Jobs
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {savedJobs.map((job) => (
            <JobCard
              key={job._id}
              job={job}
              isSaved={true}
              onSaveToggle={handleSaveToggle}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default SavedJobs;
