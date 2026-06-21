export const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

export const formatTime = (seconds) => {
  if (!seconds) return '0m 0s';
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}m ${s}s`;
};

export const formatTimeAgo = (dateString) => {
  const now = new Date();
  const date = new Date(dateString);
  const diff = Math.floor((now - date) / 1000);
  
  if (diff < 60) return 'Just now';
  if (diff < 3600) return `${Math.floor(diff/60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff/3600)}h ago`;
  if (diff < 604800) return `${Math.floor(diff/86400)}d ago`;
  
  return formatDate(dateString);
};

export const getInitials = (name) => {
  if (!name) return '?';
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

export const getScoreColor = (pct) => {
  if (pct >= 80) return 'text-green-600';
  if (pct >= 60) return 'text-teal-600';
  if (pct >= 40) return 'text-amber-600';
  return 'text-red-600';
};

export const getScoreBg = (pct) => {
  if (pct >= 80) return 'bg-green-500';
  if (pct >= 60) return 'bg-teal';
  if (pct >= 40) return 'bg-amber-500';
  return 'bg-red-500';
};

export const getResultMessage = (pct) => {
  if (pct === 100) return '🏆 Perfect Score! Incredible!';
  if (pct >= 80) return '🌟 Outstanding Performance!';
  if (pct >= 60) return '✅ Well Done! You Passed!';
  if (pct >= 40) return '📚 So Close! Keep Practicing!';
  return '💪 Don\'t Give Up! Try Again!';
};

export const truncateText = (text, len=80) => {
  if (!text) return '';
  return text.length > len ? text.slice(0, len) + '...' : text;
};

export const getCategoryColor = (category) => {
  const map = {
    'Science': 'blue',
    'Technology': 'purple',
    'History': 'amber',
    'Geography': 'green',
    'Sports': 'red',
    'Mathematics': 'indigo',
    'Entertainment': 'pink',
    'Language': 'orange',
    'Other': 'gray',
  };
  return map[category] || 'teal';
};
