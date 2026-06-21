import { usePageTitle } from '../../hooks/usePageTitle';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import axios from '../../api/axios';
import { timeAgo } from '../../utils/timeAgo';
import JobPostForm from '../../components/employer/JobPostForm';

const statusBadge = {
  open: 'bg-green-500/10 text-green-500 border-green-500/20',
  closed: 'bg-red-500/10 text-red-500 border-red-500/20',
};

const filterTabs = ['All', 'Active', 'Closed'];

/* Skeletons */
const TableRowSkeleton = () => (
  <tr className="animate-pulse border-b border-border-color dark:border-[#2A2B45]">
    <td className="py-4 px-4"><div className="h-4 w-40 bg-surface-bg dark:bg-[#1C1D3A] rounded"></div></td>
    <td className="py-4 px-4"><div className="h-5 w-8 bg-surface-bg dark:bg-[#1C1D3A] rounded-full mx-auto"></div></td>
    <td className="py-4 px-4"><div className="h-6 w-12 bg-surface-bg dark:bg-[#1C1D3A] rounded-full mx-auto"></div></td>
    <td className="py-4 px-4"><div className="h-4 w-20 bg-surface-bg dark:bg-[#1C1D3A] rounded mx-auto"></div></td>
    <td className="py-4 px-4"><div className="h-4 w-20 bg-surface-bg dark:bg-[#1C1D3A] rounded mx-auto"></div></td>
    <td className="py-4 px-4"><div className="h-4 w-24 bg-surface-bg dark:bg-[#1C1D3A] rounded mx-auto"></div></td>
  </tr>
);

const CardSkeleton = () => (
  <div className="bg-card-bg dark:bg-[#14152E] rounded-xl border border-border-color dark:border-[#2A2B45] p-5 animate-pulse space-y-3">
    <div className="h-5 w-3/4 bg-surface-bg dark:bg-[#1C1D3A] rounded"></div>
    <div className="h-4 w-1/2 bg-surface-bg dark:bg-[#1C1D3A] rounded"></div>
    <div className="h-4 w-1/3 bg-surface-bg dark:bg-[#1C1D3A] rounded"></div>
    <div className="flex gap-2 mt-2">
      <div className="h-8 w-16 bg-surface-bg dark:bg-[#1C1D3A] rounded"></div>
      <div className="h-8 w-24 bg-surface-bg dark:bg-[#1C1D3A] rounded"></div>
    </div>
  </div>
);

const ManageJobs = () => {
  usePageTitle('Manage Jobs');
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('All');

  // Modal states
  const [editJob, setEditJob] = useState(null);
  const [isEditSubmitting, setIsEditSubmitting] = useState(false);
  const [deleteJob, setDeleteJob] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/api/jobs/employer/mine');
      setJobs(res.data.jobs || res.data || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load jobs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const filteredJobs = jobs.filter((job) => {
    if (activeTab === 'Active') return job.status === 'open';
    if (activeTab === 'Closed') return job.status === 'closed';
    return true;
  });

  const handleStatusToggle = async (jobId, currentStatus) => {
    const newStatus = currentStatus === 'open' ? 'closed' : 'open';
    try {
      await axios.put(`/api/jobs/${jobId}/status`, { status: newStatus });
      setJobs((prev) =>
        prev.map((j) => (j._id === jobId ? { ...j, status: newStatus } : j))
      );
      toast.success(`Job ${newStatus === 'open' ? 'reopened' : 'closed'} successfully`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update status');
    }
  };

  const handleEdit = async (data) => {
    try {
      setIsEditSubmitting(true);
      await axios.put(`/api/jobs/${editJob._id}`, data);
      toast.success('Job updated successfully!');
      setEditJob(null);
      fetchJobs();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update job');
    } finally {
      setIsEditSubmitting(false);
    }
  };

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await axios.delete(`/api/jobs/${deleteJob._id}`);
      toast.success('Job deleted');
      setJobs((prev) => prev.filter((j) => j._id !== deleteJob._id));
      setDeleteJob(null);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete job');
    } finally {
      setIsDeleting(false);
    }
  };

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
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">My Job Listings</h1>
          <p className="text-text-muted dark:text-[#8B8FA8] mt-1">Manage and track all your job postings</p>
        </div>
        <Link to="/employer/post-job" className="btn-primary text-sm inline-flex items-center gap-2 w-fit">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Post New Job
        </Link>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-1 bg-surface-bg dark:bg-[#1C1D3A] p-1 rounded-lg w-fit">
        {filterTabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === tab
                ? 'bg-primary text-white'
                : 'text-text-muted dark:text-[#8B8FA8] hover:text-primary-color'
            }`}
          >
            {tab}
            {tab === 'All' && ` (${jobs.length})`}
            {tab === 'Active' && ` (${jobs.filter((j) => j.status === 'open').length})`}
            {tab === 'Closed' && ` (${jobs.filter((j) => j.status === 'closed').length})`}
          </button>
        ))}
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block bg-card-bg dark:bg-[#14152E] rounded-xl border border-border-color dark:border-[#2A2B45] overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border-color dark:border-[#2A2B45] text-xs text-text-muted dark:text-[#8B8FA8] uppercase tracking-wider">
              <th className="text-left py-3 px-4 font-semibold">Job Title</th>
              <th className="text-center py-3 px-4 font-semibold">Applicants</th>
              <th className="text-center py-3 px-4 font-semibold">Status</th>
              <th className="text-center py-3 px-4 font-semibold">Posted</th>
              <th className="text-center py-3 px-4 font-semibold">Deadline</th>
              <th className="text-center py-3 px-4 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => <TableRowSkeleton key={i} />)
            ) : filteredJobs.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-16 text-center">
                  <svg className="w-12 h-12 mx-auto text-text-muted dark:text-[#8B8FA8] mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <p className="text-sm text-text-muted dark:text-[#8B8FA8] mb-3">You haven't posted any jobs yet</p>
                  <Link to="/employer/post-job" className="btn-primary text-sm">Post a Job</Link>
                </td>
              </tr>
            ) : (
              filteredJobs.map((job) => (
                <tr key={job._id} className="border-b border-border-color dark:border-[#2A2B45] hover:bg-surface-bg/50 dark:hover:bg-[#1C1D3A]/50 transition-colors">
                  <td className="py-4 px-4">
                    <p className="font-semibold text-sm">{job.title}</p>
                    <p className="text-xs text-text-muted dark:text-[#8B8FA8]">{job.location}</p>
                  </td>
                  <td className="py-4 px-4 text-center">
                    <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-primary/10 text-primary text-xs font-bold">
                      {job.applicantCount || 0}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-center">
                    <button
                      onClick={() => handleStatusToggle(job._id, job.status)}
                      className="group relative inline-flex items-center"
                      title={`Click to ${job.status === 'open' ? 'close' : 'reopen'}`}
                    >
                      <div className={`w-10 h-5 rounded-full transition-colors ${job.status === 'open' ? 'bg-green-500' : 'bg-gray-400 dark:bg-[#2A2B45]'}`}>
                        <div className={`w-4 h-4 rounded-full bg-white mt-0.5 transition-transform ${job.status === 'open' ? 'translate-x-5' : 'translate-x-0.5'}`}></div>
                      </div>
                      <span className={`ml-2 text-[10px] font-semibold capitalize ${job.status === 'open' ? 'text-green-500' : 'text-text-muted dark:text-[#8B8FA8]'}`}>
                        {job.status}
                      </span>
                    </button>
                  </td>
                  <td className="py-4 px-4 text-center text-xs text-text-muted dark:text-[#8B8FA8]">
                    {timeAgo(job.createdAt)}
                  </td>
                  <td className="py-4 px-4 text-center text-xs text-text-muted dark:text-[#8B8FA8]">
                    {job.deadline ? new Date(job.deadline).toLocaleDateString() : '—'}
                  </td>
                  <td className="py-4 px-4 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <button
                        onClick={() => setEditJob(job)}
                        className="p-1.5 text-text-muted hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <Link
                        to={`/employer/applications?jobId=${job._id}`}
                        className="p-1.5 text-text-muted hover:text-accent hover:bg-accent/10 rounded-lg transition-colors"
                        title="View Applicants"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      </Link>
                      <button
                        onClick={() => setDeleteJob(job)}
                        className="p-1.5 text-text-muted hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-4">
        {loading ? (
          Array.from({ length: 3 }).map((_, i) => <CardSkeleton key={i} />)
        ) : filteredJobs.length === 0 ? (
          <div className="bg-card-bg dark:bg-[#14152E] rounded-xl border border-border-color dark:border-[#2A2B45] p-8 text-center">
            <svg className="w-12 h-12 mx-auto text-text-muted dark:text-[#8B8FA8] mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <p className="text-sm text-text-muted dark:text-[#8B8FA8] mb-3">You haven't posted any jobs yet</p>
            <Link to="/employer/post-job" className="btn-primary text-sm">Post a Job</Link>
          </div>
        ) : (
          filteredJobs.map((job) => (
            <div key={job._id} className="bg-card-bg dark:bg-[#14152E] rounded-xl border border-border-color dark:border-[#2A2B45] p-5">
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="min-w-0">
                  <h3 className="font-bold text-sm truncate">{job.title}</h3>
                  <p className="text-xs text-text-muted dark:text-[#8B8FA8] mt-0.5">{job.location}</p>
                </div>
                <span className={`px-2.5 py-1 rounded-full border text-[10px] font-semibold capitalize flex-shrink-0 ${statusBadge[job.status] || statusBadge.open}`}>
                  {job.status}
                </span>
              </div>

              <div className="flex flex-wrap gap-3 text-xs text-text-muted dark:text-[#8B8FA8] mb-4">
                <span className="inline-flex items-center gap-1">
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {job.applicantCount || 0} applicants
                </span>
                <span>•</span>
                <span>Posted {timeAgo(job.createdAt)}</span>
                {job.deadline && (
                  <>
                    <span>•</span>
                    <span>Due {new Date(job.deadline).toLocaleDateString()}</span>
                  </>
                )}
              </div>

              <div className="flex items-center gap-2 pt-3 border-t border-border-color dark:border-[#2A2B45]">
                <button
                  onClick={() => handleStatusToggle(job._id, job.status)}
                  className={`text-xs font-medium px-3 py-1.5 rounded-lg transition-colors ${
                    job.status === 'open'
                      ? 'bg-red-500/10 text-red-500 hover:bg-red-500/20'
                      : 'bg-green-500/10 text-green-500 hover:bg-green-500/20'
                  }`}
                >
                  {job.status === 'open' ? 'Close' : 'Reopen'}
                </button>
                <button
                  onClick={() => setEditJob(job)}
                  className="text-xs font-medium px-3 py-1.5 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                >
                  Edit
                </button>
                <Link
                  to={`/employer/applications?jobId=${job._id}`}
                  className="text-xs font-medium px-3 py-1.5 rounded-lg bg-accent/10 text-accent hover:bg-accent/20 transition-colors"
                >
                  Applicants
                </Link>
                <button
                  onClick={() => setDeleteJob(job)}
                  className="ml-auto p-1.5 text-text-muted hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Edit Modal */}
      {editJob && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/60 backdrop-blur-sm p-4 pt-8">
          <div className="bg-page-bg dark:bg-[#0D0E21] rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="sticky top-0 bg-card-bg dark:bg-[#14152E] border-b border-border-color dark:border-[#2A2B45] px-6 py-4 rounded-t-2xl flex items-center justify-between z-10">
              <h2 className="text-lg font-bold">Edit Job: {editJob.title}</h2>
              <button
                onClick={() => setEditJob(null)}
                className="p-2 hover:bg-surface-bg dark:hover:bg-[#1C1D3A] rounded-lg transition-colors"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-6">
              <JobPostForm
                initialData={editJob}
                onSubmit={handleEdit}
                isSubmitting={isEditSubmitting}
              />
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm Modal */}
      {deleteJob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-card-bg dark:bg-[#14152E] rounded-xl border border-border-color dark:border-[#2A2B45] p-6 max-w-md w-full shadow-2xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4.5c-.77-.833-2.694-.833-3.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <div>
                <h3 className="font-bold">Delete Job</h3>
                <p className="text-sm text-text-muted dark:text-[#8B8FA8]">
                  Are you sure you want to delete <strong>"{deleteJob.title}"</strong>? This action cannot be undone.
                </p>
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setDeleteJob(null)}
                className="px-4 py-2 text-sm font-medium rounded-lg border border-border-color dark:border-[#2A2B45] hover:bg-surface-bg dark:hover:bg-[#1C1D3A] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="px-4 py-2 text-sm font-medium rounded-lg bg-red-500 text-white hover:bg-red-600 transition-colors disabled:opacity-50"
              >
                {isDeleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageJobs;
