import React, { useState } from 'react';
import { Layout } from 'antd';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/layout/Sidebar'; 
import AdminHeader from '../components/layout/AdminHeader'; 

const { Content } = Layout;

const AdminLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    // 1. Dùng w-full và overflow-x-hidden để ép toàn bộ bố cục không bị tràn nhưng rộng tối đa
    <Layout className="min-h-screen w-full overflow-x-hidden bg-[#f8fafc] flex flex-row">
      
      {/* Thanh Sidebar cố định độ rộng */}
      <Sidebar collapsed={collapsed} onCollapse={setCollapsed} />
      
      {/* 2. Layout bên phải chứa Header và Content phải chiếm trọn flex-1 và có w-0 
          để các bảng dữ liệu (Table) bên trong không kích dãn khung gây vỡ layout
      */}
      <Layout className="flex flex-col flex-1 min-w-0 w-full bg-[#f8fafc]">
        
        {/* Thanh Header (52px) */}
        <AdminHeader collapsed={collapsed} onCollapse={setCollapsed} />
        
        {/* 3. Vùng chứa nội dung: Loại bỏ mọi rào cản về khoảng cách */}
        <Content 
          style={{ 
            display: 'flex',
            flexDirection: 'column',
            flex: 1,
            width: '100%',
            padding: 0, // Đưa padding về 0 để mở rộng sát mép
          }}
        >
          <div
            // Sử dụng px-4 py-6 hoặc md:px-6 (giảm từ p-8 xuống) để tăng không gian hiển thị cho bảng biểu
            className="px-4 py-6 md:px-6 flex-1 w-full flex flex-col"
            style={{
              minHeight: 'calc(100vh - 52px)',
              background: 'transparent',
            }}
          >
            {/* Nơi hiển thị Dashboard, Movies, Invoices... 
                Bây giờ các component này sẽ tự do bung lụa 100% chiều ngang 
            */}
            <Outlet /> 
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminLayout;