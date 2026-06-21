import { useState } from 'react';
import { timeAgo } from '../../utils/timeAgo';

const statusConfig = {
  'Pending': { color: 'bg-gray-500/10 text-gray-500 border-gray-500/20', dot: 'bg-gray-500' },
  'Under Review': { color: 'bg-blue-500/10 text-blue-500 border-blue-500/20', dot: 'bg-blue-500' },
  'Interview Scheduled': { color: 'bg-amber-500/10 text-amber-500 border-amber-500/20', dot: 'bg-amber-500' },
  'Selected': { color: 'bg-green-500/10 text-green-500 border-green-500/20', dot: 'bg-green-500' },
  'Rejected': { color: 'bg-red-500/10 text-red-500 border-red-500/20', dot: 'bg-red-500' },
};

const statusOptions = ['Pending', 'Under Review', 'Interview Scheduled', 'Selected', 'Rejected'];

const ApplicantCard = ({ application, onStatusUpdate }) => {
  const [showCoverLetter, setShowCoverLetter] = useState(false);
  const [note, setNote] = useState(application.employerNote || '');

  const candidate = application.candidate || {};
  const config = statusConfig[application.status] || statusConfig['Pending'];

  const initials = (candidate.name || 'U')
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const skills = candidate.skills || [];
  const visibleSkills = skills.slice(0, 3);
  const extraCount = skills.length - 3;

  return (
    <div className="bg-card-bg dark:bg-[#14152E] rounded-xl border border-border-color dark:border-[#2A2B45] p-5 sm:p-6 transition-colors hover:border-primary/40">
      {/* Header: Avatar + Info + Status */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mb-4">
        <div className="flex gap-3 items-center min-w-0">
          <div className="w-11 h-11 rounded-full flex-shrink-0 flex items-center justify-center font-bold text-sm overflow-hidden bg-primary/10 text-primary">
            {candidate.avatar ? (
              <img
                src={`/uploads/${candidate.avatar}`}
                alt={candidate.name}
                className="w-full h-full object-cover"
              />
            ) : (
              initials
            )}
          </div>
          <div className="min-w-0">
            <h3 className="font-bold text-sm sm:text-base truncate">{candidate.name || 'Unknown Candidate'}</h3>
            {candidate.headline && (
              <p className="text-xs text-text-muted dark:text-[#8B8FA8] truncate">{candidate.headline}</p>
            )}
            <p className="text-xs text-text-muted dark:text-[#8B8FA8] mt-0.5">
              Applied {timeAgo(application.appliedAt)}
            </p>
          </div>
        </div>
        <div className="flex-shrink-0">
          <span className={`px-3 py-1 rounded-full border text-xs font-semibold inline-flex items-center gap-1.5 ${config.color}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`}></span>
            {application.status}
          </span>
        </div>
      </div>

      {/* Skills */}
      {skills.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-4">
          {visibleSkills.map((skill, i) => (
            <span
              key={i}
              className="px-2.5 py-1 bg-surface-bg dark:bg-[#1C1D3A] text-xs font-medium rounded-md text-text-muted dark:text-[#8B8FA8]"
            >
              {skill}
            </span>
          ))}
          {extraCount > 0 && (
            <span className="px-2.5 py-1 bg-primary/10 text-primary text-xs font-medium rounded-md">
              +{extraCount} more
            </span>
          )}
        </div>
      )}

      {/* Actions Row */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between mb-4 pt-3 border-t border-border-color dark:border-[#2A2B45]">
        {/* Status Dropdown */}
        <div className="flex items-center gap-2">
          <label className="text-xs font-medium text-text-muted dark:text-[#8B8FA8]">Status:</label>
          <select
            value={application.status}
            onChange={(e) => onStatusUpdate(application._id, e.target.value)}
            className="text-xs font-medium px-3 py-1.5 rounded-lg border border-border-color dark:border-[#2A2B45] bg-surface-bg dark:bg-[#1C1D3A] text-primary-color dark:text-[#F1F1F5] focus:outline-none focus:ring-2 focus:ring-primary/50 cursor-pointer"
          >
            {statusOptions.map((opt) => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        </div>

        {/* Resume Download */}
        {application.resume && (
          <a
            href={`/uploads/${application.resume}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:text-primary-dark transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Download Resume
          </a>
        )}
      </div>

      {/* Cover Letter Collapsible */}
      {application.coverLetter && (
        <div className="mb-4">
          <button
            onClick={() => setShowCoverLetter(!showCoverLetter)}
            className="flex items-center gap-1.5 text-xs font-semibold text-text-muted dark:text-[#8B8FA8] hover:text-primary transition-colors"
          >
            <svg
              className={`w-3.5 h-3.5 transition-transform ${showCoverLetter ? 'rotate-90' : ''}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            {showCoverLetter ? 'Hide Cover Letter' : 'View Cover Letter'}
          </button>
          {showCoverLetter && (
            <div className="mt-2 p-3 bg-surface-bg dark:bg-[#1C1D3A] rounded-lg text-sm text-text-muted dark:text-[#8B8FA8] leading-relaxed whitespace-pre-wrap">
              {application.coverLetter}
            </div>
          )}
        </div>
      )}

      {/* Employer Note */}
      <div>
        <label className="text-xs font-medium text-text-muted dark:text-[#8B8FA8] block mb-1.5">
          Your Note
        </label>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          rows={2}
          placeholder="Add a private note about this candidate..."
          className="w-full text-sm px-3 py-2 rounded-lg border border-border-color dark:border-[#2A2B45] bg-surface-bg dark:bg-[#1C1D3A] text-primary-color dark:text-[#F1F1F5] placeholder-text-muted dark:placeholder-[#8B8FA8] focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
        />
      </div>
    </div>
  );
};

export default ApplicantCard;

