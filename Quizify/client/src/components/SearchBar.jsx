import React, { useState, useEffect } from 'react';
import { FiSearch, FiX } from 'react-icons/fi';

const SearchBar = ({ onSearch, placeholder }) => {
  const [value, setValue] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch(value);
    }, 400);

    return () => clearTimeout(timer);
  }, [value, onSearch]);

  return (
    <div className="relative w-full">
      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
        <FiSearch className="text-gray-400 text-xl" />
      </div>
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="w-full pl-12 pr-12 py-4 bg-white border border-[#E5E0D8] rounded-md shadow-sm text-base focus:outline-none focus:border-[#2D6A4F] focus:ring-0 focus:shadow-focus transition-all text-[#1A1A1A] placeholder-[#9CA3AF]"
        placeholder={placeholder || "Search quizzes..."}
      />
      {value && (
        <button
          onClick={() => setValue('')}
          className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none"
        >
          <FiX className="text-xl" />
        </button>
      )}
    </div>
  );
};

export default SearchBar;
