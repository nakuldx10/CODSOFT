import { Link, useLocation } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';

import { useState } from 'react';

const EmployerSidebar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const links = [
    { name: 'Dashboard', path: '/employer/dashboard', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
    { name: 'Post Job', path: '/employer/post-job', icon: 'M12 4v16m8-8H4' },
    { name: 'Manage Jobs', path: '/employer/jobs', icon: 'M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' },
    { name: 'Applications', path: '/employer/applications', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
    { name: 'Notifications', path: '/employer/notifications', icon: 'M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9' },
    { name: 'Company Profile', path: '/employer/profile', icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4' },
    { name: 'Settings', path: '/employer/settings', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z' },
  ];

  return (
    <>
      <div className="md:hidden fixed top-0 w-full z-40 bg-card-bg dark:bg-[#14152E] border-b border-border-color dark:border-[#2A2B45] px-4 py-3 flex justify-between items-center">
        <Link to="/" className="flex items-center">
          <span className="text-xl font-bold text-primary-color">
            Hire<span className="text-primary">Hub</span>
          </span>
        </Link>
        <button onClick={() => setIsMobileOpen(!isMobileOpen)} className="text-text-muted hover:text-primary-color">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      <aside className={`fixed inset-y-0 left-0 z-30 w-64 bg-card-bg dark:bg-[#14152E] border-r border-border-color dark:border-[#2A2B45] transform transition-transform duration-300 ease-in-out md:translate-x-0 ${isMobileOpen ? 'translate-x-0 mt-12 md:mt-0' : '-translate-x-full'} flex flex-col h-screen`}>
        <div className="hidden md:flex items-center h-16 px-6 border-b border-border-color dark:border-[#2A2B45]">
          <Link to="/" className="flex items-center">
            <span className="text-2xl font-bold text-primary-color">
              Hire<span className="text-primary">Hub</span>
            </span>
          </Link>
        </div>

        <div className="p-6 border-b border-border-color dark:border-[#2A2B45]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center text-accent font-bold overflow-hidden">
              {user?.avatar ? (
                <img src={`/uploads/${user.avatar}`} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                (user?.companyName || user?.name || 'E').charAt(0).toUpperCase()
              )}
            </div>
            <div className="overflow-hidden">
              <h3 className="font-bold text-sm truncate">{user?.companyName || user?.name}</h3>
              <p className="text-xs text-text-muted dark:text-[#8B8FA8] capitalize bg-accent/10 inline-block px-2 py-0.5 rounded-full mt-1">{user?.role}</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          {links.map((link) => {
            const isActive = location.pathname.startsWith(link.path);
            return (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setIsMobileOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-sm font-medium ${
                  isActive
                    ? 'bg-accent text-white'
                    : 'text-text-muted hover:text-primary-color hover:bg-surface-bg dark:hover:bg-[#1C1D3A]'
                }`}
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={link.icon} />
                </svg>
                {link.name}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-border-color dark:border-[#2A2B45]">
          <button
            onClick={() => {
              logout();
              window.location.href = '/';
            }}
            className="w-full flex items-center gap-3 px-3 py-2.5 mt-2 rounded-lg transition-colors text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Logout
          </button>
        </div>
      </aside>

      {isMobileOpen && (
        <div className="md:hidden fixed inset-0 bg-black/50 z-20" onClick={() => setIsMobileOpen(false)}></div>
      )}
    </>
  );
};

export default EmployerSidebar;

