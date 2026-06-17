import React from 'react';
import { Layout, Menu, type MenuProps } from 'antd';
import { 
  DashboardOutlined, 
  VideoCameraOutlined, 
  CalendarOutlined, 
  UserOutlined, 
  CoffeeOutlined,
  BarcodeOutlined,
  PictureOutlined
} from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';

const { Sider } = Layout;

// 1. ĐỊNH NGHĨA INTERFACE CHO PROPS
interface SidebarProps {
  collapsed: boolean;
  onCollapse: (val: boolean) => void;
}

// 2. ĐỊNH NGHĨA KIỂU DỮ LIỆU CHO MENU ITEMS
type MenuItem = Required<MenuProps>['items'][number];

const Sidebar: React.FC<SidebarProps> = ({ collapsed, onCollapse }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems: MenuItem[] = [
    {
      key: '/admin/dashboard',
      icon: <DashboardOutlined />,
      label: 'Bảng điều khiển',
    },
    {
    key: '/admin/banners', // KHỚP VỚI PATH TRONG App.tsx
    icon: <PictureOutlined />, 
    label: 'Quản lý Banner',
  },
    {
      key: 'movies-group',
      icon: <VideoCameraOutlined />,
      label: 'Quản lý phim',
      children: [
        { key: '/admin/movies/list', label: 'Danh sách phim' },
        { key: '/admin/movies/genres', label: 'Thể loại' },
      ],
    },
    {
      key: '/admin/showtimes',
      icon: <CalendarOutlined />,
      label: 'Lịch chiếu',
    },
    {
      key: '/admin/services',
      icon: <CoffeeOutlined />,
      label: 'Dịch vụ & Đồ ăn',
    },
    {
      key: '/admin/tickets',
      icon: <BarcodeOutlined />,
      label: 'Kiểm soát vé',
    },
    {
      key: '/admin/users',
      icon: <UserOutlined />,
      label: 'Khách hàng',
    },
  ];

  return (
    <Sider 
      collapsible 
      collapsed={collapsed} 
      onCollapse={(value) => onCollapse(value)}
      theme="dark"
      width={260}
      style={{
        overflow: 'auto',
        height: '100vh',
        position: 'sticky',
        top: 0,
        left: 0,
      }}
    >
      <div className="flex items-center justify-center py-6">
        <h1 className={`text-white font-black italic transition-all duration-300 ${collapsed ? 'text-xl' : 'text-2xl'}`}>
          TA{collapsed ? '' : <span className="text-red-600 ml-1">CINEMA</span>}
        </h1>
      </div>
      
      <Menu
        theme="dark"
        mode="inline"
        selectedKeys={[location.pathname]}
        items={menuItems}
        onClick={({ key }) => navigate(key)}
        style={{ borderRight: 0 }}
      />
    </Sider>
  );
};

export default Sidebar;