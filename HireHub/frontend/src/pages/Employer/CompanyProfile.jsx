import { usePageTitle } from '../../hooks/usePageTitle';
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import axios from '../../api/axios';
import useAuth from '../../hooks/useAuth';

const industries = ['Technology', 'Finance', 'Healthcare', 'Education', 'E-commerce', 'Other'];

const CompanyProfile = () => {
  usePageTitle('Company Profile');
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [logoPreview, setLogoPreview] = useState(null);
  const [logoFile, setLogoFile] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const res = await axios.get('/api/auth/me');
        const data = res.data.user || res.data;
        reset({
          companyName: data.companyName || '',
          industry: data.industry || '',
          companyWebsite: data.companyWebsite || '',
          description: data.description || '',
          name: data.name || '',
          phone: data.phone || '',
          email: data.email || '',
        });
        if (data.companyLogo) {
          setLogoPreview(`/uploads/${data.companyLogo}`);
        }
      } catch (err) {
        toast.error('Failed to load profile');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [reset]);

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLogoFile(file);
      setLogoPreview(URL.createObjectURL(file));
    }
  };

  const onSubmit = async (data) => {
    try {
      setSaving(true);
      const formData = new FormData();
      formData.append('companyName', data.companyName);
      formData.append('industry', data.industry);
      formData.append('companyWebsite', data.companyWebsite);
      formData.append('description', data.description);
      formData.append('name', data.name);
      formData.append('phone', data.phone);
      if (logoFile) {
        formData.append('companyLogo', logoFile);
      }

      await axios.put('/api/auth/profile', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      toast.success('Profile updated successfully!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="animate-pulse space-y-2">
          <div className="h-8 w-48 bg-surface-bg dark:bg-[#1C1D3A] rounded"></div>
          <div className="h-4 w-64 bg-surface-bg dark:bg-[#1C1D3A] rounded"></div>
        </div>
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="bg-card-bg dark:bg-[#14152E] rounded-xl border border-border-color dark:border-[#2A2B45] p-6 animate-pulse space-y-4">
            <div className="h-5 w-32 bg-surface-bg dark:bg-[#1C1D3A] rounded"></div>
            <div className="grid grid-cols-2 gap-4">
              <div className="h-10 bg-surface-bg dark:bg-[#1C1D3A] rounded"></div>
              <div className="h-10 bg-surface-bg dark:bg-[#1C1D3A] rounded"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold">Company Profile</h1>
        <p className="text-text-muted dark:text-[#8B8FA8] mt-1">
          Update your company information to attract the best talent
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Section 1: Company Identity */}
        <div className="bg-card-bg dark:bg-[#14152E] rounded-xl border border-border-color dark:border-[#2A2B45] p-5 sm:p-6">
          <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            Company Identity
          </h2>

          {/* Logo Upload */}
          <div className="flex items-center gap-5 mb-5">
            <div className="w-20 h-20 rounded-xl border-2 border-dashed border-border-color dark:border-[#2A2B45] flex items-center justify-center overflow-hidden bg-surface-bg dark:bg-[#1C1D3A] flex-shrink-0">
              {logoPreview ? (
                <img src={logoPreview} alt="Logo" className="w-full h-full object-cover" />
              ) : (
                <svg className="w-8 h-8 text-text-muted dark:text-[#8B8FA8]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              )}
            </div>
            <div>
              <label className="cursor-pointer inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:text-primary-dark transition-colors">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                Upload Logo
                <input type="file" accept="image/*" onChange={handleLogoChange} className="hidden" />
              </label>
              <p className="text-xs text-text-muted dark:text-[#8B8FA8] mt-1">PNG, JPG up to 2MB</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1.5">
                Company Name <span className="text-red-500">*</span>
              </label>
              <input
                {...register('companyName', { required: 'Company name is required' })}
                placeholder="Your company name"
                className="w-full px-4 py-2.5 rounded-lg border border-border-color dark:border-[#2A2B45] bg-surface-bg dark:bg-[#1C1D3A] text-primary-color dark:text-[#F1F1F5] placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
              />
              {errors.companyName && <p className="text-red-500 text-xs mt-1">{errors.companyName.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5">Industry</label>
              <select
                {...register('industry')}
                className="w-full px-4 py-2.5 rounded-lg border border-border-color dark:border-[#2A2B45] bg-surface-bg dark:bg-[#1C1D3A] text-primary-color dark:text-[#F1F1F5] focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
              >
                <option value="">Select industry</option>
                {industries.map((ind) => (
                  <option key={ind} value={ind}>{ind}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Section 2: Company Details */}
        <div className="bg-card-bg dark:bg-[#14152E] rounded-xl border border-border-color dark:border-[#2A2B45] p-5 sm:p-6">
          <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
            Company Details
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1.5">Company Website</label>
              <input
                {...register('companyWebsite')}
                placeholder="https://yourcompany.com"
                className="w-full px-4 py-2.5 rounded-lg border border-border-color dark:border-[#2A2B45] bg-surface-bg dark:bg-[#1C1D3A] text-primary-color dark:text-[#F1F1F5] placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5">Company Description</label>
              <textarea
                {...register('description')}
                rows={5}
                placeholder="Tell candidates about your company, culture, and mission..."
                className="w-full px-4 py-2.5 rounded-lg border border-border-color dark:border-[#2A2B45] bg-surface-bg dark:bg-[#1C1D3A] text-primary-color dark:text-[#F1F1F5] placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm resize-none"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Contact */}
        <div className="bg-card-bg dark:bg-[#14152E] rounded-xl border border-border-color dark:border-[#2A2B45] p-5 sm:p-6">
          <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            Contact Information
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1.5">Your Name</label>
              <input
                {...register('name')}
                placeholder="Your name"
                className="w-full px-4 py-2.5 rounded-lg border border-border-color dark:border-[#2A2B45] bg-surface-bg dark:bg-[#1C1D3A] text-primary-color dark:text-[#F1F1F5] placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5">Phone</label>
              <input
                {...register('phone')}
                placeholder="+91 XXXXX XXXXX"
                className="w-full px-4 py-2.5 rounded-lg border border-border-color dark:border-[#2A2B45] bg-surface-bg dark:bg-[#1C1D3A] text-primary-color dark:text-[#F1F1F5] placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-sm font-medium mb-1.5">Email</label>
              <input
                {...register('email')}
                readOnly
                className="w-full px-4 py-2.5 rounded-lg border border-border-color dark:border-[#2A2B45] bg-surface-bg/50 dark:bg-[#1C1D3A]/50 text-text-muted dark:text-[#8B8FA8] text-sm cursor-not-allowed"
              />
              <p className="text-xs text-text-muted dark:text-[#8B8FA8] mt-1">Email cannot be changed</p>
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="btn-primary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? (
              <>
                <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Saving...
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Save Changes
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CompanyProfile;

