/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080/api/v1/tickets',
  headers: {
    'Content-Type': 'application/json',
  },
});

// INTERCEPTOR: Tự động lấy Token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('admin_token'); 
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const ticketService = {
  /**
   * 1. Lấy tất cả vé
   * Cập nhật: Trả về trực tiếp response.data để Frontend nhận được Mảng (Array)
   */
  getAll: async () => {
    const response = await api.get('/');
    // Thường NestJS trả về data trong response.data
    return response.data; 
  },

  /**
   * 2. Lấy chi tiết 1 vé
   */
  getById: async (id: number | string) => {
    const response = await api.get(`/${id}`);
    return response.data;
  },

  /**
   * 3. Tạo vé mới
   */
  create: async (ticketData: {
    showtime_id: number;
    booking_id: number;
    seat_id: number;
    showtime_seat_id: number;
    price: number;
    status?: string;
  }) => {
    const response = await api.post('/', ticketData);
    return response.data;
  },

  /**
   * 4. Cập nhật trạng thái vé (Quan trọng để fix lỗi "bị cứng")
   */
  update: async (id: number | string | undefined, updateData: { status?: string; price?: number }) => {
    if (!id) throw new Error("ID vé không hợp lệ");
    const response = await api.patch(`/${id}`, updateData);
    return response.data;
  },

  /**
   * 5. Hủy vé & Giải phóng ghế
   */
  delete: async (id: number | string) => {
    const response = await api.delete(`/${id}`);
    return response.data;
  }
};