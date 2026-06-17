import React from 'react';
import { Layout, Button, Space, Avatar, Dropdown, theme, Typography, type MenuProps } from 'antd';
import { 
  MenuUnfoldOutlined, 
  MenuFoldOutlined, 
  UserOutlined, 
  LogoutOutlined, 
  BellOutlined,
  SettingOutlined 
} from '@ant-design/icons';
import { useAdminAuth } from '../../store/AdminAuthContext'; 

const { Header } = Layout;
const { Text } = Typography;

interface AdminHeaderProps {
  collapsed?: boolean;
  onCollapse?: (val: boolean) => void;
}

const AdminHeader: React.FC<AdminHeaderProps> = ({ collapsed, onCollapse }) => {
  const { adminUser, logout } = useAdminAuth();
  const { token: { colorBgContainer } } = theme.useToken();

  const handleMenuClick: MenuProps['onClick'] = ({ key }) => {
    if (key === 'logout') {
      logout(); // Gọi hàm logout từ Context
    }
  };
  // Menu khi click vào Avatar
  const userMenuItems: MenuProps['items'] = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: 'Hồ sơ cá nhân',
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: 'Cài đặt hệ thống',
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Đăng xuất',
      danger: true,
 
    },
  ];

  return (
    <Header 
      style={{ 
        padding: '0 24px', 
        background: colorBgContainer, 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        boxShadow: '0 1px 4px rgba(0,21,41,.08)',
        zIndex: 1
      }}
      
    >
      <Space size="middle">
        {/* Nút đóng/mở Sidebar nếu bạn muốn điều khiển từ Header */}
        {onCollapse && (
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => onCollapse(!collapsed)}
            style={{ fontSize: '16px', width: 64, height: 64 }}
          />
        )}
        <Text strong className="hidden md:inline-block text-slate-500 italic">
          HỆ THỐNG QUẢN TRỊ CGV CINEMA
        </Text>
      </Space>

      <Space size="large">
        {/* Thông báo nhanh */}
        <Button type="text" icon={<BellOutlined style={{ fontSize: '18px' }} />} />

        {/* Thông tin User */}
        <Dropdown menu={{ items: userMenuItems, onClick: handleMenuClick }} placement="bottomRight" arrow>
          <Space className="cursor-pointer hover:bg-gray-50 px-2 py-1 rounded-lg transition-all">
            <div className="text-right hidden sm:block">
              <div className="text-sm font-bold leading-none">
                {adminUser?.full_name || 'Quản trị viên'}
              </div>
              <Text type="secondary" style={{ fontSize: '11px' }}>
                {adminUser?.role.name || 'ADMIN'}
              </Text>
            </div>
            <Avatar 
              style={{ backgroundColor: '#ff4d4f' }} 
              icon={<UserOutlined />} 
              src={adminUser?.avatar_url}
            />
          </Space>
        </Dropdown>
      </Space>
    </Header>
  );
};

export default AdminHeader;