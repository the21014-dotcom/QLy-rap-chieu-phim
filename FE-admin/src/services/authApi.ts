/* eslint-disable @typescript-eslint/no-explicit-any */
import api from './api';

export const authApi = {
  login: (credentials: any) => api.post('/auth/login', credentials),
  
  register: (data: any) => api.post('/auth/register', data),
  
  getProfile: () => api.get('/auth/profile'),
  
  // Cập nhật thông tin thành viên (Rank: Silver, Gold, Platinum)
  updateMemberInfo: (data: any) => api.patch('/auth/profile', data),
};