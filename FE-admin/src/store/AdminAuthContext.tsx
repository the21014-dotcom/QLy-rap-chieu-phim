/* eslint-disable react-refresh/only-export-components */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { message } from 'antd';
import { authApi } from '../pages/Auth/authAdmin'; 
import type { Admin } from '../types/Admin';

// Key đồng bộ để dùng trong api.ts và kiểm tra đăng nhập
export const ADMIN_TOKEN_KEY = 'admin_token';
export const ADMIN_INFO_KEY = 'admin_info';

interface AdminAuthContextType {
  isAdmin: boolean;
  adminUser: Admin | null;
  login: (values: any) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

const AdminAuthContext = createContext<AdminAuthContextType | null>(null);

export const AdminAuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [adminUser, setAdminUser] = useState<Admin | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  // Khởi tạo Auth: Kiểm tra dữ liệu đã lưu trong localStorage khi tải lại trang
  useEffect(() => {
    const initAuth = () => {
      try {
        const savedUser = localStorage.getItem(ADMIN_INFO_KEY);
        const token = localStorage.getItem(ADMIN_TOKEN_KEY);
        if (savedUser && token) {
          setAdminUser(JSON.parse(savedUser) as Admin);
        }
      } catch (err: any) {
        console.error('Error initializing admin auth:', err);
        localStorage.removeItem(ADMIN_TOKEN_KEY);
        localStorage.removeItem(ADMIN_INFO_KEY);
      } finally {
        setLoading(false);
      }
    };
    initAuth();
  }, []);

  // Hàm Đăng xuất: Xóa sạch dấu vết đăng nhập và đẩy về trang login
  const logout = useCallback(() => {
    localStorage.removeItem(ADMIN_TOKEN_KEY);
    localStorage.removeItem(ADMIN_INFO_KEY);
    setAdminUser(null);
    message.success('Đã đăng xuất khỏi hệ thống');
    navigate('/admin/login', { replace: true });
  }, [navigate]);
  
  // Hàm Đăng nhập: Xử lý phản hồi từ API và kiểm tra phân quyền
  const login = useCallback(async (values: any) => {
    try {
      const response = await authApi.login(values);
      console.log("Full Response từ API:", response);

      // Linh hoạt lấy token (chấp nhận cả 'token' hoặc 'access_token' từ Backend)
      const token = response.token || (response as any).access_token;
      const userData = response.user as Admin;

      if (!userData || !userData.role) {
      message.error('Không tìm thấy thông tin quyền hạn của người dùng!');
  return;
}

// Lấy tên Role từ object (Cấu trúc mới là Object, không phải String)
const roleName = userData.role.name?.trim().toUpperCase();

console.log("Kiểm tra roleName thực tế:", `"${roleName}"`);

// CHỈNH SỬA TẠI ĐÂY: Nếu KHÔNG PHẢI là ADMIN thì mới chặn
if (roleName !== 'ADMIN') {
  console.log("Quyền hiện tại:", roleName);
  message.error('Bạn không có quyền truy cập quản trị!');
  return;
}

      // Lưu vào localStorage để duy trì trạng thái đăng nhập
      localStorage.setItem(ADMIN_TOKEN_KEY, token);
      localStorage.setItem(ADMIN_INFO_KEY, JSON.stringify(userData));
      
      setAdminUser(userData);
      setLoading(false);
      message.success(`Chào mừng CGV ${userData.full_name}!`);
      setTimeout(() => {
    console.log("Đang thực hiện chuyển hướng...");
    navigate('/admin/dashboard', { replace: true });
}, 300);
    } catch (error: any) {
      console.error("Lỗi đăng nhập chi tiết:", error);
      // Hiển thị thông báo lỗi từ Backend nếu có, nếu không thì hiện lỗi mặc định
      const errorMsg = error.response?.data?.message || 'Email hoặc mật khẩu không chính xác!';
      message.error(errorMsg);
    }
  }, [navigate]);
  

  const contextValue = useMemo(() => ({
    isAdmin: !!adminUser,
    adminUser,
    login,
    logout,
    loading
  }), [adminUser, loading, login, logout]);

  return (
    <AdminAuthContext.Provider value={contextValue}>
      {!loading && children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (!context) throw new Error('useAdminAuth phải được sử dụng bên trong AdminAuthProvider');
  return context;
};