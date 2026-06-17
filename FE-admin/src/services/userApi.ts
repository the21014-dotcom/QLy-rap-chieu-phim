
/* eslint-disable @typescript-eslint/no-explicit-any */
import api from './api';



export const userApi = {
  getAll: (params: { role?: string; search?: string }) => 
    api.get('/users', { params }), // Quan trọng: phải truyền params vào đây
  create: (data: any) => api.post('/users', data),
  update: (id: number, data: any) => api.patch(`/users/${id}`, data),
  delete: (id: number) => api.delete(`/users/${id}`),
};