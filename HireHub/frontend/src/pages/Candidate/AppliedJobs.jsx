import { usePageTitle } from '../../hooks/usePageTitle';
import { useState, useEffect } from 'react';
import axios from '../../api/axios';
import ApplicationCard from '../../components/candidate/ApplicationCard';

const tabs = ['All', 'Pending', 'Under Review', 'Interview Scheduled', 'Selected', 'Rejected'];

const AppliedJobs = () => {
  usePageTitle('Applied Jobs');
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('All');

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        setLoading(true);
        setError(null);
        const { data } = await axios.get('/api/applications/mine');
        setApplications(data.applications || data || []);
      } catch (err) {
        const message = err.response?.data?.message || err.message || 'Failed to load data';
        setError(message);
        console.error('Fetch error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchApplications();
  }, []);

  const getCount = (tab) => {
    if (tab === 'All') return applications.length;
    return applications.filter((app) => app.status === tab).length;
  };

  const filtered = activeTab === 'All'
    ? applications
    : applications.filter((app) => app.status === activeTab);

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
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 dark:text-[#F1F1F5]">My Applications</h1>

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-6 scrollbar-hide">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap transition-colors ${
              activeTab === tab
                ? 'bg-primary text-white'
                : 'bg-card-bg dark:bg-[#14152E] border border-border-color dark:border-[#2A2B45] text-muted-color dark:text-[#8B8FA8] hover:border-primary/50'
            }`}
          >
            {tab}
            <span
              className={`min-w-[20px] h-5 flex items-center justify-center rounded-full text-xs font-bold ${
                activeTab === tab
                  ? 'bg-white/20 text-white'
                  : 'bg-surface-bg dark:bg-[#1C1D3A]'
              }`}
            >
              {loading ? '-' : getCount(tab)}
            </span>
          </button>
        ))}
      </div>

      {/* Loading */}
      {loading ? (
        <div className="space-y-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-card-bg dark:bg-[#14152E] p-6 rounded-xl border border-border-color dark:border-[#2A2B45] animate-pulse">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-surface-bg dark:bg-[#1C1D3A] rounded-lg" />
                <div className="flex-1">
                  <div className="h-5 bg-surface-bg dark:bg-[#1C1D3A] rounded w-48 mb-2" />
                  <div className="h-3 bg-surface-bg dark:bg-[#1C1D3A] rounded w-32" />
                </div>
                <div className="h-7 bg-surface-bg dark:bg-[#1C1D3A] rounded-full w-24" />
              </div>
              <div className="flex justify-between items-center pt-4 border-t border-border-color dark:border-[#2A2B45]">
                <div className="h-4 bg-surface-bg dark:bg-[#1C1D3A] rounded w-20" />
                <div className="flex gap-3">
                  <div className="w-3 h-3 rounded-full bg-surface-bg dark:bg-[#1C1D3A]" />
                  <div className="w-3 h-3 rounded-full bg-surface-bg dark:bg-[#1C1D3A]" />
                  <div className="w-3 h-3 rounded-full bg-surface-bg dark:bg-[#1C1D3A]" />
                </div>
                <div className="h-4 bg-surface-bg dark:bg-[#1C1D3A] rounded w-24" />
              </div>
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        /* Empty State */
        <div className="bg-card-bg dark:bg-[#14152E] p-10 rounded-xl border border-border-color dark:border-[#2A2B45] text-center">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="text-lg font-bold mb-1 dark:text-[#F1F1F5]">
            {activeTab === 'All' ? 'No applications yet' : `No ${activeTab.toLowerCase()} applications`}
          </h3>
          <p className="text-sm text-muted-color dark:text-[#8B8FA8]">
            {activeTab === 'All'
              ? 'Start exploring jobs and submit your first application!'
              : `You don't have any applications with "${activeTab}" status.`}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((app) => (
            <ApplicationCard key={app._id} application={app} />
          ))}
        </div>
      )}
    </div>
  );
};

export default AppliedJobs;
