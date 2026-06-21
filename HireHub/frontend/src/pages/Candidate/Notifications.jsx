import { usePageTitle } from '../../hooks/usePageTitle';
import { useState, useEffect } from 'react';
import axios from '../../api/axios';
import toast from 'react-hot-toast';
import { timeAgo } from '../../utils/timeAgo';

const typeIcons = {
  application: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4',
  status_update: 'M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15',
  interview: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z',
  new_job: 'M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z',
  message: 'M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z',
};

const typeColors = {
  application: 'bg-blue-500/10 text-blue-500',
  status_update: 'bg-amber-500/10 text-amber-500',
  interview: 'bg-green-500/10 text-green-500',
  new_job: 'bg-purple-500/10 text-purple-500',
  message: 'bg-pink-500/10 text-pink-500',
};

const Notifications = () => {
  usePageTitle('Notifications');
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [markingAll, setMarkingAll] = useState(false);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        setLoading(true);
        setError(null);
        const { data } = await axios.get('/api/notifications');
        setNotifications(data.notifications || data || []);
      } catch (err) {
        const message = err.response?.data?.message || err.message || 'Failed to load data';
        setError(message);
        console.error('Fetch error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchNotifications();
  }, []);

  const handleMarkAsRead = async (id) => {
    try {
      await axios.put(`/api/notifications/${id}/read`);
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, read: true } : n))
      );
    } catch {
      toast.error('Failed to mark as read');
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      setMarkingAll(true);
      await axios.put('/api/notifications/read-all');
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      toast.success('All notifications marked as read');
    } catch {
      toast.error('Failed to mark all as read');
    } finally {
      setMarkingAll(false);
    }
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

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

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold dark:text-[#F1F1F5]">Notifications</h1>
          {!loading && unreadCount > 0 && (
            <p className="text-sm text-muted-color dark:text-[#8B8FA8] mt-1">
              {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
            </p>
          )}
        </div>
        {!loading && unreadCount > 0 && (
          <button
            onClick={handleMarkAllAsRead}
            disabled={markingAll}
            className="px-4 py-2 text-sm font-semibold text-primary hover:text-primary/80 bg-primary/5 hover:bg-primary/10 rounded-lg transition-colors disabled:opacity-50"
          >
            {markingAll ? 'Marking...' : 'Mark all as read'}
          </button>
        )}
      </div>

      {loading ? (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="bg-card-bg dark:bg-[#14152E] p-5 rounded-xl border border-border-color dark:border-[#2A2B45] animate-pulse">
              <div className="flex gap-4">
                <div className="w-10 h-10 bg-surface-bg dark:bg-[#1C1D3A] rounded-lg" />
                <div className="flex-1">
                  <div className="h-4 bg-surface-bg dark:bg-[#1C1D3A] rounded w-48 mb-2" />
                  <div className="h-3 bg-surface-bg dark:bg-[#1C1D3A] rounded w-64 mb-2" />
                  <div className="h-3 bg-surface-bg dark:bg-[#1C1D3A] rounded w-20" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : notifications.length === 0 ? (
        <div className="bg-card-bg dark:bg-[#14152E] p-10 rounded-xl border border-border-color dark:border-[#2A2B45] text-center">
          <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="text-lg font-bold mb-1 dark:text-[#F1F1F5]">You&apos;re all caught up!</h3>
          <p className="text-sm text-muted-color dark:text-[#8B8FA8]">
            No notifications to display right now.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {notifications.map((notif) => {
            const iconPath = typeIcons[notif.type] || typeIcons.message;
            const colorClass = typeColors[notif.type] || typeColors.message;

            return (
              <button
                key={notif._id}
                onClick={() => !notif.read && handleMarkAsRead(notif._id)}
                className={`w-full text-left p-5 rounded-xl border transition-colors ${
                  notif.read
                    ? 'bg-card-bg dark:bg-[#14152E] border-border-color dark:border-[#2A2B45]'
                    : 'bg-primary/5 dark:bg-primary/5 border-primary/20 hover:border-primary/40'
                }`}
              >
                <div className="flex gap-4">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${colorClass}`}>
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={iconPath} />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className={`text-sm font-semibold line-clamp-1 ${notif.read ? 'dark:text-[#8B8FA8]' : 'dark:text-[#F1F1F5]'}`}>
                        {notif.title}
                      </h3>
                      {!notif.read && (
                        <span className="w-2.5 h-2.5 bg-primary rounded-full flex-shrink-0 mt-1" />
                      )}
                    </div>
                    <p className="text-sm text-muted-color dark:text-[#8B8FA8] mt-0.5 line-clamp-2">
                      {notif.message}
                    </p>
                    <span className="text-xs text-muted-color dark:text-[#8B8FA8] mt-1.5 block">
                      {timeAgo(notif.createdAt)}
                    </span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Notifications;
