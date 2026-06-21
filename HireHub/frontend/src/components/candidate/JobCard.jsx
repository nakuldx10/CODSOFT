import { Link } from 'react-router-dom';
import { useState } from 'react';
import axios from '../../api/axios';
import toast from 'react-hot-toast';
import { timeAgo } from '../../utils/timeAgo';
import { formatSalary } from '../../utils/formatSalary';

const JobCard = ({ job, isSaved = false, onSaveToggle }) => {
  const [saved, setSaved] = useState(isSaved);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async (e) => {
    e.preventDefault();
    if (isSaving) return;
    
    setIsSaving(true);
    try {
      const { data } = await axios.post(`/api/applications/save/${job._id}`);
      setSaved(data.saved);
      if (onSaveToggle) onSaveToggle(job._id, data.saved);
      toast.success(data.saved ? 'Job saved' : 'Job removed from saved');
    } catch (error) {
      toast.error('Failed to save job');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Link to={`/candidate/jobs/${job._id}`} className="block">
      <div className="bg-card-bg dark:bg-[#14152E] p-5 sm:p-6 rounded-xl border border-border-color dark:border-[#2A2B45] hover:border-primary dark:hover:border-primary hover:-translate-y-1 transition-all duration-300 group h-full flex flex-col relative">
        
        {/* Save Button */}
        <button 
          onClick={handleSave}
          disabled={isSaving}
          className={`absolute top-5 right-5 p-2 rounded-full transition-colors z-10 ${
            saved 
              ? 'bg-primary/10 text-primary' 
              : 'text-text-muted hover:bg-surface-bg dark:hover:bg-[#1C1D3A]'
          }`}
        >
          <svg className="w-5 h-5" fill={saved ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
          </svg>
        </button>

        <div className="flex gap-4 mb-4 pr-10">
          <div className="w-12 h-12 bg-primary/10 text-primary rounded-lg flex items-center justify-center font-bold text-lg flex-shrink-0 overflow-hidden">
            {job.postedBy?.companyLogo ? (
              <img src={`/uploads/${job.postedBy.companyLogo}`} alt="Logo" className="w-full h-full object-cover" />
            ) : (
              (job.companyName || 'C').charAt(0).toUpperCase()
            )}
          </div>
          <div>
            <h3 className="text-lg font-bold group-hover:text-primary transition-colors line-clamp-1">{job.title}</h3>
            <p className="text-sm text-text-muted dark:text-[#8B8FA8] line-clamp-1">{job.companyName}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          <span className="px-2.5 py-1 text-xs font-medium bg-surface-bg dark:bg-[#1C1D3A] rounded-md text-text-muted dark:text-[#8B8FA8] flex items-center gap-1">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
            {job.location}
          </span>
          <span className="px-2.5 py-1 text-xs font-medium bg-blue-500/10 text-blue-500 rounded-md">
            {job.jobType}
          </span>
          {job.remote && (
            <span className="px-2.5 py-1 text-xs font-medium bg-purple-500/10 text-purple-500 rounded-md">
              Remote
            </span>
          )}
        </div>

        <div className="mt-auto pt-4 border-t border-border-color dark:border-[#2A2B45] flex justify-between items-end">
          <div>
            <span className="block text-xs text-text-muted dark:text-[#8B8FA8] mb-0.5">Salary</span>
            <span className="font-semibold text-sm text-green-500 dark:text-green-400">
              {formatSalary(job.salaryMin, job.salaryMax)}
            </span>
          </div>
          <span className="text-xs text-text-muted dark:text-[#8B8FA8]">
            {timeAgo(job.createdAt)}
          </span>
        </div>
      </div>
    </Link>
  );
};

export default JobCard;

