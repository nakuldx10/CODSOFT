import React, { useState } from 'react';
import { FiMail, FiCalendar, FiLogOut } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { updateProfile } from '../../api/quizApi';

const ProfileCard = ({ user, stats, onUpdate, onLogout }) => {
  const [editName, setEditName] = useState(user?.name || '');
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    if (editName.trim().length < 2) {
      toast.error('Name must be at least 2 characters');
      return;
    }
    if (editName === user.name) return;

    setIsSaving(true);
    try {
      const res = await updateProfile({ name: editName });
      toast.success('Profile updated! ✨');
      if (onUpdate) onUpdate(res.data.user);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  if (!user || !stats) return null;

  const joinedDate = new Date(user.createdAt || Date.now()).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric'
  });

  const avatarLetter = (user.name || 'U').charAt(0).toUpperCase();

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      
      {/* CARD 1: Profile Info */}
      <div className="bg-white rounded-md border border-[#E5E0D8] shadow-card p-8">
        <h3 className="text-[#1A1A1A] font-bold text-xl">👤 My Profile</h3>

        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 mt-6">
          <div className="w-24 h-24 rounded-sm bg-[#2D6A4F] text-white text-4xl font-black flex items-center justify-center flex-shrink-0 ring-4 ring-[#2D6A4F]/20 ring-offset-2">
            {avatarLetter}
          </div>
          
          <div className="text-center sm:text-left mt-2 sm:mt-0">
            <div className="text-[#1A1A1A] text-2xl font-bold">{user.name}</div>
            <div className="text-[#9CA3AF] text-sm mt-1 flex items-center justify-center sm:justify-start gap-2">
              <FiMail /> {user.email}
            </div>
            <div className="text-[#9CA3AF] text-sm mt-1 flex items-center justify-center sm:justify-start gap-2">
              <FiCalendar /> Member since {joinedDate}
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-[#E5E0D8]">
          <h4 className="text-[#6B7280] text-sm font-semibold uppercase tracking-wide mb-4">Edit Profile</h4>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#3D3D3D] mb-1">Full Name</label>
              <input 
                type="text" 
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="w-full rounded-md border border-[#E5E0D8] focus:border-[#2D6A4F] focus:ring-0 focus:shadow-focus py-3 px-4 outline-none transition-colors text-[#1A1A1A]"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-[#3D3D3D] mb-1">Email Address</label>
              <input 
                type="text" 
                value={user.email}
                disabled
                className="w-full rounded-md border border-[#E5E0D8] bg-[#FDFBF7] py-3 px-4 text-[#9CA3AF] cursor-not-allowed outline-none"
              />
              <p className="text-[#9CA3AF] text-xs mt-1">Email cannot be changed</p>
            </div>
          </div>

          <button 
            onClick={handleSave}
            disabled={isSaving || editName === user.name}
            className="mt-6 bg-[#2D6A4F] text-white rounded-md px-8 py-3 font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#1B4332] transition-colors flex items-center justify-center min-w-32 shadow-btn"
          >
            {isSaving ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : 'Save Changes'}
          </button>
        </div>
      </div>

      {/* CARD 2: Account Stats Summary */}
      <div className="bg-white rounded-md border border-[#E5E0D8] shadow-card p-8">
        <h3 className="text-[#1A1A1A] font-bold text-xl">📊 Your Stats Summary</h3>
        
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6">
          <div className="bg-[#FDFBF7] border border-[#E5E0D8] rounded-md p-4 text-center">
            <div className="text-[#2D6A4F] font-black text-2xl">{stats.totalCreated}</div>
            <div className="text-[#6B7280] text-xs mt-1 uppercase tracking-wide font-semibold">Quizzes Created</div>
          </div>
          <div className="bg-[#FDFBF7] border border-[#E5E0D8] rounded-md p-4 text-center">
            <div className="text-[#2D6A4F] font-black text-2xl">{stats.totalAttempts}</div>
            <div className="text-[#6B7280] text-xs mt-1 uppercase tracking-wide font-semibold">Quizzes Taken</div>
          </div>
          <div className="bg-[#FDFBF7] border border-[#E5E0D8] rounded-md p-4 text-center">
            <div className="text-[#2D6A4F] font-black text-2xl">{stats.totalQuestionsAnswered}</div>
            <div className="text-[#6B7280] text-xs mt-1 uppercase tracking-wide font-semibold">Questions Answered</div>
          </div>
          <div className="bg-[#FDFBF7] border border-[#E5E0D8] rounded-md p-4 text-center">
            <div className="text-[#2D6A4F] font-black text-2xl">{stats.avgPercentage}%</div>
            <div className="text-[#6B7280] text-xs mt-1 uppercase tracking-wide font-semibold">Avg Score</div>
          </div>
          <div className="bg-[#FDFBF7] border border-[#E5E0D8] rounded-md p-4 text-center">
            <div className="text-[#2D6A4F] font-black text-2xl">{stats.passRate}%</div>
            <div className="text-[#6B7280] text-xs mt-1 uppercase tracking-wide font-semibold">Pass Rate</div>
          </div>
          <div className="bg-[#FDFBF7] border border-[#E5E0D8] rounded-md p-4 text-center">
            <div className="text-[#2D6A4F] font-black text-2xl">{stats.bestScore}%</div>
            <div className="text-[#6B7280] text-xs mt-1 uppercase tracking-wide font-semibold">Best Score</div>
          </div>
        </div>
      </div>

      {/* CARD 3: Danger Zone */}
      <div className="bg-white rounded-md shadow-card p-8 border border-[#D62828]/20">
        <h3 className="text-[#1A1A1A] font-bold text-xl">⚠️ Account Actions</h3>
        
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center py-4 gap-4 mt-2">
          <div>
            <div className="text-[#1A1A1A] font-semibold">Logout</div>
            <div className="text-[#9CA3AF] text-sm mt-0.5">Sign out of your account on this device</div>
          </div>
          <button 
            onClick={onLogout}
            className="flex items-center gap-2 bg-red-50 text-[#D62828] border border-[#D62828]/30 rounded-md px-5 py-2 font-semibold hover:bg-red-100 transition-colors w-full sm:w-auto justify-center"
          >
            <FiLogOut /> Logout
          </button>
        </div>
      </div>

    </div>
  );
};

export default ProfileCard;
