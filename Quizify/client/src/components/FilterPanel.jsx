import React from 'react';
import { FiX } from 'react-icons/fi';

const FilterPanel = ({ category, setCategory, difficulty, setDifficulty, sort, setSort, onReset }) => {
  const categories = [
    { label: 'All Categories', value: 'All' },
    { label: '🧠 General Knowledge', value: 'General Knowledge' },
    { label: '🔬 Science', value: 'Science' },
    { label: '💻 Technology', value: 'Technology' },
    { label: '📐 Mathematics', value: 'Mathematics' },
    { label: '📜 History', value: 'History' },
    { label: '🌍 Geography', value: 'Geography' },
    { label: '⚽ Sports', value: 'Sports' },
    { label: '🎬 Entertainment', value: 'Entertainment' },
    { label: '📖 Language', value: 'Language' },
    { label: '📌 Other', value: 'Other' },
  ];

  const difficulties = [
    { label: 'All Levels', value: 'All' },
    { label: '✅ Easy', value: 'Easy' },
    { label: '⚡ Medium', value: 'Medium' },
    { label: '🔥 Hard', value: 'Hard' },
  ];

  const sorts = [
    { label: 'Newest First', value: 'newest' },
    { label: 'Oldest First', value: 'oldest' },
    { label: 'Most Popular', value: 'popular' },
    { label: 'A → Z', value: 'az' },
  ];

  let activeFiltersCount = 0;
  if (category && category !== 'All') activeFiltersCount++;
  if (difficulty && difficulty !== 'All') activeFiltersCount++;
  if (sort !== 'newest') activeFiltersCount++;

  return (
    <div className="flex flex-wrap items-end gap-4 mt-4 w-full">
      <div className="flex-1 min-w-[140px] max-w-[200px]">
        <label className="block text-[#6B7280] text-xs font-medium mb-1">Category</label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full bg-white border border-[#E5E0D8] rounded-md py-2 px-4 text-sm focus:outline-none focus:border-[#2D6A4F] focus:ring-0 focus:shadow-focus cursor-pointer text-[#1A1A1A]"
        >
          {categories.map((cat) => (
            <option key={cat.value} value={cat.value}>{cat.label}</option>
          ))}
        </select>
      </div>

      <div className="flex-1 min-w-[120px] max-w-[160px]">
        <label className="block text-[#6B7280] text-xs font-medium mb-1">Difficulty</label>
        <select
          value={difficulty}
          onChange={(e) => setDifficulty(e.target.value)}
          className="w-full bg-white border border-[#E5E0D8] rounded-md py-2 px-4 text-sm focus:outline-none focus:border-[#2D6A4F] focus:ring-0 focus:shadow-focus cursor-pointer text-[#1A1A1A]"
        >
          {difficulties.map((diff) => (
            <option key={diff.value} value={diff.value}>{diff.label}</option>
          ))}
        </select>
      </div>

      <div className="flex-1 min-w-[120px] max-w-[160px]">
        <label className="block text-[#6B7280] text-xs font-medium mb-1">Sort By</label>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="w-full bg-white border border-[#E5E0D8] rounded-md py-2 px-4 text-sm focus:outline-none focus:border-[#2D6A4F] focus:ring-0 focus:shadow-focus cursor-pointer text-[#1A1A1A]"
        >
          {sorts.map((s) => (
            <option key={s.value} value={s.value}>{s.label}</option>
          ))}
        </select>
      </div>

      {activeFiltersCount > 0 && (
        <div className="ml-auto flex items-center gap-3 animate-fade-in">
          <div className="bg-[#2D6A4F] text-white text-xs font-semibold px-2 py-0.5 rounded-sm">
            {activeFiltersCount} filter{activeFiltersCount !== 1 && 's'} active
          </div>
          <button
            onClick={onReset}
            className="flex items-center gap-1 bg-white border border-[#D62828] text-[#D62828] rounded-md px-4 py-2 text-sm font-medium hover:bg-[#D62828]/10 transition-colors"
          >
            <FiX /> Reset
          </button>
        </div>
      )}
    </div>
  );
};

export default FilterPanel;
