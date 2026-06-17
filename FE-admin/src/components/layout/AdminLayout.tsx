import React, { useState } from 'react';
import { Layout, Menu, theme, Avatar, Dropdown } from 'antd';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  DashboardOutlined,
  SettingOutlined,
  VideoCameraOutlined,
  UserOutlined,
  FileTextOutlined,
  CalendarOutlined,
  CoffeeOutlined,
  BarcodeOutlined,
  DollarOutlined,
  LogoutOutlined
} from '@ant-design/icons';

const { Header, Sider, Content } = Layout;

const AdminLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  // Định nghĩa Menu dựa trên yêu cầu của bạn
  const menuItems = [
    { key: '/admin/dashboard', icon: <DashboardOutlined />, label: '9. Báo cáo thống kê' },
    {
      key: 'system',
      icon: <SettingOutlined />,
      label: '1. Quản lý hệ thống',
      children: [
        { key: '/admin/system/roles', label: 'Quản lý Vai trò ' },
        { key: 'showtimes/cinemas', label: 'Quản lý Cụm Rạp' },
    
      ],
    },
    {
      key: 'movies',
      icon: <VideoCameraOutlined />,
      label: '2. Quản lý phim',
      children: [
        { key: '/admin/movies/list', label: 'Danh sách phim' },
        { key: '/admin/movies/genres', label: 'Thể loại phim' },
      ],
    },
    {
      key: 'users',
      icon: <UserOutlined />,
      label: '3. Quản lý người dùng',
      children: [
        { key: '/admin/users/customers', label: 'Khách hàng' },
        { key: '/admin/users/staffs', label: 'Nhân viên' },
      ],
    },
    {
      key: 'content',
      icon: <FileTextOutlined />,
      label: '4. Quản lý nội dung',
      children: [
        { key: '/admin/banners', label: 'Quản lý Banner' },
        { key: '/admin/promotions', label: 'Quản lý Khuyến Mãi' },
        { key: '/admin/content/feedbacks', label: 'Quản lý Phản hồi' },
      ],
    },
    {
      key: 'showtimes',
      icon: <CalendarOutlined />,
      label: '5. Quản lý lịch chiếu',
      children: [
        { key: '/admin/showtimes/list', label: 'Xuất chiếu' },
        { key: '/admin/showtimes/rooms', label: 'Phòng chiếu' },
        { key: '/admin/showtimes/seats', label: 'Ghế ngồi' },
      ],
    },
    { key: '/admin/services', icon: <CoffeeOutlined />, label: '6. Quản lý dịch vụ (Đồ ăn)' },
    { key: '/admin/tickets', icon: <BarcodeOutlined />, label: '7. Quản lý vé' },
    { key: '/admin/invoices', icon: <DollarOutlined />, label: '8. Quản lý hóa đơn' },
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider 
        collapsible 
        collapsed={collapsed} 
        onCollapse={(value) => setCollapsed(value)}
        theme="dark"
        width={250}
      >
        <div className="h-16 flex items-center justify-center text-white font-bold text-xl tracking-widest bg-red-600 m-2 rounded-lg">
          {collapsed ? 'CGV' : 'CGV ADMIN'}
        </div>
        <Menu
          theme="dark"
          selectedKeys={[location.pathname]}
          mode="inline"
          items={menuItems}
          onClick={({ key }) => navigate(key)}
        />
      </Sider>
      <Layout>
        <Header style={{ padding: '0 24px', background: colorBgContainer, display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
          <Dropdown menu={{ items: [{ key: 'logout', icon: <LogoutOutlined />, label: 'Đăng xuất' }] }} placement="bottomRight">
            <div className="flex items-center gap-2 cursor-pointer hover:bg-gray-100 p-2 rounded-md transition-all">
              <Avatar icon={<UserOutlined />} />
              <span className="font-medium">Admin Manager</span>
            </div>
          </Dropdown>
        </Header>
        <Content style={{ margin: '16px' }}>
          <div style={{ padding: 24, minHeight: 360, background: colorBgContainer, borderRadius: borderRadiusLG }}>
             {/* Đây là nơi nội dung của từng trang sẽ hiển thị */}
            <Outlet />
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminLayout;