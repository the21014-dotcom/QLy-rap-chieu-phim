import React from 'react';
import { Layout, Menu, Button, Space, Input } from 'antd';
import { SearchOutlined, UserOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';

const { Header: AntHeader } = Layout;

const Header: React.FC = () => {
  return (
    <AntHeader className="bg-white border-b flex items-center justify-between px-10 h-20 sticky top-0 z-50">
      {/* Logo */}
      <Link to="/" className="text-3xl font-black italic tracking-tighter text-black">
        CGV <span className="text-red-600">CINEMA</span>
      </Link>

      {/* Menu chính */}
      <Menu mode="horizontal" className="border-none flex-1 justify-center font-bold uppercase" 
        items={[
          { key: 'movies', label: 'Phim' },
          { key: 'cinemas', label: 'Rạp' },
          { key: 'deals', label: 'Khuyến mãi' },
          { key: 'news', label: 'Tin tức' },
        ]} 
      />

      {/* Thanh tìm kiếm và User */}
      <Space size="large">
        <Input 
          prefix={<SearchOutlined />} 
          placeholder="Tìm phim..." 
          className="rounded-full bg-gray-100 border-none hidden lg:flex" 
        />
        <Button type="text" icon={<ShoppingCartOutlined className="text-xl" />} />
        <Button type="primary" danger shape="round" icon={<UserOutlined />} className="font-bold">
          ĐĂNG NHẬP
        </Button>
      </Space>
    </AntHeader>
  );
};

export default Header;