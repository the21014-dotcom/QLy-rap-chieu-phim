import api from '../../services/api';

export interface LoginResponse {
  token?: string;
  user: {
    id: number;
    email: string;
    full_name: string;
    role: {
      id: number;
      name: string;
    }
    avatar?: string | null;
  };
}

interface LoginCredentials {
  email: string;
  password: string;
}

export const authApi = {
  login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
    // 1. GỌI API THẬT ĐẾN BACKEND
    const res = await api.post('/auth/login', credentials);
    
    // 2. TRẢ VỀ DỮ LIỆU THỰC TẾ (Bao gồm Token thật từ DB)
    return res.data; 
  },
};