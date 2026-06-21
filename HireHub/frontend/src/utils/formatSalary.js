export const formatSalary = (min, max) => {
  if (!min && !max) return 'Salary not disclosed';
  
  const format = (val) => {
    if (val >= 100000) return `₹${(val / 100000).toFixed(1)} LPA`;
    if (val >= 1000) return `₹${(val / 1000).toFixed(0)}K`;
    return `₹${val}`;
  };

  if (min && !max) return `${format(min)}+`;
  if (!min && max) return `Up to ${format(max)}`;
  return `${format(min)} - ${format(max)}`;
};
