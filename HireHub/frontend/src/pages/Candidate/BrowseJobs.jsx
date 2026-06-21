import { usePageTitle } from '../../hooks/usePageTitle';
import { useState, useEffect, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import axios from '../../api/axios';
import { timeAgo } from '../../utils/timeAgo';
import { JobCardSkeleton } from '../../components/common/Skeleton';
import JobCard from '../../components/candidate/JobCard';
import JobFilters from '../../components/candidate/JobFilters';

const defaultFilters = {
  jobType: '',
  experienceLevel: '',
  remote: false,
  salaryMin: 0,
  salaryMax: '',
};

const BrowseJobs = () => {
  usePageTitle('Browse Jobs');
  const [jobs, setJobs] = useState([]);
  const [totalJobs, setTotalJobs] = useState(0);
  const [savedJobIds, setSavedJobIds] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [search, setSearch] = useState('');
  const [location, setLocation] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [debouncedLocation, setDebouncedLocation] = useState('');
  const [filters, setFilters] = useState(defaultFilters);
  const [sort, setSort] = useState('newest');
  const [page, setPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const limit = 10;

  const searchTimer = useRef(null);

  // Debounce search and location
  useEffect(() => {
    if (searchTimer.current) clearTimeout(searchTimer.current);
    searchTimer.current = setTimeout(() => {
      setDebouncedSearch(search);
      setDebouncedLocation(location);
      setPage(1);
    }, 500);
    return () => clearTimeout(searchTimer.current);
  }, [search, location]);

  // Fetch saved jobs
  useEffect(() => {
    const fetchSaved = async () => {
      try {
        const { data } = await axios.get('/api/applications/saved');
        const saved = data.savedJobs || data || [];
        const ids = new Set(saved.map((s) => s.job?._id || s._id));
        setSavedJobIds(ids);
      } catch {
        // silently fail
      }
    };
    fetchSaved();
  }, []);

  // Fetch jobs
  const fetchJobs = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const params = {
        page,
        limit,
        sort,
      };
      if (debouncedSearch) params.search = debouncedSearch;
      if (debouncedLocation) params.location = debouncedLocation;
      if (filters.jobType) params.jobType = filters.jobType;
      if (filters.experienceLevel) params.experienceLevel = filters.experienceLevel;
      if (filters.remote) params.remote = true;
      if (filters.salaryMin) params.salaryMin = filters.salaryMin;
      if (filters.salaryMax) params.salaryMax = filters.salaryMax;

      const { data } = await axios.get('/api/jobs', { params });
      setJobs(data.jobs || data || []);
      setTotalJobs(data.total || data.totalJobs || (data.jobs || data || []).length);
    } catch (err) {
        const message = err.response?.data?.message || err.message || 'Failed to load data';
        setError(message);
        console.error('Fetch error:', err);
      } finally {
      setLoading(false);
    }
  }, [page, sort, debouncedSearch, debouncedLocation, filters]);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  const totalPages = Math.ceil(totalJobs / limit);

  const handleSaveToggle = (jobId, saved) => {
    setSavedJobIds((prev) => {
      const next = new Set(prev);
      if (saved) next.add(jobId);
      else next.delete(jobId);
      return next;
    });
  };

  const handleApplyFilters = () => {
    setPage(1);
    setShowFilters(false);
  };

  const handleResetFilters = () => {
    setFilters(defaultFilters);
    setPage(1);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setDebouncedSearch(search);
    setDebouncedLocation(location);
    setPage(1);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Search Bar */}
      <form onSubmit={handleSearchSubmit} className="mb-6">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-color dark:text-[#8B8FA8]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search job titles, keywords..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-card-bg dark:bg-[#14152E] border border-border-color dark:border-[#2A2B45] rounded-xl text-sm focus:outline-none focus:border-primary transition-colors dark:text-[#F1F1F5] placeholder:text-muted-color dark:placeholder:text-[#8B8FA8]"
            />
          </div>
          <div className="relative flex-1 sm:max-w-[240px]">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-color dark:text-[#8B8FA8]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <input
              type="text"
              placeholder="Location..."
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-card-bg dark:bg-[#14152E] border border-border-color dark:border-[#2A2B45] rounded-xl text-sm focus:outline-none focus:border-primary transition-colors dark:text-[#F1F1F5] placeholder:text-muted-color dark:placeholder:text-[#8B8FA8]"
            />
          </div>
          <button
            type="submit"
            className="px-6 py-3 bg-primary text-white rounded-xl font-semibold text-sm hover:bg-primary/90 transition-colors"
          >
            Search
          </button>
        </div>
      </form>

      {/* Mobile Filter Button */}
      <button
        onClick={() => setShowFilters(!showFilters)}
        className="lg:hidden mb-4 flex items-center gap-2 px-4 py-2.5 bg-card-bg dark:bg-[#14152E] border border-border-color dark:border-[#2A2B45] rounded-xl text-sm font-semibold transition-colors hover:border-primary"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
        </svg>
        Filters
      </button>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Filter Panel */}
        <div className={`lg:w-72 flex-shrink-0 ${showFilters ? 'block' : 'hidden lg:block'}`}>
          <JobFilters
            filters={filters}
            setFilters={setFilters}
            onApply={handleApplyFilters}
            onReset={handleResetFilters}
          />
        </div>

        {/* Jobs Area */}
        <div className="flex-1 min-w-0">
          {/* Sort & Count Bar */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-5">
            <p className="text-sm text-muted-color dark:text-[#8B8FA8]">
              Showing <span className="font-semibold dark:text-[#F1F1F5]">{jobs.length}</span> of{' '}
              <span className="font-semibold dark:text-[#F1F1F5]">{totalJobs}</span> jobs
            </p>
            <select
              value={sort}
              onChange={(e) => {
                setSort(e.target.value);
                setPage(1);
              }}
              className="px-4 py-2 bg-card-bg dark:bg-[#14152E] border border-border-color dark:border-[#2A2B45] rounded-lg text-sm focus:outline-none focus:border-primary transition-colors dark:text-[#F1F1F5]"
            >
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
              <option value="salary_high">Highest Salary</option>
              <option value="salary_low">Lowest Salary</option>
            </select>
          </div>

          {/* Error State */}
          {error && (
            <div className="bg-card-bg dark:bg-[#14152E] p-8 rounded-xl border border-red-500/30 text-center mb-6">
              <div className="w-14 h-14 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg className="w-7 h-7 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-sm text-red-500 mb-3">{error}</p>
              <button onClick={fetchJobs} className="text-sm font-semibold text-primary hover:text-primary/80 transition-colors">
                Try Again
              </button>
            </div>
          )}

          {/* Loading Skeleton */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[...Array(6)].map((_, i) => (
                <JobCardSkeleton key={i} />
              ))}
            </div>
          ) : jobs.length === 0 ? (
            /* Empty State */
            <div className="bg-card-bg dark:bg-[#14152E] p-10 rounded-xl border border-border-color dark:border-[#2A2B45] text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold mb-1 dark:text-[#F1F1F5]">No jobs found</h3>
              <p className="text-sm text-muted-color dark:text-[#8B8FA8]">
                Try adjusting your search terms or filters to find what you&apos;re looking for.
              </p>
            </div>
          ) : (
            /* Job Cards Grid */
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {jobs.map((job) => (
                <JobCard
                  key={job._id}
                  job={job}
                  isSaved={savedJobIds.has(job._id)}
                  onSaveToggle={handleSaveToggle}
                />
              ))}
            </div>
          )}

          {/* Pagination */}
          {!loading && totalPages > 1 && (
            <div className="flex items-center justify-center gap-3 mt-8">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-4 py-2 bg-card-bg dark:bg-[#14152E] border border-border-color dark:border-[#2A2B45] rounded-lg text-sm font-semibold transition-colors hover:border-primary disabled:opacity-40 disabled:cursor-not-allowed dark:text-[#F1F1F5]"
              >
                ← Previous
              </button>
              <span className="text-sm text-muted-color dark:text-[#8B8FA8]">
                Page <span className="font-semibold dark:text-[#F1F1F5]">{page}</span> of{' '}
                <span className="font-semibold dark:text-[#F1F1F5]">{totalPages}</span>
              </span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-4 py-2 bg-card-bg dark:bg-[#14152E] border border-border-color dark:border-[#2A2B45] rounded-lg text-sm font-semibold transition-colors hover:border-primary disabled:opacity-40 disabled:cursor-not-allowed dark:text-[#F1F1F5]"
              >
                Next →
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BrowseJobs;
