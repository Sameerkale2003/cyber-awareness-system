// Re-export api for direct use
export { default as api } from './api'
import api from './api'

export const learningService = {
  getCategories: () => api.get('/learning/categories/'),
  getModules: (params) => api.get('/learning/modules/', { params }),
  getModule: (id) => api.get(`/learning/modules/${id}/`),
  getLesson: (id) => api.get(`/learning/lessons/${id}/`),
  getTips: (params) => api.get('/learning/tips/', { params }),
  getFeatured: () => api.get('/learning/featured/'),
  getPledge: () => api.get('/learning/pledge/'),
  takePledge: () => api.post('/learning/pledge/'),
}

export const quizService = {
  getQuizzes: () => api.get('/quizzes/'),
  getQuiz: (id) => api.get(`/quizzes/${id}/`),
  submitQuiz: (id, data) => api.post(`/quizzes/${id}/submit/`, data),
  getResult: (attemptId) => api.get(`/quizzes/attempts/${attemptId}/`),
  getHistory: () => api.get('/quizzes/history/'),
  getLeaderboard: () => api.get('/quizzes/leaderboard/'),
}

export const progressService = {
  getDashboard: () => api.get('/progress/dashboard/'),
  getProgress: () => api.get('/progress/'),
  updateProgress: (data) => api.post('/progress/update/', data),
  getActivity: () => api.get('/progress/activity/'),
  getAchievements: () => api.get('/progress/achievements/'),
  getLeaderboard: () => api.get('/progress/leaderboard/'),
}

export const authService = {
  getProfile: () => api.get('/auth/profile/'),
  updateProfile: (data) => api.put('/auth/profile/', data),
  changePassword: (data) => api.post('/auth/change-password/', data),
  getStats: () => api.get('/auth/stats/'),
}
