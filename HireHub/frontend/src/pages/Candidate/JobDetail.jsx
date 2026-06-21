import { usePageTitle } from '../../hooks/usePageTitle';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import axios from '../../api/axios';
import toast from 'react-hot-toast';
import useAuth from '../../hooks/useAuth';
import { timeAgo } from '../../utils/timeAgo';
import { formatSalary } from '../../utils/formatSalary';

const JobDetail = () => {
  usePageTitle('Job Detail');
  const { id } = useParams();
  const { user } = useAuth();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [hasApplied, setHasApplied] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [applying, setApplying] = useState(false);
  const [useExistingResume, setUseExistingResume] = useState(true);
  const [newResumeFile, setNewResumeFile] = useState(null);

  const { register, handleSubmit, reset } = useForm();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const [jobRes, appsRes, savedRes] = await Promise.all([
          axios.get(`/api/jobs/${id}`),
          axios.get('/api/applications/mine'),
          axios.get('/api/applications/saved'),
        ]);

        const jobData = jobRes.data.job || jobRes.data;
        setJob(jobData);

        const apps = appsRes.data.applications || appsRes.data || [];
        const applied = apps.some(
          (app) => (app.job?._id || app.job) === id
        );
        setHasApplied(applied);

        const saved = savedRes.data.savedJobs || savedRes.data || [];
        const savedIds = saved.map((s) => s.job?._id || s._id);
        setIsSaved(savedIds.includes(id));
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load job details');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleSave = async () => {
    if (isSaving) return;
    setIsSaving(true);
    try {
      const { data } = await axios.post(`/api/applications/save/${id}`);
      setIsSaved(data.saved);
      toast.success(data.saved ? 'Job saved' : 'Job removed from saved');
    } catch {
      toast.error('Failed to save job');
    } finally {
      setIsSaving(false);
    }
  };

  const onApply = async (formData) => {
    try {
      setApplying(true);
      const payload = new FormData();
      if (formData.coverLetter) {
        payload.append('coverLetter', formData.coverLetter);
      }
      if (!useExistingResume && newResumeFile) {
        payload.append('resume', newResumeFile);
      }

      await axios.post(`/api/applications/${id}`, payload, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setHasApplied(true);
      setShowApplyModal(false);
      reset();
      toast.success('Application submitted successfully!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit application');
    } finally {
      setApplying(false);
    }
  };

  const tabs = [
    { key: 'overview', label: 'Overview' },
    { key: 'responsibilities', label: 'Responsibilities' },
    { key: 'requirements', label: 'Requirements' },
    { key: 'skills', label: 'Skills' },
  ];

  if (loading) {
    return (
      <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="flex-1 lg:w-[65%]">
            <div className="bg-card-bg dark:bg-[#14152E] p-6 sm:p-8 rounded-xl border border-border-color dark:border-[#2A2B45] animate-pulse">
              <div className="flex gap-4 mb-6">
                <div className="w-16 h-16 bg-surface-bg dark:bg-[#1C1D3A] rounded-xl" />
                <div className="flex-1">
                  <div className="h-6 bg-surface-bg dark:bg-[#1C1D3A] rounded w-64 mb-3" />
                  <div className="h-4 bg-surface-bg dark:bg-[#1C1D3A] rounded w-40 mb-2" />
                  <div className="flex gap-2">
                    <div className="h-6 bg-surface-bg dark:bg-[#1C1D3A] rounded w-20" />
                    <div className="h-6 bg-surface-bg dark:bg-[#1C1D3A] rounded w-24" />
                    <div className="h-6 bg-surface-bg dark:bg-[#1C1D3A] rounded w-16" />
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="h-4 bg-surface-bg dark:bg-[#1C1D3A] rounded" style={{ width: `${85 - i * 5}%` }} />
                ))}
              </div>
            </div>
          </div>
          <div className="lg:w-[35%]">
            <div className="bg-card-bg dark:bg-[#14152E] p-6 rounded-xl border border-border-color dark:border-[#2A2B45] animate-pulse">
              <div className="h-8 bg-surface-bg dark:bg-[#1C1D3A] rounded w-32 mb-4" />
              <div className="h-12 bg-surface-bg dark:bg-[#1C1D3A] rounded mb-3" />
              <div className="h-12 bg-surface-bg dark:bg-[#1C1D3A] rounded mb-6" />
              <div className="h-4 bg-surface-bg dark:bg-[#1C1D3A] rounded w-40 mb-2" />
              <div className="h-4 bg-surface-bg dark:bg-[#1C1D3A] rounded w-32" />
            </div>
          </div>
        </div>
      </div>
    );
  }

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

  if (!job) return null;

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Main Content (65%) */}
        <div className="flex-1 lg:w-[65%]">
          <div className="bg-card-bg dark:bg-[#14152E] p-6 sm:p-8 rounded-xl border border-border-color dark:border-[#2A2B45]">
            {/* Header */}
            <div className="flex gap-4 mb-6">
              <div className="w-16 h-16 bg-primary/10 text-primary rounded-xl flex items-center justify-center font-bold text-2xl flex-shrink-0 overflow-hidden">
                {job.postedBy?.companyLogo ? (
                  <img
                    src={`/uploads/${job.postedBy.companyLogo}`}
                    alt="Logo"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  (job.companyName || 'C').charAt(0).toUpperCase()
                )}
              </div>
              <div>
                <p className="text-sm text-muted-color dark:text-[#8B8FA8] mb-1">{job.companyName}</p>
                <h1 className="text-xl sm:text-2xl font-bold dark:text-[#F1F1F5] mb-2">{job.title}</h1>
                <div className="flex flex-wrap gap-2">
                  <span className="px-2.5 py-1 text-xs font-medium bg-surface-bg dark:bg-[#1C1D3A] rounded-md text-muted-color dark:text-[#8B8FA8] flex items-center gap-1">
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {job.location}
                  </span>
                  <span className="px-2.5 py-1 text-xs font-medium bg-blue-500/10 text-blue-500 rounded-md">
                    {job.jobType}
                  </span>
                  {job.experienceLevel && (
                    <span className="px-2.5 py-1 text-xs font-medium bg-amber-500/10 text-amber-500 rounded-md">
                      {job.experienceLevel}
                    </span>
                  )}
                  {job.remote && (
                    <span className="px-2.5 py-1 text-xs font-medium bg-purple-500/10 text-purple-500 rounded-md">
                      Remote
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Posted & Deadline */}
            <div className="flex flex-wrap gap-4 mb-6 text-sm text-muted-color dark:text-[#8B8FA8]">
              <span className="flex items-center gap-1.5">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Posted {timeAgo(job.createdAt)}
              </span>
              {job.deadline && (
                <span className="flex items-center gap-1.5">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Deadline: {new Date(job.deadline).toLocaleDateString()}
                </span>
              )}
            </div>

            {/* Tabs */}
            <div className="flex gap-1 border-b border-border-color dark:border-[#2A2B45] mb-6 overflow-x-auto">
              {tabs.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`px-4 py-3 text-sm font-semibold whitespace-nowrap border-b-2 transition-colors ${
                    activeTab === tab.key
                      ? 'border-primary text-primary'
                      : 'border-transparent text-muted-color dark:text-[#8B8FA8] hover:text-primary'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="prose prose-sm max-w-none dark:prose-invert">
              {activeTab === 'overview' && (
                <div className="text-sm leading-relaxed text-muted-color dark:text-[#8B8FA8] whitespace-pre-line">
                  {job.description || 'No description available.'}
                </div>
              )}

              {activeTab === 'responsibilities' && (
                <div>
                  {job.responsibilities?.length > 0 ? (
                    <ul className="space-y-2">
                      {job.responsibilities.map((item, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-muted-color dark:text-[#8B8FA8]">
                          <svg className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4" />
                          </svg>
                          {item}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-muted-color dark:text-[#8B8FA8]">No responsibilities listed.</p>
                  )}
                </div>
              )}

              {activeTab === 'requirements' && (
                <div>
                  {job.requirements?.length > 0 ? (
                    <ul className="space-y-2">
                      {job.requirements.map((item, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-muted-color dark:text-[#8B8FA8]">
                          <svg className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                          </svg>
                          {item}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-muted-color dark:text-[#8B8FA8]">No requirements listed.</p>
                  )}
                </div>
              )}

              {activeTab === 'skills' && (
                <div>
                  {job.skills?.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {job.skills.map((skill, i) => (
                        <span
                          key={i}
                          className="px-3 py-1.5 text-sm font-medium bg-primary/10 text-primary rounded-lg"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-color dark:text-[#8B8FA8]">No skills listed.</p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sticky Sidebar (35%) */}
        <div className="lg:w-[35%]">
          <div className="lg:sticky lg:top-24 space-y-4">
            {/* Action Card */}
            <div className="bg-card-bg dark:bg-[#14152E] p-6 rounded-xl border border-border-color dark:border-[#2A2B45]">
              {/* Salary */}
              <div className="mb-5">
                <span className="text-xs text-muted-color dark:text-[#8B8FA8] block mb-1">Salary</span>
                <span className="text-xl font-bold text-green-500 dark:text-green-400">
                  {formatSalary(job.salaryMin, job.salaryMax)}
                </span>
              </div>

              {/* Apply / Applied Button */}
              {hasApplied ? (
                <button
                  disabled
                  className="w-full py-3 bg-green-500/10 text-green-500 rounded-xl font-semibold text-sm mb-3 flex items-center justify-center gap-2 cursor-default"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Applied ✓
                </button>
              ) : (
                <button
                  onClick={() => setShowApplyModal(true)}
                  className="w-full py-3 bg-primary text-white rounded-xl font-semibold text-sm mb-3 hover:bg-primary/90 transition-colors"
                >
                  Apply Now
                </button>
              )}

              {/* Save Button */}
              <button
                onClick={handleSave}
                disabled={isSaving}
                className={`w-full py-3 rounded-xl font-semibold text-sm transition-colors flex items-center justify-center gap-2 ${
                  isSaved
                    ? 'bg-primary/10 text-primary border border-primary/20'
                    : 'bg-surface-bg dark:bg-[#1C1D3A] border border-border-color dark:border-[#2A2B45] hover:border-primary text-muted-color dark:text-[#8B8FA8]'
                }`}
              >
                <svg className="w-5 h-5" fill={isSaved ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                </svg>
                {isSaved ? 'Saved' : 'Save Job'}
              </button>
            </div>

            {/* Company Info */}
            <div className="bg-card-bg dark:bg-[#14152E] p-6 rounded-xl border border-border-color dark:border-[#2A2B45]">
              <h3 className="font-bold mb-4 dark:text-[#F1F1F5]">About the Company</h3>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-primary/10 text-primary rounded-lg flex items-center justify-center font-bold text-lg overflow-hidden flex-shrink-0">
                  {job.postedBy?.companyLogo ? (
                    <img
                      src={`/uploads/${job.postedBy.companyLogo}`}
                      alt="Logo"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    (job.companyName || 'C').charAt(0).toUpperCase()
                  )}
                </div>
                <div>
                  <h4 className="font-semibold text-sm dark:text-[#F1F1F5]">{job.companyName}</h4>
                  {job.postedBy?.companyWebsite && (
                    <a
                      href={job.postedBy.companyWebsite}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-primary hover:text-primary/80 transition-colors"
                    >
                      Visit website →
                    </a>
                  )}
                </div>
              </div>
              {job.postedBy?.companyDescription && (
                <p className="text-sm text-muted-color dark:text-[#8B8FA8] leading-relaxed">
                  {job.postedBy.companyDescription}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Apply Modal */}
      {showApplyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowApplyModal(false)}
          />
          <div className="relative bg-card-bg dark:bg-[#14152E] rounded-2xl border border-border-color dark:border-[#2A2B45] w-full max-w-lg max-h-[90vh] overflow-y-auto p-6 sm:p-8">
            <button
              onClick={() => setShowApplyModal(false)}
              className="absolute top-4 right-4 p-2 text-muted-color hover:text-red-500 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <h2 className="text-xl font-bold mb-1 dark:text-[#F1F1F5]">Apply for {job.title}</h2>
            <p className="text-sm text-muted-color dark:text-[#8B8FA8] mb-6">at {job.companyName}</p>

            <form onSubmit={handleSubmit(onApply)} className="space-y-5">
              {/* Cover Letter */}
              <div>
                <label className="block text-sm font-semibold mb-2 dark:text-[#F1F1F5]">
                  Cover Letter <span className="text-muted-color dark:text-[#8B8FA8] font-normal">(optional)</span>
                </label>
                <textarea
                  {...register('coverLetter')}
                  rows={5}
                  placeholder="Tell the employer why you're a great fit for this role..."
                  className="w-full px-4 py-3 bg-surface-bg dark:bg-[#1C1D3A] border border-border-color dark:border-[#2A2B45] rounded-xl text-sm focus:outline-none focus:border-primary transition-colors resize-none dark:text-[#F1F1F5] placeholder:text-muted-color dark:placeholder:text-[#8B8FA8]"
                />
              </div>

              {/* Resume */}
              <div>
                <label className="block text-sm font-semibold mb-2 dark:text-[#F1F1F5]">Resume</label>
                {user?.resume && (
                  <label className="flex items-center gap-3 p-3 bg-surface-bg dark:bg-[#1C1D3A] rounded-xl mb-3 cursor-pointer border border-border-color dark:border-[#2A2B45]">
                    <input
                      type="radio"
                      checked={useExistingResume}
                      onChange={() => {
                        setUseExistingResume(true);
                        setNewResumeFile(null);
                      }}
                      className="w-4 h-4 text-primary focus:ring-primary"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium dark:text-[#F1F1F5]">Use existing resume</p>
                      <p className="text-xs text-muted-color dark:text-[#8B8FA8] truncate">{user.resume}</p>
                    </div>
                    <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </label>
                )}
                <label className="flex items-center gap-3 p-3 bg-surface-bg dark:bg-[#1C1D3A] rounded-xl cursor-pointer border border-border-color dark:border-[#2A2B45]">
                  <input
                    type="radio"
                    checked={!useExistingResume}
                    onChange={() => setUseExistingResume(false)}
                    className="w-4 h-4 text-primary focus:ring-primary"
                  />
                  <div className="flex-1">
                    <p className="text-sm font-medium dark:text-[#F1F1F5]">Upload new resume</p>
                  </div>
                </label>
                {!useExistingResume && (
                  <div className="mt-3">
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={(e) => setNewResumeFile(e.target.files[0])}
                      className="w-full text-sm text-muted-color file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 file:cursor-pointer"
                    />
                  </div>
                )}
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={applying}
                className="w-full py-3 bg-primary text-white rounded-xl font-semibold text-sm hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {applying ? (
                  <>
                    <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Submitting...
                  </>
                ) : (
                  'Submit Application'
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobDetail;

