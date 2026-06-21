import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import axios from '../../api/axios';
import { timeAgo } from '../../utils/timeAgo';

const typeIcons = {
  application: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
  job: 'M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z',
  status: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
  message: 'M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z',
  system: 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
};

const typeColors = {
  application: 'bg-blue-500/10 text-blue-500',
  job: 'bg-primary/10 text-primary',
  status: 'bg-green-500/10 text-green-500',
  message: 'bg-amber-500/10 text-amber-500',
  system: 'bg-gray-500/10 text-gray-500',
};

/* Skeleton */
const NotifSkeleton = () => (
  <div className="flex gap-3 p-4 animate-pulse">
    <div className="w-10 h-10 rounded-lg bg-surface-bg dark:bg-[#1C1D3A] flex-shrink-0"></div>
    <div className="flex-1 space-y-2">
      <div className="h-4 w-3/4 bg-surface-bg dark:bg-[#1C1D3A] rounded"></div>
      <div className="h-3 w-1/2 bg-surface-bg dark:bg-[#1C1D3A] rounded"></div>
      <div className="h-3 w-20 bg-surface-bg dark:bg-[#1C1D3A] rounded"></div>
    </div>
  </div>
);

import { usePageTitle } from '../../hooks/usePageTitle';

const EmployerNotifications = () => {
  usePageTitle('Employer Notifications');
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/api/notifications');
      setNotifications(res.data.notifications || res.data || []);
    } catch (err) {
        const message = err.response?.data?.message || err.message || 'Failed to load data';
        setError(message);
        console.error('Fetch error:', err);
      } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleMarkAllRead = async () => {
    try {
      await axios.put('/api/notifications/read-all');
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      toast.success('All notifications marked as read');
    } catch (err) {
      toast.error('Failed to mark notifications as read');
    }
  };

  const handleMarkRead = async (notifId) => {
    try {
      await axios.put(`/api/notifications/${notifId}/read`);
      setNotifications((prev) =>
        prev.map((n) => (n._id === notifId ? { ...n, read: true } : n))
      );
    } catch {
      // silently fail
    }
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

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
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Notifications</h1>
          <p className="text-text-muted dark:text-[#8B8FA8] mt-1">
            Stay updated with your hiring activity
          </p>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={handleMarkAllRead}
            className="text-sm font-semibold text-primary hover:text-primary-dark transition-colors inline-flex items-center gap-1.5 self-start"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Mark all as read ({unreadCount})
          </button>
        )}
      </div>

      {/* Notification List */}
      <div className="bg-card-bg dark:bg-[#14152E] rounded-xl border border-border-color dark:border-[#2A2B45] overflow-hidden">
        {loading ? (
          <div className="divide-y divide-border-color dark:divide-[#2A2B45]">
            {Array.from({ length: 6 }).map((_, i) => (
              <NotifSkeleton key={i} />
            ))}
          </div>
        ) : notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16">
            <svg className="w-16 h-16 text-text-muted dark:text-[#8B8FA8] mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            <h3 className="font-bold text-lg mb-1">No Notifications</h3>
            <p className="text-sm text-text-muted dark:text-[#8B8FA8]">
              You're all caught up! New notifications will appear here.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-border-color dark:divide-[#2A2B45]">
            {notifications.map((notif) => {
              const iconPath = typeIcons[notif.type] || typeIcons.system;
              const color = typeColors[notif.type] || typeColors.system;

              return (
                <button
                  key={notif._id}
                  onClick={() => !notif.read && handleMarkRead(notif._id)}
                  className={`w-full text-left p-4 flex gap-3 transition-colors hover:bg-surface-bg/50 dark:hover:bg-[#1C1D3A]/50 ${
                    !notif.read ? 'bg-primary/[0.02]' : ''
                  }`}
                >
                  {/* Icon */}
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${color}`}>
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={iconPath} />
                    </svg>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className={`text-sm font-semibold line-clamp-1 ${!notif.read ? '' : 'text-text-muted dark:text-[#8B8FA8]'}`}>
                        {notif.title}
                      </h3>
                      {!notif.read && (
                        <span className="w-2 h-2 rounded-full bg-primary flex-shrink-0 mt-1.5"></span>
                      )}
                    </div>
                    <p className="text-xs text-text-muted dark:text-[#8B8FA8] line-clamp-2 mt-0.5">
                      {notif.message}
                    </p>
                    <p className="text-[11px] text-text-muted dark:text-[#8B8FA8] mt-1.5">
                      {timeAgo(notif.createdAt)}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default EmployerNotifications;
