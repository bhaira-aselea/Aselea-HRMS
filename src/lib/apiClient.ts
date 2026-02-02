import api from './api';
import type { AuthResponse, User, ApiResponse } from '@/types/api';

// Authentication APIs
export const authAPI = {
  login: (email: string, password: string) =>
    api.post<AuthResponse>('/auth/login', { email, password }),
  
  logout: () => api.post('/auth/logout'),
  
  getMe: () => api.get<{ success: boolean; user: User }>('/auth/me'),
  
  forgotPassword: (email: string) =>
    api.post('/auth/forgot-password', { email }),
  
  resetPassword: (token: string, newPassword: string) =>
    api.post('/auth/reset-password', { token, newPassword }),
};

// Admin APIs
export const adminAPI = {
  getDashboard: () => api.get('/admin/dashboard'),
  getActivity: () => api.get('/admin/activity'),
  getCompanies: (params?: any) => api.get('/admin/companies', { params }),
  createCompany: (data: any) => api.post('/admin/companies', data),
  getHRAccounts: (params?: any) => api.get('/admin/hr-accounts', { params }),
  createHR: (data: any) => api.post('/auth/register', data),
  getHRDetail: (id: string) => api.get(`/admin/hr/${id}`),
  resetHRPassword: (hrId: string) => api.post(`/admin/hr/${hrId}/reset-password`),
  getEmployees: (params?: any) => api.get('/admin/employees', { params }),
  createEmployee: (data: any) => api.post('/auth/register', data),
  getLeaves: (params?: any) => api.get('/admin/leaves', { params }),
  getTasks: (params?: any) => api.get('/admin/tasks', { params }),
};

// HR APIs
export const hrAPI = {
  getDashboard: () => api.get('/hr/dashboard'),
  getDepartmentStats: () => api.get('/hr/departments/stats'),
  getEmployees: (params?: any) => api.get('/hr/employees', { params }),
  createEmployee: (data: any) => api.post('/hr/employees', data),
  getEmployeeDetail: (id: string) => api.get(`/hr/employees/${id}`),
  updateEmployee: (id: string, data: any) => api.put(`/hr/employees/${id}`, data),
  deleteEmployee: (id: string) => api.delete(`/hr/employees/${id}`),
  getPendingLeaves: (params?: any) => api.get('/hr/leaves/pending', { params }),
  getPendingExpenses: (params?: any) => api.get('/hr/expenses/pending', { params }),
  getTodayAttendance: () => api.get('/hr/attendance/today'),
};

// Employee APIs
export const employeeAPI = {
  getDashboard: () => api.get('/employee/dashboard'),
  getProfile: () => api.get('/employee/profile'),
  updateProfile: (data: any) => api.put('/employee/profile', data),
  changePassword: (currentPassword: string, newPassword: string) =>
    api.put('/employee/change-password', { currentPassword, newPassword }),
  getMyTasks: (params?: any) => api.get('/employee/tasks', { params }),
  getMyLeaves: (params?: any) => api.get('/employee/leaves', { params }),
  getMyExpenses: (params?: any) => api.get('/employee/expenses', { params }),
  getMyAttendance: (params?: any) => api.get('/employee/attendance', { params }),
  getLeaveBalance: () => api.get('/employee/leave-balance'),
  getTeam: () => api.get('/employee/team'),
};

// Leave APIs
export const leaveAPI = {
  getLeaves: (params?: any) => api.get('/leaves', { params }),
  createLeave: (data: any) => api.post('/leaves', data),
  getLeaveById: (id: string) => api.get(`/leaves/${id}`),
  approveLeave: (id: string) => api.put(`/leaves/${id}/approve`),
  rejectLeave: (id: string, reason?: string) => 
    api.put(`/leaves/${id}/reject`, { reason }),
  cancelLeave: (id: string) => api.put(`/leaves/${id}/cancel`),
  getBalance: () => api.get('/leaves/balance'),
  getStatistics: (params?: any) => api.get('/leaves/statistics', { params }),
};

// Attendance APIs
export const attendanceAPI = {
  checkIn: (location?: any) => api.post('/attendance/check-in', { location }),
  checkOut: () => api.post('/attendance/check-out'),
  getToday: () => api.get('/attendance/today'),
  getMyAttendance: (params?: any) => api.get('/attendance/my-attendance', { params }),
  getSummary: (params?: any) => api.get('/attendance/summary', { params }),
  getEmployeeAttendance: (employeeId: string, params?: any) => 
    api.get(`/attendance/employee/${employeeId}`, { params }),
  getCompanySummary: (params?: any) => api.get('/attendance/company-summary', { params }),
};

// Task APIs
export const taskAPI = {
  getTasks: (params?: any) => api.get('/tasks', { params }),
  createTask: (data: any) => api.post('/tasks', data),
  getTaskById: (id: string) => api.get(`/tasks/${id}`),
  updateTask: (id: string, data: any) => api.put(`/tasks/${id}`, data),
  deleteTask: (id: string) => api.delete(`/tasks/${id}`),
  updateProgress: (id: string, progress: number) =>
    api.put(`/tasks/${id}/progress`, { progress }),
  getStatistics: (params?: any) => api.get('/tasks/statistics', { params }),
  addAttachment: (id: string, file: File) => {
    const formData = new FormData();
    formData.append('attachment', file);
    return api.post(`/tasks/${id}/attachments`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
};

// Expense APIs
export const expenseAPI = {
  getExpenses: (params?: any) => api.get('/expenses', { params }),
  createExpense: (data: any) => api.post('/expenses', data),
  getExpenseById: (id: string) => api.get(`/expenses/${id}`),
  updateExpense: (id: string, data: any) => api.put(`/expenses/${id}`, data),
  deleteExpense: (id: string) => api.delete(`/expenses/${id}`),
  approveExpense: (id: string) => api.put(`/expenses/${id}/approve`),
  rejectExpense: (id: string, reason?: string) =>
    api.put(`/expenses/${id}/reject`, { reason }),
  getStatistics: (params?: any) => api.get('/expenses/statistics', { params }),
};

// Chat APIs
export const chatAPI = {
  getConversations: () => api.get('/chat/conversations'),
  getMessages: (userId: string) => api.get(`/chat/messages/${userId}`),
  sendMessage: (receiver: string, content: string) =>
    api.post('/chat/send', { receiver, content }),
  markAsRead: (userId: string) => api.put(`/chat/read/${userId}`),
  searchUsers: (query: string) => api.get('/chat/users/search', { params: { q: query } }),
  getUnreadCount: () => api.get('/chat/unread/count'),
  deleteMessage: (messageId: string) => api.delete(`/chat/${messageId}`),
};

// Company APIs
export const companyAPI = {
  getCompanies: (params?: any) => api.get('/companies', { params }),
  createCompany: (data: any) => api.post('/companies', data),
  getCompanyById: (id: string) => api.get(`/companies/${id}`),
  updateCompany: (id: string, data: any) => api.put(`/companies/${id}`, data),
  deleteCompany: (id: string) => api.delete(`/companies/${id}`),
  updateStatus: (id: string, status: 'active' | 'inactive') =>
    api.put(`/companies/${id}/status`, { status }),
  getStats: (id: string) => api.get(`/companies/${id}/stats`),
};

// Announcement APIs
export const announcementAPI = {
  getAnnouncements: (params?: any) => api.get('/announcements', { params }),
  createAnnouncement: (data: any) => api.post('/announcements', data),
  getAnnouncementById: (id: string) => api.get(`/announcements/${id}`),
  updateAnnouncement: (id: string, data: any) => api.put(`/announcements/${id}`, data),
  deleteAnnouncement: (id: string) => api.delete(`/announcements/${id}`),
  markAsRead: (id: string) => api.put(`/announcements/${id}/read`),
  getUnreadCount: () => api.get('/announcements/unread/count'),
};

// User APIs
export const userAPI = {
  getUsers: (params?: any) => api.get('/user', { params }),
  getUserById: (id: string) => api.get(`/user/${id}`),
  updateUser: (id: string, data: any) => api.put(`/user/${id}`, data),
  deleteUser: (id: string) => api.delete(`/user/${id}`),
};

// Export all APIs
export default {
  auth: authAPI,
  admin: adminAPI,
  hr: hrAPI,
  employee: employeeAPI,
  leave: leaveAPI,
  attendance: attendanceAPI,
  task: taskAPI,
  expense: expenseAPI,
  chat: chatAPI,
  company: companyAPI,
  announcement: announcementAPI,
  user: userAPI,
};
