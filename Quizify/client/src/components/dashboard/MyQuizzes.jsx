import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiMoreVertical, FiEye, FiShare2, FiEdit, FiTrash2, FiCalendar, FiSearch } from 'react-icons/fi';
import toast from 'react-hot-toast';
import DeleteModal from './DeleteModal';
import { deleteQuiz } from '../../api/quizApi';

const MyQuizzes = ({ quizzes, loading, onRefresh }) => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  
  // Dropdown state
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const dropdownRef = useRef(null);

  // Delete Modal state
  const [deleteModal, setDeleteModal] = useState({ open: false, quiz: null });
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    // Close dropdown on click outside
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpenDropdownId(null);
      }
    };
    // Close dropdown on scroll
    const handleScroll = () => {
      if (openDropdownId) setOpenDropdownId(null);
    };

    document.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('scroll', handleScroll, true);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('scroll', handleScroll, true);
    };
  }, [openDropdownId]);

  const handleCopyLink = (quizId) => {
    const url = `${window.location.origin}/quiz/${quizId}`;
    navigator.clipboard.writeText(url);
    toast.success('Quiz link copied! 🔗');
    setOpenDropdownId(null);
  };

  const handleEditClick = (quizId) => {
    toast('Edit feature coming soon! 🚧', { icon: '🛠️' });
    setOpenDropdownId(null);
    // navigate(`/edit-quiz/${quizId}`);
  };

  const confirmDelete = (quiz) => {
    setDeleteModal({ open: true, quiz });
    setOpenDropdownId(null);
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteQuiz(deleteModal.quiz._id);
      toast.success('Quiz deleted successfully');
      setDeleteModal({ open: false, quiz: null });
      if (onRefresh) onRefresh();
    } catch (err) {
      toast.error('Failed to delete quiz');
    } finally {
      setIsDeleting(false);
    }
  };

  const toggleDropdown = (id) => {
    if (openDropdownId === id) setOpenDropdownId(null);
    else setOpenDropdownId(id);
  };

  // Filter and sort quizzes
  let filteredQuizzes = quizzes.filter(q => 
    q.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    q.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (sortBy === 'newest') filteredQuizzes.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  if (sortBy === 'oldest') filteredQuizzes.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
  if (sortBy === 'popular') filteredQuizzes.sort((a, b) => (b.totalAttempts || 0) - (a.totalAttempts || 0));

  return (
    <div className="animate-fade-in pb-12">
      
      {/* HEADER ROW */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h2 className="text-[#1A1A1A] text-2xl font-bold">My Created Quizzes</h2>
          <p className="text-[#9CA3AF] text-sm mt-1">{quizzes.length} quizzes</p>
        </div>
        <button 
          onClick={() => navigate('/create-quiz')}
          className="w-full sm:w-auto bg-[#2D6A4F] text-white rounded-md px-5 py-2.5 font-semibold hover:bg-[#1B4332] shadow-btn transition-colors flex items-center justify-center gap-2"
        >
          ⚡ Create New Quiz
        </button>
      </div>

      {/* SEARCH + FILTER */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1 max-w-sm">
          <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9CA3AF]" />
          <input 
            type="text" 
            placeholder="Search my quizzes..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 rounded-md border border-[#E5E0D8] focus:border-[#2D6A4F] focus:ring-0 focus:shadow-focus outline-none transition-colors text-[#1A1A1A]"
          />
        </div>
        <select 
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="rounded-md border border-[#E5E0D8] py-2.5 px-4 outline-none focus:border-[#2D6A4F] focus:ring-0 focus:shadow-focus text-[#1A1A1A] cursor-pointer"
        >
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
          <option value="popular">Most Attempts</option>
        </select>
      </div>

      {/* LOADING STATE */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-md p-6 h-56 animate-pulse border border-[#E5E0D8]">
              <div className="flex justify-between"><div className="w-20 h-6 bg-[#E5E0D8] rounded-sm"></div><div className="w-8 h-8 bg-[#E5E0D8] rounded-sm"></div></div>
              <div className="w-3/4 h-6 bg-[#E5E0D8] rounded mt-4"></div>
              <div className="w-1/2 h-4 bg-[#E5E0D8] rounded mt-2"></div>
              <div className="w-full h-10 bg-[#E5E0D8] rounded-md mt-4"></div>
            </div>
          ))}
        </div>
      ) : quizzes.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-md shadow-card border border-[#E5E0D8] mt-6">
          <div className="text-6xl">📝</div>
          <h3 className="text-[#1A1A1A] font-bold text-xl mt-4">No quizzes yet</h3>
          <p className="text-[#6B7280] mt-2">Create your first quiz and share it with the world!</p>
          <button 
            onClick={() => navigate('/create-quiz')}
            className="mt-6 bg-[#2D6A4F] text-white rounded-md px-6 py-3 font-semibold hover:bg-[#1B4332] shadow-btn transition-colors"
          >
            Create Quiz ⚡
          </button>
        </div>
      ) : filteredQuizzes.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-md shadow-card border border-[#E5E0D8] mt-6 text-[#6B7280]">
          No quizzes match your search.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredQuizzes.map((quiz) => {
            const date = new Date(quiz.createdAt).toLocaleDateString('en-US', {
              month: 'short', day: 'numeric', year: 'numeric'
            });

            return (
              <div key={quiz._id} className="bg-white rounded-md shadow-card p-6 border-2 border-transparent hover:border-[#2D6A4F]/20 transition-all group relative">
                
                {/* TOP ROW */}
                <div className="flex justify-between items-start">
                  <div className="flex gap-2">
                    <span className="bg-[#F5F0E8] text-[#6B7280] px-3 py-1 rounded-sm text-xs font-semibold">{quiz.category}</span>
                  </div>
                  
                  <div className="relative">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleDropdown(quiz._id);
                      }}
                      className="w-8 h-8 rounded-sm flex items-center justify-center text-[#9CA3AF] hover:bg-[#F0FAF2] hover:text-[#2D6A4F] transition-colors"
                    >
                      <FiMoreVertical />
                    </button>

                    {/* DROPDOWN */}
                    {openDropdownId === quiz._id && (
                      <div ref={dropdownRef} className="absolute right-0 top-10 bg-white rounded-md shadow-card border border-[#E5E0D8] py-2 min-w-36 z-20 animate-scale-in origin-top-right">
                        <button onClick={() => navigate(`/quiz/${quiz._id}`)} className="w-full text-left px-4 py-2 text-sm text-[#3D3D3D] hover:bg-[#F0FAF2] hover:text-[#2D6A4F] flex items-center gap-2 transition-colors">
                          <FiEye /> View Quiz
                        </button>
                        <button onClick={() => handleCopyLink(quiz._id)} className="w-full text-left px-4 py-2 text-sm text-[#3D3D3D] hover:bg-[#F0FAF2] hover:text-[#2D6A4F] flex items-center gap-2 transition-colors">
                          <FiShare2 /> Copy Link
                        </button>
                        <button onClick={() => handleEditClick(quiz._id)} className="w-full text-left px-4 py-2 text-sm text-[#3D3D3D] hover:bg-[#F0FAF2] hover:text-[#2D6A4F] flex items-center gap-2 transition-colors">
                          <FiEdit /> Edit Quiz
                        </button>
                        <div className="border-t border-[#E5E0D8] my-1"></div>
                        <button onClick={() => confirmDelete(quiz)} className="w-full text-left px-4 py-2 text-sm text-[#D62828] hover:bg-red-50 flex items-center gap-2 transition-colors">
                          <FiTrash2 /> Delete
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <h3 className="text-[#1A1A1A] font-bold text-lg mt-4 line-clamp-2 group-hover:text-[#2D6A4F] transition-colors cursor-pointer" onClick={() => navigate(`/quiz/${quiz._id}`)}>
                  {quiz.title}
                </h3>
                <p className="text-[#9CA3AF] text-sm mt-2 line-clamp-2 min-h-10">
                  {quiz.description}
                </p>

                {/* STATS ROW */}
                <div className="mt-4 flex gap-4 bg-[#FDFBF7] rounded-md p-3 border border-[#E5E0D8]">
                  <div className="flex items-center gap-1.5 text-[#6B7280] text-sm">
                    <span className="text-[#2D6A4F] text-lg">📝</span> {quiz.questions.length} Questions
                  </div>
                  <div className="flex items-center gap-1.5 text-[#6B7280] text-sm">
                    <span className="text-[#2D6A4F] text-lg">👁️</span> {quiz.totalAttempts || 0} Attempts
                  </div>
                </div>

                {/* BOTTOM ROW */}
                <div className="mt-4 flex justify-between items-center pt-2">
                  <div className="flex items-center gap-1.5 text-[#9CA3AF] text-xs">
                    <FiCalendar /> {date}
                  </div>
                  {quiz.isPublished !== false ? (
                    <span className="bg-[#D8F3DC] text-[#2D6A4F] px-3 py-1 rounded-sm text-xs font-bold border border-[#40916C]/30">🟢 Published</span>
                  ) : (
                    <span className="bg-orange-50 text-orange-600 px-3 py-1 rounded-sm text-xs font-bold border border-orange-200">🟡 Draft</span>
                  )}
                </div>

                {/* HOVER LINE */}
                <div className="absolute bottom-0 left-0 w-full h-0.5 bg-[#2D6A4F] rounded-b-md scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></div>
              </div>
            );
          })}
        </div>
      )}

      {/* DELETE MODAL */}
      <DeleteModal 
        isOpen={deleteModal.open}
        quizTitle={deleteModal.quiz?.title}
        onConfirm={handleDelete}
        onCancel={() => setDeleteModal({ open: false, quiz: null })}
        isDeleting={isDeleting}
      />

    </div>
  );
};

export default MyQuizzes;
