/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from 'react';
import {
  Input,
  Button,
  Card,
  Typography,
  Tag,
  Divider,
  message,
  Select
} from 'antd';

import {
  SendOutlined,
  PhoneOutlined,
  MailOutlined,
  EnvironmentOutlined,
  ClockCircleOutlined,
  FacebookFilled,
  InstagramFilled,
  YoutubeFilled,
  FireOutlined,
  SafetyCertificateOutlined
} from '@ant-design/icons';

import AIChatBot from '../components/AIChatBot';

const { Title, Text } = Typography;
const { TextArea } = Input;
const { Option } = Select;

const ContactPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', topic: '1', content: ''
  });

  useEffect(() => { window.scrollTo(0, 0); }, []);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSendContact = () => {
    if (!formData.name || !formData.email || !formData.content) {
      message.warning("Vui lòng nhập đầy đủ thông tin!");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      message.success("Tin nhắn của bạn đã được gửi tới CGV!");
      setLoading(false);
      setFormData({ name: '', email: '', phone: '', topic: '1', content: '' });
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-100 to-zinc-200 pt-28 pb-16 font-sans text-zinc-800">
      
      {/* HEADER */}
      <div className="bg-gradient-to-r from-red-700 to-red-900 py-16 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <Tag color="red" className="px-5 py-1 rounded-full font-black tracking-widest border-none text-[11px] mb-4">
            CGV CUSTOMER SUPPORT
          </Tag>
          <Title level={1} className="!text-white !text-4xl md:!text-5xl !font-black uppercase">
            Liên hệ & Hỗ trợ
          </Title>
          <div className="flex flex-wrap justify-center gap-4 mt-10">
            <div className="bg-white/20 backdrop-blur-xl rounded-2xl px-6 py-4 flex items-center gap-4">
              <PhoneOutlined className="text-white text-2xl" />
              <div className="text-left">
                <p className="text-white/70 text-[10px] uppercase font-bold">Hotline 24/7</p>
                <p className="font-black text-white text-xl">1900 6017</p>
              </div>
            </div>
            <div className="bg-white/20 backdrop-blur-xl rounded-2xl px-6 py-4 flex items-center gap-4">
              <MailOutlined className="text-yellow-300 text-2xl" />
              <div className="text-left">
                <p className="text-white/70 text-[10px] uppercase font-bold">Email CSKH</p>
                <p className="font-black text-white">hoidap@cgv.vn</p>
              </div>
            </div>
            <div className="bg-white/20 backdrop-blur-xl rounded-2xl px-6 py-4 flex items-center gap-4">
              <ClockCircleOutlined className="text-green-300 text-2xl" />
              <div className="text-left">
                <p className="text-white/70 text-[10px] uppercase font-bold">Giờ hoạt động</p>
                <p className="font-black text-white">08:00 - 22:00</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 -mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* LEFT - FORM */}
          <div className="lg:col-span-7">
            <Card className="!bg-white rounded-3xl shadow-2xl" styles={{ body: { padding: 40 } }}>
              <div className="flex items-center gap-4 mb-8">
                <div className="w-2 h-12 bg-red-600 rounded-full"></div>
                <Title level={3} className="!text-zinc-800 !m-0 !font-black uppercase">
                  Gửi phản hồi
                </Title>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <Text className="text-zinc-600 uppercase text-[11px] font-black block mb-3">Họ tên *</Text>
                  <Input size="large" placeholder="Nhập họ tên" value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className="!bg-zinc-50 !border-zinc-200 rounded-xl h-14" />
                </div>
                <div>
                  <Text className="text-zinc-600 uppercase text-[11px] font-black block mb-3">Email *</Text>
                  <Input size="large" placeholder="email@gmail.com" value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="!bg-zinc-50 !border-zinc-200 rounded-xl h-14" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <Text className="text-zinc-600 uppercase text-[11px] font-black block mb-3">Điện thoại</Text>
                  <Input size="large" placeholder="0xxx xxx xxx" value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className="!bg-zinc-50 !border-zinc-200 rounded-xl h-14" />
                </div>
                <div>
                  <Text className="text-zinc-600 uppercase text-[11px] font-black block mb-3">Chủ đề *</Text>
                  <Select size="large" value={formData.topic} onChange={(v) => handleInputChange('topic', v)} className="w-full">
                    <Option value="1">Góp ý chất lượng dịch vụ</Option>
                    <Option value="2">Phản hồi cơ sở vật chất</Option>
                    <Option value="3">Hỗ trợ thẻ thành viên</Option>
                    <Option value="4">Hợp tác quảng cáo</Option>
                    <Option value="5">Vấn đề khác</Option>
                  </Select>
                </div>
              </div>

              <div className="mb-8">
                <Text className="text-zinc-600 uppercase text-[11px] font-black block mb-3">Nội dung *</Text>
                <TextArea rows={6} placeholder="Nhập nội dung phản hồi..." value={formData.content}
                  onChange={(e) => handleInputChange('content', e.target.value)}
                  className="!bg-zinc-50 !border-zinc-200 rounded-xl" />
              </div>

              <Button type="primary" block size="large" loading={loading} icon={<SendOutlined />}
                onClick={handleSendContact}
                className="h-14 !rounded-xl !bg-red-600 hover:!bg-red-700 font-bold uppercase">
                Gửi phản hồi
              </Button>
            </Card>
          </div>

          {/* RIGHT - INFO */}
          <div className="lg:col-span-5 space-y-6">
            <Card className="!bg-white rounded-3xl shadow-xl">
              <div className="p-8">
                <div className="flex justify-between mb-6">
                  <Title level={4} className="!text-zinc-800 !font-black uppercase">Trung tâm hỗ trợ</Title>
                  <Tag color="red" className="font-bold">ONLINE 24/7</Tag>
                </div>

                <div className="space-y-4">
                  <div className="bg-red-50 rounded-2xl p-5 flex gap-4">
                    <div className="w-14 h-14 rounded-xl bg-red-600 flex items-center justify-center text-xl text-white">
                      <PhoneOutlined />
                    </div>
                    <div>
                      <p className="text-zinc-500 text-[10px] font-bold">Hotline</p>
                      <h3 className="text-2xl font-black">1900 6017</h3>
                    </div>
                  </div>
                  <div className="bg-yellow-50 rounded-2xl p-5 flex gap-4">
                    <div className="w-14 h-14 rounded-xl bg-yellow-500 flex items-center justify-center text-xl text-white">
                      <MailOutlined />
                    </div>
                    <div>
                      <p className="text-zinc-500 text-[10px] font-bold">Email</p>
                      <h3 className="text-lg font-black">hoidap@cgv.vn</h3>
                    </div>
                  </div>
                  <div className="bg-green-50 rounded-2xl p-5 flex gap-4">
                    <div className="w-14 h-14 rounded-xl bg-green-600 flex items-center justify-center text-xl text-white">
                      <ClockCircleOutlined />
                    </div>
                    <div>
                      <p className="text-zinc-500 text-[10px] font-bold">Giờ hoạt động</p>
                      <h3 className="text-lg font-black">08:00 - 22:00</h3>
                    </div>
                  </div>
                </div>

                <Divider />

                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-zinc-400 text-[10px] font-bold">Theo dõi CGV</p>
                    <h4 className="font-black">Mạng xã hội</h4>
                  </div>
                  <div className="flex gap-2">
                    <Button shape="circle" icon={<FacebookFilled />} className="!bg-blue-600 !border-none !w-10 !h-10" />
                    <Button shape="circle" icon={<InstagramFilled />} className="!bg-gradient-to-r !from-purple-600 !to-pink-500 !border-none !w-10 !h-10" />
                    <Button shape="circle" icon={<YoutubeFilled />} className="!bg-red-600 !border-none !w-10 !h-10" />
                  </div>
                </div>
              </div>
            </Card>

            {/* MAP */}
            <Card className="!bg-white rounded-3xl shadow-xl">
              <div className="p-5 border-b border-zinc-100 flex justify-between">
                <div>
                  <Text className="text-zinc-400 text-[10px] font-bold">Trụ sở</Text>
                  <h3 className="text-lg font-black">AEON MALL HẢI PHÒNG</h3>
                </div>
                <Tag color="red" className="font-bold">PREMIUM</Tag>
              </div>
              <div className="h-64">
                <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3728.5134707172087!2d106.69469737596001!3d20.851416993836332!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x314a7af2796191b5%3A0x6335a11c8152e0f4!2sCGV%20Aeon%20Mall%20H%E1%BA%A3i%20Ph%C3%B2ng!5e0!3m2!1svi!2s!4v1715492000000!5m2!1svi!2s" 
                  width="100%" height="100%" style={{border:0}} allowFullScreen loading="lazy" />
              </div>
              <div className="p-5 flex gap-3">
                <EnvironmentOutlined className="text-red-500 text-xl" />
                <div>
                  <h4 className="font-black">Tầng 3, AEON Mall Hải Phòng</h4>
                  <p className="text-zinc-500 text-sm">Số 10 Võ Nguyên Giáp, Lê Chân, Hải Phòng</p>
                </div>
              </div>
            </Card>

            {/* FEATURES */}
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-3xl bg-gradient-to-br from-red-600 to-red-700 p-6 shadow-lg">
                <FireOutlined className="text-3xl text-white mb-3" />
                <h3 className="text-white font-black">Hỗ trợ nhanh</h3>
                <p className="text-red-100 text-xs mt-2">Phản hồi trong 24h</p>
              </div>
              <div className="rounded-3xl bg-gradient-to-br from-zinc-800 to-black p-6">
                <SafetyCertificateOutlined className="text-3xl text-yellow-400 mb-3" />
                <h3 className="text-white font-black">Bảo mật</h3>
                <p className="text-zinc-400 text-xs mt-2">Thông tin an toàn</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <AIChatBot />
    </div>
  );
};

export default ContactPage;