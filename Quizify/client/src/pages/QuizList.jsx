import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { getAllQuizzes } from '../api/quizApi';
import SearchBar from '../components/SearchBar';
import FilterPanel from '../components/FilterPanel';
import QuizCard from '../components/QuizCard';
import SkeletonCard from '../components/SkeletonCard';
import QuizListSkeleton from '../components/skeletons/QuizListSkeleton';
import usePageTitle from '../hooks/usePageTitle';
import PageTransition from '../components/PageTransition';

const QuizList = () => {
  usePageTitle('Browse Quizzes');
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState('grid');

  // Filters
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [difficulty, setDifficulty] = useState('All');
  const [sort, setSort] = useState('newest');

  // Debounced search
  const [debouncedSearch, setDebouncedSearch] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setCurrentPage(1);
    }, 400);
    return () => clearTimeout(timer);
  }, [search]);

  // When filters (except search text) change, reset to page 1
  useEffect(() => {
    setCurrentPage(1);
  }, [category, difficulty, sort]);

  useEffect(() => {
    fetchQuizzes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch, category, difficulty, sort, currentPage]);

  const fetchQuizzes = async () => {
    setLoading(true);
    try {
      const res = await getAllQuizzes({
        search: debouncedSearch,
        category,
        difficulty,
        sort,
        page: currentPage,
        limit: 12,
      });
      setQuizzes(res.data.quizzes);
      setTotal(res.data.total);
      setTotalPages(res.data.totalPages);
    } catch (err) {
      toast.error('Failed to load quizzes');
    } finally {
      setLoading(false);
    }
  };

  const resetFilters = () => {
    setSearch('');
    setCategory('All');
    setDifficulty('All');
    setSort('newest');
    setCurrentPage(1);
  };

  const renderPagination = () => {
    if (totalPages <= 1) return null;

    const pages = [];
    let startPage = Math.max(1, currentPage - 2);
    let endPage = Math.min(totalPages, currentPage + 2);

    if (startPage > 1) {
      pages.push(1);
      if (startPage > 2) pages.push('...');
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) pages.push('...');
      pages.push(totalPages);
    }

    return (
      <div className="flex flex-col items-center mt-12 pb-16">
        <div className="flex justify-center items-center gap-2">
          <button
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="bg-white text-[#1A1A1A] border border-[#E5E0D8] rounded-md px-5 py-2 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#F5F0E8] transition-colors"
          >
            &larr; Prev
          </button>
          
          <div className="flex gap-1">
            {pages.map((p, idx) => (
              <button
                key={idx}
                onClick={() => typeof p === 'number' && setCurrentPage(p)}
                disabled={typeof p !== 'number'}
                className={`w-10 h-10 flex items-center justify-center rounded-md transition-colors ${
                  p === currentPage
                    ? 'bg-[#2D6A4F] text-white font-bold'
                    : typeof p === 'number'
                    ? 'bg-white text-[#6B7280] hover:bg-[#F0FAF2] hover:text-[#2D6A4F]'
                    : 'bg-transparent text-[#9CA3AF] cursor-default'
                }`}
              >
                {p}
              </button>
            ))}
          </div>

          <button
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="bg-white text-[#1A1A1A] border border-[#E5E0D8] rounded-md px-5 py-2 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#F5F0E8] transition-colors"
          >
            Next &rarr;
          </button>
        </div>
        <div className="text-[#9CA3AF] text-sm mt-4">
          Page {currentPage} of {totalPages}
        </div>
      </div>
    );
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-[#FDFBF7] pt-16">
      {/* SECTION 1 - HERO STRIP */}
      <section className="bg-[#1A1A1A] pt-16 pb-24 px-6 text-center relative overflow-hidden">
        <div className="relative z-10 max-w-4xl mx-auto">
          <div className="inline-block bg-[#2D6A4F]/20 text-[#40916C] rounded-sm px-4 py-1 text-sm font-semibold mb-4 border border-[#40916C]/30">
            📚 Quiz Library
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white">Explore All Quizzes</h1>
          <p className="text-[#9CA3AF] text-lg mt-4 max-w-2xl mx-auto">
            Browse {total}+ quizzes across all categories. Find your next challenge and test your knowledge.
          </p>
          
          <div className="flex flex-wrap justify-center gap-8 md:gap-12 mt-10">
            <div className="text-center">
              <div className="text-2xl font-bold text-white">📝 {total}</div>
              <div className="text-[#6B7280] text-sm mt-1">Quizzes</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white">🏆 10K+</div>
              <div className="text-[#6B7280] text-sm mt-1">Attempts</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white">📂 10</div>
              <div className="text-[#6B7280] text-sm mt-1">Categories</div>
            </div>
          </div>
        </div>
        
        {/* Decorative background elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-20">
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-[#2D6A4F] rounded-full blur-3xl opacity-50"></div>
          <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-[#40916C] rounded-full blur-3xl opacity-50"></div>
        </div>
      </section>

      {/* SECTION 2 - SEARCH + FILTER BAR */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 relative z-20 -mt-12">
        <div className="bg-white rounded-md border border-[#E5E0D8] shadow-card p-6 w-full">
          <SearchBar onSearch={setSearch} placeholder="Search quizzes by title or description..." />
          <FilterPanel
            category={category}
            setCategory={setCategory}
            difficulty={difficulty}
            setDifficulty={setDifficulty}
            sort={sort}
            setSort={setSort}
            onReset={resetFilters}
          />
        </div>
      </section>

      {/* SECTION 3 - RESULTS HEADER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 mt-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <p className="text-[#6B7280] text-sm">Showing {quizzes.length} of {total} quizzes</p>
          {debouncedSearch && (
            <p className="text-[#1A1A1A] font-semibold text-base mt-1">
              Results for "{debouncedSearch}"
            </p>
          )}
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded-md border transition-colors ${
              viewMode === 'grid' ? 'bg-[#2D6A4F] text-white border-[#2D6A4F]' : 'bg-white text-[#9CA3AF] border-[#E5E0D8] hover:text-[#2D6A4F]'
            }`}
            title="Grid View"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path></svg>
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 rounded-md border transition-colors ${
              viewMode === 'list' ? 'bg-[#2D6A4F] text-white border-[#2D6A4F]' : 'bg-white text-[#9CA3AF] border-[#E5E0D8] hover:text-[#2D6A4F]'
            }`}
            title="List View"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd"></path></svg>
          </button>
        </div>
      </section>

      {/* SECTION 4 - QUIZ GRID */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 mt-6 pb-8">
        {loading ? (
          viewMode === 'grid' ? <QuizListSkeleton /> : (
            <div className="flex flex-col gap-4">
              {[...Array(8)].map((_, i) => <SkeletonCard key={i} viewMode="list" />)}
            </div>
          )
        ) : quizzes.length === 0 ? (
          <div className="py-20 flex flex-col items-center justify-center text-center">
            <div className="text-8xl mb-6">🔍</div>
            <h2 className="text-2xl font-bold text-[#1A1A1A]">No quizzes found</h2>
            <p className="text-[#6B7280] mt-2">Try adjusting your search or filters to find what you're looking for.</p>
            <button
              onClick={resetFilters}
              className="mt-6 bg-[#2D6A4F] text-white px-6 py-3 rounded-md font-semibold hover:bg-[#1B4332] shadow-btn transition-all"
            >
              Clear All Filters
            </button>
          </div>
        ) : (
          <div className={viewMode === 'grid' ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" : "flex flex-col gap-4"}>
            {quizzes.map((quiz) => (
              <QuizCard key={quiz._id} quiz={quiz} viewMode={viewMode} />
            ))}
          </div>
        )}
      </section>

      {/* SECTION 5 - PAGINATION */}
      {!loading && quizzes.length > 0 && renderPagination()}
      
    </div>
    </PageTransition>
  );
};

export default QuizList;
