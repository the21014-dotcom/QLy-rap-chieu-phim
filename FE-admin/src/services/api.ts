import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

// INTERCEPTOR CHO REQUEST: Tự động đính kèm Token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('admin_token'); // Hoặc lấy từ Redux/Zustand
    console.log("Token hiện tại:", token);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// INTERCEPTOR CHO RESPONSE: Xử lý lỗi tập trung
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Nếu lỗi 401: Token sai hoặc hết hạn
      console.error('Phiên đăng nhập hết hạn!');
      localStorage.removeItem('admin_token');
      localStorage.removeItem('admin_info');
      window.location.href = '/admin/login';
  
    }
    return Promise.reject(error);
  }
);

export default api;