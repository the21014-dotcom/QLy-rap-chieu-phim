/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';
import { Form, Input, Button, Card, Typography } from 'antd';
import { LockOutlined, MailOutlined } from '@ant-design/icons';
import { useAdminAuth } from '../../store/AdminAuthContext';

const { Title, Text } = Typography;

const AdminLogin = () => {
  const { login } = useAdminAuth();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      await login(values);
    } catch (err: any) {
      console.error('Login error:', err);
      setLoading(false);
    }
  };

  return (
    <div className="h-screen w-screen flex items-center justify-center relative overflow-hidden bg-[#0a0a0c]">
      {/* --- HIỆU ỨNG NỀN SANG TRỌNG --- */}
      {/* Đốm sáng đỏ 1 */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-red-900/20 blur-[120px] animate-pulse"></div>
      {/* Đốm sáng đỏ 2 */}
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-red-600/10 blur-[100px]"></div>
      
      {/* Overlay Texture (Tạo độ mịn cao cấp) */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
           style={{ backgroundImage: `url('https://www.transparenttextures.com/patterns/stardust.png')` }}></div>
      {/* ------------------------------- */}

      <div className="w-full max-w-md p-4 z-10 animate-in fade-in zoom-in duration-700">
        {/* Logo Section */}
        <div className="text-center mb-8">
          <Title className="!text-white !m-0 !italic !font-black !tracking-tighter !text-5xl">
            CGV <span className="text-red-600 drop-shadow-[0_0_15px_rgba(220,38,38,0.5)]">CINEMA</span>
          </Title>
          <div className="flex items-center justify-center gap-3 mt-3">
            <div className="h-[1px] w-8 bg-slate-700"></div>
            <Text className="text-slate-400 uppercase text-[10px] tracking-[0.4em] font-medium block">
              MANAGEMENT SYSTEM
            </Text>
            <div className="h-[1px] w-8 bg-slate-700"></div>
          </div>
        </div>
        
        <Card 
          className="shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-white/10 bg-white/5 backdrop-blur-xl rounded-2xl"
          styles={{ body: { padding: '40px 32px' } }}
        >
          <div className="mb-8 text-center">
            <h2 className="text-2xl font-bold text-white tracking-tight">Đăng Nhập</h2>
            <p className="text-slate-400 text-sm mt-1">Hệ thống quản trị bảo mật cao</p>
          </div>

          <Form 
            name="admin_login" 
            onFinish={onFinish} 
            layout="vertical" 
            size="large"
            requiredMark={false}
          >
            <Form.Item 
              label={<span className="text-slate-300 font-medium">Email Quản trị</span>}
              name="email" 
              rules={[
                { required: true, message: 'Email không được để trống!' },
                { type: 'email', message: 'Email không đúng định dạng!' }
              ]}
            >
              <Input 
                prefix={<MailOutlined className="text-slate-500" />} 
                placeholder="admin@cgv.vn" 
                className="rounded-lg h-12 bg-black/20 border-white/10 text-white hover:border-red-500 focus:border-red-500 placeholder:text-slate-600"
              />
            </Form.Item>

            <Form.Item 
              label={<span className="text-slate-300 font-medium">Mật mã</span>}
              name="password" 
              rules={[{ required: true, message: 'Mật khẩu không được để trống!' }]}
            >
              <Input.Password 
                prefix={<LockOutlined className="text-slate-500" />} 
                placeholder="••••••••" 
                className="rounded-lg h-12 bg-black/20 border-white/10 text-white hover:border-red-500 focus:border-red-500 placeholder:text-slate-600"
              />
            </Form.Item>

            <Button 
              type="primary" 
              htmlType="submit" 
              block 
              loading={loading}
              className="h-12 bg-red-600 hover:!bg-red-700 active:!bg-red-800 border-none font-bold text-lg rounded-lg mt-6 shadow-lg shadow-red-900/20 transition-all duration-300 hover:scale-[1.02]"
            >
              VÀO HỆ THỐNG
            </Button>
          </Form>
        </Card>

        <div className="text-center mt-10">
          <Text className="text-slate-600 text-[10px] tracking-widest uppercase">
            Designed for Excellence — CGV © 2026
          </Text>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;