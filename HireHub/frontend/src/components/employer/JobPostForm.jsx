import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import useAuth from '../../hooks/useAuth';

const jobTypes = ['Full-time', 'Part-time', 'Contract', 'Internship', 'Freelance'];
const experienceLevels = ['Entry', 'Mid', 'Senior', 'Lead', 'Executive'];

const JobPostForm = ({ initialData, onSubmit, isSubmitting }) => {
  const { user } = useAuth();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: initialData?.title || '',
      description: initialData?.description || '',
      jobType: initialData?.jobType || 'Full-time',
      experienceLevel: initialData?.experienceLevel || 'Entry',
      location: initialData?.location || '',
      remote: initialData?.remote || false,
      salaryMin: initialData?.salaryMin || '',
      salaryMax: initialData?.salaryMax || '',
      deadline: initialData?.deadline ? new Date(initialData.deadline).toISOString().split('T')[0] : '',
      companyName: initialData?.companyName || user?.companyName || '',
    },
  });

  const description = watch('description', '');
  const salaryMin = watch('salaryMin');
  const salaryMax = watch('salaryMax');

  // Skills tag input
  const [skills, setSkills] = useState(initialData?.skills || []);
  const [skillInput, setSkillInput] = useState('');
  const [skillError, setSkillError] = useState('');

  // Dynamic lists
  const [responsibilities, setResponsibilities] = useState(
    initialData?.responsibilities?.length ? initialData.responsibilities : ['']
  );
  const [requirements, setRequirements] = useState(
    initialData?.requirements?.length ? initialData.requirements : ['']
  );

  const handleAddSkill = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const value = skillInput.trim();
      if (value && !skills.includes(value)) {
        setSkills([...skills, value]);
        setSkillInput('');
        setSkillError('');
      }
    }
  };

  const removeSkill = (index) => {
    setSkills(skills.filter((_, i) => i !== index));
  };

  // Dynamic list helpers
  const addListItem = (setter, list) => {
    setter([...list, '']);
  };

  const removeListItem = (setter, list, index) => {
    if (list.length <= 1) return;
    setter(list.filter((_, i) => i !== index));
  };

  const updateListItem = (setter, list, index, value) => {
    const updated = [...list];
    updated[index] = value;
    setter(updated);
  };

  const handleFormSubmit = (data) => {
    // Validate skills
    if (skills.length === 0) {
      setSkillError('At least 1 skill is required');
      return;
    }

    const payload = {
      ...data,
      salaryMin: data.salaryMin ? Number(data.salaryMin) : undefined,
      salaryMax: data.salaryMax ? Number(data.salaryMax) : undefined,
      skills,
      responsibilities: responsibilities.filter((r) => r.trim()),
      requirements: requirements.filter((r) => r.trim()),
    };
    onSubmit(payload);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-8">
      {/* Section 1: Job Basics */}
      <div className="bg-card-bg dark:bg-[#14152E] rounded-xl border border-border-color dark:border-[#2A2B45] p-5 sm:p-6">
        <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
          <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
          Job Basics
        </h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1.5">
              Job Title <span className="text-red-500">*</span>
            </label>
            <input
              {...register('title', { required: 'Job title is required' })}
              placeholder="e.g. Senior Frontend Developer"
              className="w-full px-4 py-2.5 rounded-lg border border-border-color dark:border-[#2A2B45] bg-surface-bg dark:bg-[#1C1D3A] text-primary-color dark:text-[#F1F1F5] placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
            />
            {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5">
              Job Description <span className="text-red-500">*</span>
            </label>
            <textarea
              {...register('description', {
                required: 'Description is required',
                minLength: { value: 100, message: 'Description must be at least 100 characters' },
              })}
              rows={8}
              placeholder="Describe the role, team, and what makes this opportunity exciting..."
              className="w-full px-4 py-2.5 rounded-lg border border-border-color dark:border-[#2A2B45] bg-surface-bg dark:bg-[#1C1D3A] text-primary-color dark:text-[#F1F1F5] placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm resize-none"
            />
            <div className="flex justify-between items-center mt-1">
              {errors.description && (
                <p className="text-red-500 text-xs">{errors.description.message}</p>
              )}
              <p className={`text-xs ml-auto ${description.length < 100 ? 'text-amber-500' : 'text-text-muted dark:text-[#8B8FA8]'}`}>
                {description.length} / 100 min characters
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Section 2: Details */}
      <div className="bg-card-bg dark:bg-[#14152E] rounded-xl border border-border-color dark:border-[#2A2B45] p-5 sm:p-6">
        <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
          <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          Details
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1.5">
              Job Type <span className="text-red-500">*</span>
            </label>
            <select
              {...register('jobType', { required: 'Job type is required' })}
              className="w-full px-4 py-2.5 rounded-lg border border-border-color dark:border-[#2A2B45] bg-surface-bg dark:bg-[#1C1D3A] text-primary-color dark:text-[#F1F1F5] focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
            >
              {jobTypes.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5">
              Experience Level <span className="text-red-500">*</span>
            </label>
            <select
              {...register('experienceLevel', { required: 'Experience level is required' })}
              className="w-full px-4 py-2.5 rounded-lg border border-border-color dark:border-[#2A2B45] bg-surface-bg dark:bg-[#1C1D3A] text-primary-color dark:text-[#F1F1F5] focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
            >
              {experienceLevels.map((l) => (
                <option key={l} value={l}>{l}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5">
              Location <span className="text-red-500">*</span>
            </label>
            <input
              {...register('location', { required: 'Location is required' })}
              placeholder="e.g. Bangalore, India"
              className="w-full px-4 py-2.5 rounded-lg border border-border-color dark:border-[#2A2B45] bg-surface-bg dark:bg-[#1C1D3A] text-primary-color dark:text-[#F1F1F5] placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
            />
            {errors.location && <p className="text-red-500 text-xs mt-1">{errors.location.message}</p>}
          </div>

          <div className="flex items-center gap-3 pt-6">
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                {...register('remote')}
                className="sr-only peer"
              />
              <div className="w-10 h-5 bg-gray-300 dark:bg-[#2A2B45] rounded-full peer peer-checked:bg-primary transition-colors after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-5"></div>
            </label>
            <span className="text-sm font-medium">Remote friendly</span>
          </div>
        </div>
      </div>

      {/* Section 3: Compensation */}
      <div className="bg-card-bg dark:bg-[#14152E] rounded-xl border border-border-color dark:border-[#2A2B45] p-5 sm:p-6">
        <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
          <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Compensation
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1.5">Salary Min (LPA)</label>
            <input
              type="number"
              {...register('salaryMin', { min: { value: 0, message: 'Cannot be negative' } })}
              placeholder="e.g. 6"
              className="w-full px-4 py-2.5 rounded-lg border border-border-color dark:border-[#2A2B45] bg-surface-bg dark:bg-[#1C1D3A] text-primary-color dark:text-[#F1F1F5] placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
            />
            {errors.salaryMin && <p className="text-red-500 text-xs mt-1">{errors.salaryMin.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">Salary Max (LPA)</label>
            <input
              type="number"
              {...register('salaryMax', { min: { value: 0, message: 'Cannot be negative' } })}
              placeholder="e.g. 12"
              className="w-full px-4 py-2.5 rounded-lg border border-border-color dark:border-[#2A2B45] bg-surface-bg dark:bg-[#1C1D3A] text-primary-color dark:text-[#F1F1F5] placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
            />
            {errors.salaryMax && <p className="text-red-500 text-xs mt-1">{errors.salaryMax.message}</p>}
          </div>
        </div>
        {(salaryMin || salaryMax) && (
          <div className="mt-3 px-3 py-2 bg-primary/5 rounded-lg">
            <p className="text-sm font-medium text-primary">
              Preview: ₹{salaryMin || '?'} - {salaryMax || '?'} LPA
            </p>
          </div>
        )}
      </div>

      {/* Section 4: Skills Required */}
      <div className="bg-card-bg dark:bg-[#14152E] rounded-xl border border-border-color dark:border-[#2A2B45] p-5 sm:p-6">
        <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
          <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
          </svg>
          Skills Required
        </h2>

        <div className="flex flex-wrap gap-2 mb-3">
          {skills.map((skill, i) => (
            <span
              key={i}
              className="inline-flex items-center gap-1 px-3 py-1.5 bg-primary/10 text-primary text-xs font-medium rounded-full"
            >
              {skill}
              <button
                type="button"
                onClick={() => removeSkill(i)}
                className="hover:text-red-500 transition-colors"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </span>
          ))}
        </div>

        <input
          value={skillInput}
          onChange={(e) => setSkillInput(e.target.value)}
          onKeyDown={handleAddSkill}
          placeholder="Type a skill and press Enter..."
          className="w-full px-4 py-2.5 rounded-lg border border-border-color dark:border-[#2A2B45] bg-surface-bg dark:bg-[#1C1D3A] text-primary-color dark:text-[#F1F1F5] placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
        />
        {skillError && <p className="text-red-500 text-xs mt-1">{skillError}</p>}
        <p className="text-xs text-text-muted dark:text-[#8B8FA8] mt-1">
          {skills.length} skill{skills.length !== 1 ? 's' : ''} added
        </p>
      </div>

      {/* Section 5: Responsibilities & Requirements */}
      <div className="bg-card-bg dark:bg-[#14152E] rounded-xl border border-border-color dark:border-[#2A2B45] p-5 sm:p-6">
        <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
          <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
          </svg>
          Responsibilities & Requirements
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Responsibilities */}
          <div>
            <label className="block text-sm font-medium mb-2">Responsibilities</label>
            <div className="space-y-2">
              {responsibilities.map((item, i) => (
                <div key={i} className="flex gap-2">
                  <input
                    value={item}
                    onChange={(e) => updateListItem(setResponsibilities, responsibilities, i, e.target.value)}
                    placeholder={`Responsibility ${i + 1}`}
                    className="flex-1 px-3 py-2 rounded-lg border border-border-color dark:border-[#2A2B45] bg-surface-bg dark:bg-[#1C1D3A] text-primary-color dark:text-[#F1F1F5] placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
                  />
                  {responsibilities.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeListItem(setResponsibilities, responsibilities, i)}
                      className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  )}
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={() => addListItem(setResponsibilities, responsibilities)}
              className="mt-2 text-xs font-semibold text-primary hover:text-primary-dark transition-colors inline-flex items-center gap-1"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Responsibility
            </button>
          </div>

          {/* Requirements */}
          <div>
            <label className="block text-sm font-medium mb-2">Requirements</label>
            <div className="space-y-2">
              {requirements.map((item, i) => (
                <div key={i} className="flex gap-2">
                  <input
                    value={item}
                    onChange={(e) => updateListItem(setRequirements, requirements, i, e.target.value)}
                    placeholder={`Requirement ${i + 1}`}
                    className="flex-1 px-3 py-2 rounded-lg border border-border-color dark:border-[#2A2B45] bg-surface-bg dark:bg-[#1C1D3A] text-primary-color dark:text-[#F1F1F5] placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
                  />
                  {requirements.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeListItem(setRequirements, requirements, i)}
                      className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  )}
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={() => addListItem(setRequirements, requirements)}
              className="mt-2 text-xs font-semibold text-primary hover:text-primary-dark transition-colors inline-flex items-center gap-1"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Requirement
            </button>
          </div>
        </div>
      </div>

      {/* Section 6: Application Settings */}
      <div className="bg-card-bg dark:bg-[#14152E] rounded-xl border border-border-color dark:border-[#2A2B45] p-5 sm:p-6">
        <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
          <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          </svg>
          Application Settings
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1.5">Application Deadline</label>
            <input
              type="date"
              {...register('deadline', {
                validate: (value) => {
                  if (!value) return true;
                  return new Date(value) > new Date() || 'Deadline must be in the future';
                },
              })}
              className="w-full px-4 py-2.5 rounded-lg border border-border-color dark:border-[#2A2B45] bg-surface-bg dark:bg-[#1C1D3A] text-primary-color dark:text-[#F1F1F5] focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
            />
            {errors.deadline && <p className="text-red-500 text-xs mt-1">{errors.deadline.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5">Company Name</label>
            <input
              {...register('companyName')}
              placeholder="Your company name"
              className="w-full px-4 py-2.5 rounded-lg border border-border-color dark:border-[#2A2B45] bg-surface-bg dark:bg-[#1C1D3A] text-primary-color dark:text-[#F1F1F5] placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
            />
          </div>
        </div>
      </div>

      {/* Submit */}
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isSubmitting}
          className="btn-primary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <>
              <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              {initialData ? 'Updating...' : 'Posting...'}
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              {initialData ? 'Update Job' : 'Post Job'}
            </>
          )}
        </button>
      </div>
    </form>
  );
};

export default JobPostForm;
