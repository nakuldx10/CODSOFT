import { Link } from 'react-router-dom';
import { timeAgo } from '../../utils/timeAgo';

const ApplicationCard = ({ application }) => {
  const { job, status, appliedAt } = application;
  
  const statusConfig = {
    'Pending': { color: 'bg-gray-500/10 text-gray-500 border-gray-500/20', icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' },
    'Under Review': { color: 'bg-blue-500/10 text-blue-500 border-blue-500/20', icon: 'M15 12a3 3 0 11-6 0 3 3 0 016 0z' },
    'Interview Scheduled': { color: 'bg-amber-500/10 text-amber-500 border-amber-500/20', icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' },
    'Selected': { color: 'bg-green-500/10 text-green-500 border-green-500/20', icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' },
    'Rejected': { color: 'bg-red-500/10 text-red-500 border-red-500/20', icon: 'M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z' }
  };

  const config = statusConfig[status] || statusConfig['Pending'];

  // Timeline steps to visually indicate progression
  const timelineSteps = ['Pending', 'Under Review', 'Interview Scheduled'];
  const currentIndex = timelineSteps.indexOf(status);
  
  // If status is Selected/Rejected, we show them as final states
  const isFinalState = status === 'Selected' || status === 'Rejected';

  return (
    <div className="bg-card-bg dark:bg-[#14152E] p-5 sm:p-6 rounded-xl border border-border-color dark:border-[#2A2B45] hover:border-primary/50 transition-colors">
      <div className="flex flex-col sm:flex-row gap-5 items-start sm:items-center justify-between mb-6">
        <div className="flex gap-4 items-center w-full sm:w-auto">
          <div className="w-12 h-12 bg-primary/10 text-primary rounded-lg flex items-center justify-center font-bold text-lg flex-shrink-0 overflow-hidden">
            {job.postedBy?.companyLogo ? (
              <img src={`/uploads/${job.postedBy.companyLogo}`} alt="Logo" className="w-full h-full object-cover" />
            ) : (
              (job.companyName || 'C').charAt(0).toUpperCase()
            )}
          </div>
          <div>
            <h3 className="text-lg font-bold line-clamp-1">{job.title}</h3>
            <div className="flex flex-wrap items-center gap-x-2 text-sm text-text-muted dark:text-[#8B8FA8]">
              <span>{job.companyName}</span>
              <span>•</span>
              <span>{job.location}</span>
            </div>
          </div>
        </div>
        <div className="flex-shrink-0 flex items-center justify-between w-full sm:w-auto">
          <span className="text-xs text-text-muted dark:text-[#8B8FA8] sm:hidden">Applied {timeAgo(appliedAt)}</span>
          <span className={`px-3 py-1.5 rounded-full border text-xs font-semibold flex items-center gap-1.5 ${config.color}`}>
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={config.icon} />
            </svg>
            {status}
          </span>
        </div>
      </div>

      {/* Status Timeline */}
      <div className="relative pt-2 pb-4 mb-4 border-b border-border-color dark:border-[#2A2B45]">
        <div className="absolute top-4 left-0 w-full h-0.5 bg-border-color dark:bg-[#2A2B45] -z-10"></div>
        
        {isFinalState ? (
          <div className="flex justify-between relative z-0">
            <div className="flex flex-col items-center">
              <div className="w-4 h-4 rounded-full bg-primary mb-2"></div>
              <span className="text-[10px] text-text-muted dark:text-[#8B8FA8] font-medium">Applied</span>
            </div>
            <div className="absolute top-2 left-0 w-full h-0.5 bg-primary -z-10"></div>
            <div className="flex flex-col items-center">
              <div className={`w-4 h-4 rounded-full mb-2 ${status === 'Selected' ? 'bg-green-500' : 'bg-red-500'}`}></div>
              <span className={`text-[10px] font-medium ${status === 'Selected' ? 'text-green-500' : 'text-red-500'}`}>{status}</span>
            </div>
          </div>
        ) : (
          <div className="flex justify-between relative z-0">
            {timelineSteps.map((step, idx) => {
              const isActive = idx <= currentIndex;
              return (
                <div key={step} className="flex flex-col items-center">
                  <div className={`w-4 h-4 rounded-full mb-2 transition-colors duration-500 ${isActive ? 'bg-primary' : 'bg-surface-bg dark:bg-[#1C1D3A] border border-border-color dark:border-[#2A2B45]'}`}></div>
                  <span className={`text-[10px] font-medium ${isActive ? 'text-primary' : 'text-text-muted dark:text-[#8B8FA8]'}`}>{step}</span>
                </div>
              );
            })}
            <div className="absolute top-2 left-0 h-0.5 bg-primary -z-10 transition-all duration-500" style={{ width: `${(currentIndex / (timelineSteps.length - 1)) * 100}%` }}></div>
          </div>
        )}
      </div>

      <div className="flex justify-between items-center text-sm">
        <span className="hidden sm:inline text-text-muted dark:text-[#8B8FA8]">Applied {timeAgo(appliedAt)}</span>
        <span className="sm:hidden"></span>
        <Link to={`/candidate/jobs/${job._id}`} className="font-semibold text-primary hover:text-primary-dark transition-colors">
          View Job Details &rarr;
        </Link>
      </div>
    </div>
  );
};

export default ApplicationCard;

