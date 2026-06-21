import api from './axios';

export const createQuiz = async (quizData) => {
  return await api.post('/api/quizzes', quizData);
};

export const getAllQuizzes = async (params = {}) => {
  return await api.get('/api/quizzes', { params });
};

export const getQuizById = async (id) => {
  return await api.get(`/api/quizzes/${id}`);
};

export const deleteQuiz = async (id) => {
  return await api.delete(`/api/quizzes/${id}`);
};

export const getUserQuizzes = async () => {
  return await api.get('/api/quizzes/user/me');
};

export const submitAttempt = async (data) => {
  return await api.post('/api/attempts', data);
};

export const getUserAttempts = async () => {
  return await api.get('/api/attempts/user');
};

export const getAttemptById = async (id) => {
  return await api.get(`/api/attempts/${id}`);
};

export const updateProfile = async (data) => {
  return await api.put('/api/auth/profile', data);
};

export const getQuizLeaderboard = async (id) => {
  return await api.get(`/api/quizzes/${id}/leaderboard`);
};

export const getDashboardStats = async () => {
  return await api.get('/api/attempts/stats');
};


