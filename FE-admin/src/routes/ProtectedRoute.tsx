import { Navigate, Outlet } from 'react-router-dom';
import { useAdminAuth } from '../store/AdminAuthContext';
import { Spin } from 'antd'; // Thêm loading UI cho chuyên nghiệp

export const ProtectedAdminRoute = () => {
  const { isAdmin, adminUser, loading } = useAdminAuth();

  // 1. Nếu đang trong quá trình kiểm tra Auth (đang đọc localStorage)
  // thì hiển thị màn hình chờ, không được chuyển hướng ngay.
  if (loading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-[#0f172a]">
        <Spin size="large" tip="Đang kiểm tra quyền truy cập..." />
      </div>
    );
  }

  // 2. Lấy tên Role từ Object (Sửa lỗi so sánh Object với String)
  // Chúng ta dùng dấu ?. để an toàn và .toUpperCase() để so sánh chính xác
  const roleName = adminUser?.role?.name?.toUpperCase();

  // 3. Kiểm tra: Nếu chưa đăng nhập HOẶC không phải ADMIN
  if (!isAdmin || roleName !== 'ADMIN') {
    console.log("Truy cập bị chặn: ", { isAdmin, roleName });
    return <Navigate to="/admin/login" replace />;
  }

  // 4. Nếu thỏa mãn, cho phép truy cập vào AdminLayout và các trang con
  return <Outlet />;
};