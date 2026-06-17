import api from './api';
/* eslint-disable @typescript-eslint/no-explicit-any */
export const bannerService = {
  // Lấy banner theo vị trí (HOME_SLIDER, POPUP...)
  getAll: () => api.get('/banners'),
  
  // Cập nhật trạng thái hiển thị (is_active)
  toggleStatus: (id: string, is_active: boolean) => 
    api.patch(`/banners/${id}`, { is_active }),
    
  create: (data: any) => api.post('/banners', data),
  
  update: (id: string, data: any) => api.patch(`/banners/${id}`, data),
  
  delete: (id: string) => api.delete(`/banners/${id}`),
  getUserHistory: (userId: string) => api.get(`/bookings/user/${userId}`),
  
};