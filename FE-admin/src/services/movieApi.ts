import api from './api';
import axios from 'axios';
/* eslint-disable @typescript-eslint/no-explicit-any */
export const movieApi = {
  // Lấy danh sách phim kèm theo thể loại (Relation: Genre)
  getAll: (params?: any) => api.get('/movies', { params }),
  
  // Lấy chi tiết phim và các suất chiếu (Relation: Showtimes)
  getById: (id: string) => api.get(`/movies/${id}`),
  
  create: (data: any) => api.post('/movies', data),
  
  update: (id: string, data: any) => api.patch(`/movies/${id}`, data),
  
  delete: (id: string) => api.delete(`/movies/${id}`),

  getAllGenres: () => axios.get('http://localhost:8080/api/v1/genres').then(res => res.data),

  // API dành riêng cho quản lý Suất chiếu (Showtime Model)
  getShowtimes: (movieId: string) => api.get(`/movies/${movieId}/showtimes`),
};