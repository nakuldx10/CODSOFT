import { useState, useEffect } from 'react';

const JobFilters = ({ filters, setFilters, onApply, onReset }) => {
  const [localFilters, setLocalFilters] = useState(filters);

  // Sync when parent resets
  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  const handleChange = (key, value) => {
    setLocalFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleApply = () => {
    setFilters(localFilters);
    onApply();
  };

  const jobTypes = ['Full-time', 'Part-time', 'Contract', 'Internship', 'Freelance'];
  const expLevels = ['Entry', 'Mid', 'Senior', 'Lead', 'Executive'];

  return (
    <div className="bg-card-bg dark:bg-[#14152E] p-6 rounded-xl border border-border-color dark:border-[#2A2B45]">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-bold text-lg">Filters</h3>
        <button 
          onClick={() => {
            onReset();
          }}
          className="text-xs font-semibold text-primary hover:text-primary-dark transition-colors"
        >
          Reset All
        </button>
      </div>

      <div className="space-y-6">
        {/* Remote Toggle */}
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold">Remote Only</span>
          <label className="relative inline-flex items-center cursor-pointer">
            <input 
              type="checkbox" 
              className="sr-only peer"
              checked={localFilters.remote}
              onChange={(e) => handleChange('remote', e.target.checked)}
            />
            <div className="w-11 h-6 bg-surface-bg dark:bg-[#1C1D3A] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary border border-border-color dark:border-[#2A2B45]"></div>
          </label>
        </div>

        {/* Job Type */}
        <div>
          <h4 className="text-sm font-semibold mb-3">Job Type</h4>
          <div className="space-y-2">
            {jobTypes.map(type => (
              <label key={type} className="flex items-center gap-2 cursor-pointer group">
                <input 
                  type="radio" 
                  name="jobType"
                  value={type}
                  checked={localFilters.jobType === type}
                  onChange={(e) => handleChange('jobType', e.target.value)}
                  className="w-4 h-4 text-primary bg-surface-bg dark:bg-[#1C1D3A] border-border-color dark:border-[#2A2B45] focus:ring-primary focus:ring-1"
                />
                <span className="text-sm text-text-muted dark:text-[#8B8FA8] group-hover:text-text-primary dark:group-hover:text-white transition-colors">
                  {type}
                </span>
              </label>
            ))}
            <label className="flex items-center gap-2 cursor-pointer group">
              <input 
                type="radio" 
                name="jobType"
                value=""
                checked={!localFilters.jobType}
                onChange={() => handleChange('jobType', '')}
                className="w-4 h-4 text-primary bg-surface-bg dark:bg-[#1C1D3A] border-border-color dark:border-[#2A2B45] focus:ring-primary focus:ring-1"
              />
              <span className="text-sm text-text-muted dark:text-[#8B8FA8] group-hover:text-text-primary dark:group-hover:text-white transition-colors">
                Any Type
              </span>
            </label>
          </div>
        </div>

        {/* Experience Level */}
        <div>
          <h4 className="text-sm font-semibold mb-3">Experience Level</h4>
          <div className="space-y-2">
            {expLevels.map(level => (
              <label key={level} className="flex items-center gap-2 cursor-pointer group">
                <input 
                  type="radio" 
                  name="experienceLevel"
                  value={level}
                  checked={localFilters.experienceLevel === level}
                  onChange={(e) => handleChange('experienceLevel', e.target.value)}
                  className="w-4 h-4 text-primary bg-surface-bg dark:bg-[#1C1D3A] border-border-color dark:border-[#2A2B45] focus:ring-primary focus:ring-1"
                />
                <span className="text-sm text-text-muted dark:text-[#8B8FA8] group-hover:text-text-primary dark:group-hover:text-white transition-colors">
                  {level}
                </span>
              </label>
            ))}
            <label className="flex items-center gap-2 cursor-pointer group">
              <input 
                type="radio" 
                name="experienceLevel"
                value=""
                checked={!localFilters.experienceLevel}
                onChange={() => handleChange('experienceLevel', '')}
                className="w-4 h-4 text-primary bg-surface-bg dark:bg-[#1C1D3A] border-border-color dark:border-[#2A2B45] focus:ring-primary focus:ring-1"
              />
              <span className="text-sm text-text-muted dark:text-[#8B8FA8] group-hover:text-text-primary dark:group-hover:text-white transition-colors">
                Any Level
              </span>
            </label>
          </div>
        </div>

        {/* Salary Range */}
        <div>
          <div className="flex justify-between items-center mb-3">
            <h4 className="text-sm font-semibold">Min Salary (LPA)</h4>
            <span className="text-xs font-bold text-primary">₹{localFilters.salaryMin || 0}L+</span>
          </div>
          <input 
            type="range" 
            min="0" 
            max="50" 
            step="1"
            value={localFilters.salaryMin || 0}
            onChange={(e) => handleChange('salaryMin', e.target.value)}
            className="w-full h-2 bg-surface-bg dark:bg-[#1C1D3A] rounded-lg appearance-none cursor-pointer accent-primary"
          />
          <div className="flex justify-between text-xs text-text-muted dark:text-[#8B8FA8] mt-2">
            <span>₹0L</span>
            <span>₹50L+</span>
          </div>
        </div>

        <button 
          onClick={handleApply}
          className="w-full btn-primary py-2.5 mt-4"
        >
          Apply Filters
        </button>
      </div>
    </div>
  );
};

export default JobFilters;
