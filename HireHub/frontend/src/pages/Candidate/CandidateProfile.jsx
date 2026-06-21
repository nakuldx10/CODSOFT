import { usePageTitle } from '../../hooks/usePageTitle';
import { useState, useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import axios from '../../api/axios';
import useAuth from '../../hooks/useAuth';
import toast from 'react-hot-toast';

const CandidateProfile = () => {
  usePageTitle('Candidate Profile');
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);
  const [uploadingResume, setUploadingResume] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [profileData, setProfileData] = useState(null);
  const [skillInput, setSkillInput] = useState('');

  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    setValue,
    formState: { isDirty },
  } = useForm({
    defaultValues: {
      name: '',
      phone: '',
      headline: '',
      bio: '',
      skills: [],
      experience: [],
      education: [],
      socialLinks: {
        linkedin: '',
        github: '',
        portfolio: '',
      },
    },
  });

  const {
    fields: experienceFields,
    append: appendExperience,
    remove: removeExperience,
  } = useFieldArray({ control, name: 'experience' });

  const {
    fields: educationFields,
    append: appendEducation,
    remove: removeEducation,
  } = useFieldArray({ control, name: 'education' });

  const skills = watch('skills') || [];

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        setError(null);
        const { data } = await axios.get('/api/auth/me');
        const u = data.user || data;
        setProfileData(u);
        reset({
          name: u.name || '',
          phone: u.phone || '',
          headline: u.headline || '',
          bio: u.bio || '',
          skills: u.skills || [],
          experience: u.experience || [],
          education: u.education || [],
          socialLinks: {
            linkedin: u.socialLinks?.linkedin || '',
            github: u.socialLinks?.github || '',
            portfolio: u.socialLinks?.portfolio || '',
          },
        });
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load profile');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [reset]);

  const calculateCompletion = () => {
    if (!profileData) return 0;
    const d = profileData;
    const fields = [
      !!d.name,
      !!d.phone,
      !!d.headline,
      !!d.bio,
      d.skills?.length > 0,
      d.education?.length > 0,
      d.experience?.length > 0,
      !!d.resume,
      !!d.avatar,
    ];
    return Math.round((fields.filter(Boolean).length / fields.length) * 100);
  };

  const onSubmit = async (formData) => {
    try {
      setSaving(true);
      const { data } = await axios.put('/api/auth/profile', formData);
      const updated = data.user || data;
      setProfileData(updated);
      reset(formData);
      toast.success('Profile updated successfully!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      setUploadingAvatar(true);
      const fd = new FormData();
      fd.append('avatar', file);
      const { data } = await axios.put('/api/auth/profile', fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      const updated = data.user || data;
      setProfileData(updated);
      toast.success('Avatar updated!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to upload avatar');
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleResumeUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      setUploadingResume(true);
      const fd = new FormData();
      fd.append('resume', file);
      const { data } = await axios.put('/api/auth/resume', fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      const updated = data.user || data;
      setProfileData(updated);
      toast.success('Resume uploaded!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to upload resume');
    } finally {
      setUploadingResume(false);
    }
  };

  const addSkill = () => {
    const trimmed = skillInput.trim();
    if (trimmed && !skills.includes(trimmed)) {
      setValue('skills', [...skills, trimmed], { shouldDirty: true });
      setSkillInput('');
    }
  };

  const removeSkill = (skillToRemove) => {
    setValue(
      'skills',
      skills.filter((s) => s !== skillToRemove),
      { shouldDirty: true }
    );
  };

  const handleSkillKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addSkill();
    }
  };

  const completion = calculateCompletion();

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

  if (loading) {
    return (
      <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto space-y-6">
        {/* Profile Completion Skeleton */}
        <div className="bg-card-bg dark:bg-[#14152E] p-6 rounded-xl border border-border-color dark:border-[#2A2B45] animate-pulse">
          <div className="h-4 bg-surface-bg dark:bg-[#1C1D3A] rounded w-40 mb-3" />
          <div className="h-3 bg-surface-bg dark:bg-[#1C1D3A] rounded-full" />
        </div>
        {/* Sections Skeleton */}
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-card-bg dark:bg-[#14152E] p-6 rounded-xl border border-border-color dark:border-[#2A2B45] animate-pulse">
            <div className="h-5 bg-surface-bg dark:bg-[#1C1D3A] rounded w-32 mb-4" />
            <div className="space-y-3">
              <div className="h-10 bg-surface-bg dark:bg-[#1C1D3A] rounded" />
              <div className="h-10 bg-surface-bg dark:bg-[#1C1D3A] rounded" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 dark:text-[#F1F1F5]">My Profile</h1>

      {/* Profile Completion Bar */}
      <div className="bg-card-bg dark:bg-[#14152E] p-5 rounded-xl border border-border-color dark:border-[#2A2B45] mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-semibold dark:text-[#F1F1F5]">Profile Completion</span>
          <span className={`text-sm font-bold ${completion === 100 ? 'text-green-500' : 'text-primary'}`}>{completion}%</span>
        </div>
        <div className="w-full bg-surface-bg dark:bg-[#1C1D3A] rounded-full h-2.5">
          <div
            className={`h-2.5 rounded-full transition-all duration-500 ${completion === 100 ? 'bg-green-500' : 'bg-primary'}`}
            style={{ width: `${completion}%` }}
          />
        </div>
        {completion < 100 && (
          <p className="text-xs text-muted-color dark:text-[#8B8FA8] mt-2">
            Complete your profile to improve your chances of getting hired.
          </p>
        )}
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Section 1: Personal Info */}
        <div className="bg-card-bg dark:bg-[#14152E] p-6 rounded-xl border border-border-color dark:border-[#2A2B45]">
          <h2 className="text-lg font-bold mb-5 dark:text-[#F1F1F5]">Personal Information</h2>

          {/* Avatar */}
          <div className="flex items-center gap-4 mb-6">
            <div className="relative">
              <div className="w-20 h-20 rounded-full bg-primary/10 text-primary flex items-center justify-center text-2xl font-bold overflow-hidden">
                {profileData?.avatar ? (
                  <img src={`/uploads/${profileData.avatar}`} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  (profileData?.name || 'U').charAt(0).toUpperCase()
                )}
              </div>
              <label className="absolute -bottom-1 -right-1 w-7 h-7 bg-primary text-white rounded-full flex items-center justify-center cursor-pointer hover:bg-primary/90 transition-colors">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <input type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} disabled={uploadingAvatar} />
              </label>
            </div>
            <div>
              <p className="font-semibold dark:text-[#F1F1F5]">{profileData?.name}</p>
              <p className="text-sm text-muted-color dark:text-[#8B8FA8]">{profileData?.email}</p>
              {uploadingAvatar && <p className="text-xs text-primary mt-1">Uploading...</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-1.5 dark:text-[#F1F1F5]">Full Name</label>
              <input
                {...register('name')}
                className="w-full px-4 py-2.5 bg-surface-bg dark:bg-[#1C1D3A] border border-border-color dark:border-[#2A2B45] rounded-xl text-sm focus:outline-none focus:border-primary transition-colors dark:text-[#F1F1F5]"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1.5 dark:text-[#F1F1F5]">Email</label>
              <input
                value={profileData?.email || ''}
                readOnly
                className="w-full px-4 py-2.5 bg-surface-bg dark:bg-[#1C1D3A] border border-border-color dark:border-[#2A2B45] rounded-xl text-sm opacity-60 cursor-not-allowed dark:text-[#8B8FA8]"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1.5 dark:text-[#F1F1F5]">Phone</label>
              <input
                {...register('phone')}
                placeholder="+91 XXXXX XXXXX"
                className="w-full px-4 py-2.5 bg-surface-bg dark:bg-[#1C1D3A] border border-border-color dark:border-[#2A2B45] rounded-xl text-sm focus:outline-none focus:border-primary transition-colors dark:text-[#F1F1F5] placeholder:text-muted-color dark:placeholder:text-[#8B8FA8]"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1.5 dark:text-[#F1F1F5]">Headline</label>
              <input
                {...register('headline')}
                placeholder="e.g. Full Stack Developer"
                className="w-full px-4 py-2.5 bg-surface-bg dark:bg-[#1C1D3A] border border-border-color dark:border-[#2A2B45] rounded-xl text-sm focus:outline-none focus:border-primary transition-colors dark:text-[#F1F1F5] placeholder:text-muted-color dark:placeholder:text-[#8B8FA8]"
              />
            </div>
          </div>
          <div className="mt-4">
            <label className="block text-sm font-semibold mb-1.5 dark:text-[#F1F1F5]">Bio</label>
            <textarea
              {...register('bio')}
              rows={3}
              placeholder="Tell employers about yourself..."
              className="w-full px-4 py-2.5 bg-surface-bg dark:bg-[#1C1D3A] border border-border-color dark:border-[#2A2B45] rounded-xl text-sm focus:outline-none focus:border-primary transition-colors resize-none dark:text-[#F1F1F5] placeholder:text-muted-color dark:placeholder:text-[#8B8FA8]"
            />
          </div>
        </div>

        {/* Section 2: Skills */}
        <div className="bg-card-bg dark:bg-[#14152E] p-6 rounded-xl border border-border-color dark:border-[#2A2B45]">
          <h2 className="text-lg font-bold mb-5 dark:text-[#F1F1F5]">Skills</h2>
          <div className="flex gap-2 mb-3">
            <input
              type="text"
              value={skillInput}
              onChange={(e) => setSkillInput(e.target.value)}
              onKeyDown={handleSkillKeyDown}
              placeholder="Type a skill and press Enter"
              className="flex-1 px-4 py-2.5 bg-surface-bg dark:bg-[#1C1D3A] border border-border-color dark:border-[#2A2B45] rounded-xl text-sm focus:outline-none focus:border-primary transition-colors dark:text-[#F1F1F5] placeholder:text-muted-color dark:placeholder:text-[#8B8FA8]"
            />
            <button
              type="button"
              onClick={addSkill}
              className="px-4 py-2.5 bg-primary text-white rounded-xl text-sm font-semibold hover:bg-primary/90 transition-colors"
            >
              Add
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {skills.map((skill, i) => (
              <span key={i} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 text-primary rounded-lg text-sm font-medium">
                {skill}
                <button type="button" onClick={() => removeSkill(skill)} className="hover:text-red-500 transition-colors">
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </span>
            ))}
            {skills.length === 0 && (
              <p className="text-sm text-muted-color dark:text-[#8B8FA8]">No skills added yet.</p>
            )}
          </div>
        </div>

        {/* Section 3: Experience */}
        <div className="bg-card-bg dark:bg-[#14152E] p-6 rounded-xl border border-border-color dark:border-[#2A2B45]">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-bold dark:text-[#F1F1F5]">Experience</h2>
            <button
              type="button"
              onClick={() =>
                appendExperience({
                  company: '',
                  title: '',
                  startDate: '',
                  endDate: '',
                  description: '',
                  current: false,
                })
              }
              className="text-sm font-semibold text-primary hover:text-primary/80 transition-colors flex items-center gap-1"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add
            </button>
          </div>

          {experienceFields.length === 0 ? (
            <p className="text-sm text-muted-color dark:text-[#8B8FA8]">No experience added yet.</p>
          ) : (
            <div className="space-y-6">
              {experienceFields.map((field, index) => (
                <div key={field.id} className="p-4 bg-surface-bg dark:bg-[#1C1D3A] rounded-xl border border-border-color dark:border-[#2A2B45] relative">
                  <button
                    type="button"
                    onClick={() => removeExperience(index)}
                    className="absolute top-3 right-3 p-1.5 text-muted-color hover:text-red-500 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pr-8">
                    <div>
                      <label className="block text-xs font-semibold mb-1 dark:text-[#8B8FA8]">Company</label>
                      <input
                        {...register(`experience.${index}.company`)}
                        placeholder="Company name"
                        className="w-full px-3 py-2 bg-card-bg dark:bg-[#14152E] border border-border-color dark:border-[#2A2B45] rounded-lg text-sm focus:outline-none focus:border-primary transition-colors dark:text-[#F1F1F5] placeholder:text-muted-color dark:placeholder:text-[#8B8FA8]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold mb-1 dark:text-[#8B8FA8]">Title</label>
                      <input
                        {...register(`experience.${index}.title`)}
                        placeholder="Job title"
                        className="w-full px-3 py-2 bg-card-bg dark:bg-[#14152E] border border-border-color dark:border-[#2A2B45] rounded-lg text-sm focus:outline-none focus:border-primary transition-colors dark:text-[#F1F1F5] placeholder:text-muted-color dark:placeholder:text-[#8B8FA8]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold mb-1 dark:text-[#8B8FA8]">Start Date</label>
                      <input
                        type="date"
                        {...register(`experience.${index}.startDate`)}
                        className="w-full px-3 py-2 bg-card-bg dark:bg-[#14152E] border border-border-color dark:border-[#2A2B45] rounded-lg text-sm focus:outline-none focus:border-primary transition-colors dark:text-[#F1F1F5]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold mb-1 dark:text-[#8B8FA8]">End Date</label>
                      <input
                        type="date"
                        {...register(`experience.${index}.endDate`)}
                        className="w-full px-3 py-2 bg-card-bg dark:bg-[#14152E] border border-border-color dark:border-[#2A2B45] rounded-lg text-sm focus:outline-none focus:border-primary transition-colors dark:text-[#F1F1F5]"
                      />
                    </div>
                  </div>
                  <div className="mt-3">
                    <label className="block text-xs font-semibold mb-1 dark:text-[#8B8FA8]">Description</label>
                    <textarea
                      {...register(`experience.${index}.description`)}
                      rows={2}
                      placeholder="Describe your responsibilities..."
                      className="w-full px-3 py-2 bg-card-bg dark:bg-[#14152E] border border-border-color dark:border-[#2A2B45] rounded-lg text-sm focus:outline-none focus:border-primary transition-colors resize-none dark:text-[#F1F1F5] placeholder:text-muted-color dark:placeholder:text-[#8B8FA8]"
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Section 4: Education */}
        <div className="bg-card-bg dark:bg-[#14152E] p-6 rounded-xl border border-border-color dark:border-[#2A2B45]">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-bold dark:text-[#F1F1F5]">Education</h2>
            <button
              type="button"
              onClick={() =>
                appendEducation({
                  institution: '',
                  degree: '',
                  field: '',
                  startYear: '',
                  endYear: '',
                })
              }
              className="text-sm font-semibold text-primary hover:text-primary/80 transition-colors flex items-center gap-1"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add
            </button>
          </div>

          {educationFields.length === 0 ? (
            <p className="text-sm text-muted-color dark:text-[#8B8FA8]">No education added yet.</p>
          ) : (
            <div className="space-y-6">
              {educationFields.map((field, index) => (
                <div key={field.id} className="p-4 bg-surface-bg dark:bg-[#1C1D3A] rounded-xl border border-border-color dark:border-[#2A2B45] relative">
                  <button
                    type="button"
                    onClick={() => removeEducation(index)}
                    className="absolute top-3 right-3 p-1.5 text-muted-color hover:text-red-500 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pr-8">
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-semibold mb-1 dark:text-[#8B8FA8]">Institution</label>
                      <input
                        {...register(`education.${index}.institution`)}
                        placeholder="University / School name"
                        className="w-full px-3 py-2 bg-card-bg dark:bg-[#14152E] border border-border-color dark:border-[#2A2B45] rounded-lg text-sm focus:outline-none focus:border-primary transition-colors dark:text-[#F1F1F5] placeholder:text-muted-color dark:placeholder:text-[#8B8FA8]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold mb-1 dark:text-[#8B8FA8]">Degree</label>
                      <input
                        {...register(`education.${index}.degree`)}
                        placeholder="e.g. B.Tech"
                        className="w-full px-3 py-2 bg-card-bg dark:bg-[#14152E] border border-border-color dark:border-[#2A2B45] rounded-lg text-sm focus:outline-none focus:border-primary transition-colors dark:text-[#F1F1F5] placeholder:text-muted-color dark:placeholder:text-[#8B8FA8]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold mb-1 dark:text-[#8B8FA8]">Field of Study</label>
                      <input
                        {...register(`education.${index}.field`)}
                        placeholder="e.g. Computer Science"
                        className="w-full px-3 py-2 bg-card-bg dark:bg-[#14152E] border border-border-color dark:border-[#2A2B45] rounded-lg text-sm focus:outline-none focus:border-primary transition-colors dark:text-[#F1F1F5] placeholder:text-muted-color dark:placeholder:text-[#8B8FA8]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold mb-1 dark:text-[#8B8FA8]">Start Year</label>
                      <input
                        type="number"
                        {...register(`education.${index}.startYear`)}
                        placeholder="2020"
                        className="w-full px-3 py-2 bg-card-bg dark:bg-[#14152E] border border-border-color dark:border-[#2A2B45] rounded-lg text-sm focus:outline-none focus:border-primary transition-colors dark:text-[#F1F1F5] placeholder:text-muted-color dark:placeholder:text-[#8B8FA8]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold mb-1 dark:text-[#8B8FA8]">End Year</label>
                      <input
                        type="number"
                        {...register(`education.${index}.endYear`)}
                        placeholder="2024"
                        className="w-full px-3 py-2 bg-card-bg dark:bg-[#14152E] border border-border-color dark:border-[#2A2B45] rounded-lg text-sm focus:outline-none focus:border-primary transition-colors dark:text-[#F1F1F5] placeholder:text-muted-color dark:placeholder:text-[#8B8FA8]"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Section 5: Resume */}
        <div className="bg-card-bg dark:bg-[#14152E] p-6 rounded-xl border border-border-color dark:border-[#2A2B45]">
          <h2 className="text-lg font-bold mb-5 dark:text-[#F1F1F5]">Resume</h2>
          {profileData?.resume ? (
            <div className="flex items-center gap-3 p-3 bg-surface-bg dark:bg-[#1C1D3A] rounded-xl border border-border-color dark:border-[#2A2B45] mb-3">
              <div className="w-10 h-10 bg-green-500/10 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium dark:text-[#F1F1F5] truncate">{profileData.resume}</p>
                <p className="text-xs text-muted-color dark:text-[#8B8FA8]">Current resume</p>
              </div>
              <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          ) : (
            <p className="text-sm text-muted-color dark:text-[#8B8FA8] mb-3">No resume uploaded yet.</p>
          )}
          <label className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary/10 text-primary rounded-xl text-sm font-semibold cursor-pointer hover:bg-primary/20 transition-colors">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
            {uploadingResume ? 'Uploading...' : 'Upload New Resume'}
            <input type="file" accept=".pdf,.doc,.docx" className="hidden" onChange={handleResumeUpload} disabled={uploadingResume} />
          </label>
        </div>

        {/* Section 6: Social Links */}
        <div className="bg-card-bg dark:bg-[#14152E] p-6 rounded-xl border border-border-color dark:border-[#2A2B45]">
          <h2 className="text-lg font-bold mb-5 dark:text-[#F1F1F5]">Social Links</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold mb-1.5 dark:text-[#F1F1F5] flex items-center gap-2">
                <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
                LinkedIn
              </label>
              <input
                {...register('socialLinks.linkedin')}
                placeholder="https://linkedin.com/in/yourprofile"
                className="w-full px-4 py-2.5 bg-surface-bg dark:bg-[#1C1D3A] border border-border-color dark:border-[#2A2B45] rounded-xl text-sm focus:outline-none focus:border-primary transition-colors dark:text-[#F1F1F5] placeholder:text-muted-color dark:placeholder:text-[#8B8FA8]"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1.5 dark:text-[#F1F1F5] flex items-center gap-2">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
                GitHub
              </label>
              <input
                {...register('socialLinks.github')}
                placeholder="https://github.com/yourusername"
                className="w-full px-4 py-2.5 bg-surface-bg dark:bg-[#1C1D3A] border border-border-color dark:border-[#2A2B45] rounded-xl text-sm focus:outline-none focus:border-primary transition-colors dark:text-[#F1F1F5] placeholder:text-muted-color dark:placeholder:text-[#8B8FA8]"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1.5 dark:text-[#F1F1F5] flex items-center gap-2">
                <svg className="w-4 h-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                </svg>
                Portfolio
              </label>
              <input
                {...register('socialLinks.portfolio')}
                placeholder="https://yourportfolio.com"
                className="w-full px-4 py-2.5 bg-surface-bg dark:bg-[#1C1D3A] border border-border-color dark:border-[#2A2B45] rounded-xl text-sm focus:outline-none focus:border-primary transition-colors dark:text-[#F1F1F5] placeholder:text-muted-color dark:placeholder:text-[#8B8FA8]"
              />
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving || !isDirty}
            className="px-8 py-3 bg-primary text-white rounded-xl font-semibold text-sm hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            {saving ? (
              <>
                <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Saving...
              </>
            ) : (
              'Save Changes'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CandidateProfile;

