import axios from 'axios';
import { STORAGE_KEYS } from '../constants'; // Import để dùng chung key với Context

/* eslint-disable @typescript-eslint/no-explicit-any */
const axiosClient = axios.create({
  baseURL: 'http://localhost:8080/api/v1', // URL của NestJS
  headers: {
    'Content-Type': 'application/json',
  },
});

// 1. Tự động thêm Token vào Header mỗi khi gọi API
axiosClient.interceptors.request.use(
  (config) => {
    // Sử dụng STORAGE_KEYS.TOKEN thay vì viết cứng chuỗi string
    const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 2. Xử lý dữ liệu trả về để khớp với res.data ở Frontend
axiosClient.interceptors.response.use(
  (response) => {
    /**
     * GIẢI PHÁP CHO res.data:
     * Khi Backend trả về dữ liệu (ví dụ: { user, access_token }), 
     * ta bọc nó vào một object { data: ... } 
     * để ở Frontend bạn gọi res.data.user sẽ không bị lỗi undefined.
     */
    if (response && response.data) {
      return { data: response.data } as any; 
    }
    return response;
  },
  (error) => {
    /**
     * Xử lý lỗi: Giữ nguyên cấu trúc để các hàm catch(err) 
     * ở Frontend vẫn lấy được err.response.data.message
     */
    return Promise.reject(error);
  }
);

export default axiosClient;