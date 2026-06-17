/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect } from 'react';
import { Typography, Card, Avatar, Tag, Divider, Button, Timeline, Breadcrumb } from 'antd';
import { 
  UserOutlined, EnvironmentOutlined, PhoneOutlined, 
  MailOutlined, GlobalOutlined, LinkedinFilled, 
  SafetyCertificateFilled, TrophyFilled, RocketFilled,
  TeamOutlined
} from '@ant-design/icons';
import AIChatBot from '../components/AIChatBot';

const { Title, Text, Paragraph } = Typography;

const ProfileInfoPage: React.FC = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-100 to-white pt-28 pb-16 font-sans text-zinc-800">
      
      {/* Breadcrumb */}
      <div className="max-w-6xl mx-auto px-4 mb-6">
        <Breadcrumb
          items={[
            { title: <span className="text-zinc-400 text-xs font-bold uppercase">Trang chủ</span> },
            { title: <span className="text-red-600 text-xs font-bold uppercase">Thông tin</span> },
          ]}
        />
      </div>

      {/* PROFILE HEADER - Trắng sạch */}
      <div className="max-w-6xl mx-auto px-4">
        <div className="bg-white shadow-xl rounded-3xl overflow-hidden mb-8">
          {/* Cover */}
          <div className="h-48 bg-gradient-to-r from-red-700 to-red-900 relative">
            <div className="absolute inset-0 opacity-30">
              <div className="absolute top-8 left-20 w-32 h-32 bg-white/30 rounded-full blur-3xl"></div>
            </div>
            <div className="absolute -bottom-16 left-10 p-1 bg-white rounded-full shadow-2xl">
              <Avatar 
                size={140} 
                src="https://cdn.brvn.vn/editor_news/2015/04/cgv_6597.jpg"
                icon={<UserOutlined />} 
                className="border-4 border-white"
              />
            </div>
          </div>
          
          {/* Info */}
          <div className="pt-20 pb-8 px-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <Title level={1} className="!m-0 !font-black uppercase tracking-tighter text-3xl">
                  Mr. Dong Won Kwak
                </Title>
                <SafetyCertificateFilled className="text-blue-500 text-xl" />
              </div>
              <Text className="text-red-600 font-bold uppercase tracking-widest text-xs">
                Tổng giám đốc CGV
              </Text>
              <div className="flex gap-2 mt-4">
                <Tag color="red" icon={<EnvironmentOutlined />} className="font-bold">Hải Phòng</Tag>
                <Tag icon={<GlobalOutlined />} className="font-bold">CGV Vietnam</Tag>
              </div>
            </div>
            <div className="flex gap-3">
              <Button type="primary" danger icon={<LinkedinFilled />} className="rounded-full font-bold">
                Kết nối
              </Button>
              <Button icon={<MailOutlined />} className="rounded-full" />
              <Button icon={<PhoneOutlined />} className="rounded-full" />
            </div>
          </div>
        </div>

        {/* MAIN GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* LEFT - Contact & Skills */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="rounded-2xl shadow-lg" title={
              <Text className="font-black uppercase text-sm">Liên hệ</Text>
            }>
              <div className="space-y-4">
                <div className="flex items-center gap-4 p-3 bg-zinc-50 rounded-xl">
                  <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center text-red-600">
                    <PhoneOutlined />
                  </div>
                  <div>
                    <Text className="text-xs text-zinc-400 font-bold uppercase">Hotline</Text>
                    <Text className="font-bold block">1900 6017</Text>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-3 bg-zinc-50 rounded-xl">
                  <div className="w-10 h-10 rounded-lg bg-yellow-100 flex items-center justify-center text-yellow-600">
                    <MailOutlined />
                  </div>
                  <div>
                    <Text className="text-xs text-zinc-400 font-bold uppercase">Email</Text>
                    <Text className="font-bold block">cskh@cgv.vn</Text>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-3 bg-zinc-50 rounded-xl">
                  <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center text-green-600">
                    <EnvironmentOutlined />
                  </div>
                  <div>
                    <Text className="text-xs text-zinc-400 font-bold uppercase">Văn phòng</Text>
                    <Text className="font-bold block">Aeon Mall Hải Phòng</Text>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="rounded-2xl shadow-lg" title={
              <Text className="font-black uppercase text-sm">Chuyên môn</Text>
            }>
              <div className="flex flex-wrap gap-2">
                {['Quản lý rạp', 'Dịch vụ KH', 'Marketing', 'Vận hành', 'Phân tích'].map(skill => (
                  <Tag key={skill} className="bg-zinc-100 border-0 rounded-lg px-3 py-1">
                    {skill}
                  </Tag>
                ))}
              </div>
            </Card>

            <Card className="rounded-2xl shadow-lg" title={
              <Text className="font-black uppercase text-sm">Thành tựu</Text>
            }>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-xl">
                  <div className="flex items-center gap-2">
                    <TrophyFilled className="text-yellow-500" />
                    <Text className="font-bold">Top 1</Text>
                  </div>
                  <Text className="text-xs text-zinc-400">Việt Nam</Text>
                </div>
                <div className="flex items-center justify-between p-3 bg-red-50 rounded-xl">
                  <div className="flex items-center gap-2">
                    <RocketFilled className="text-red-500" />
                    <Text className="font-bold">80+</Text>
                  </div>
                  <Text className="text-xs text-zinc-400">Cụm rạp</Text>
                </div>
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-xl">
                  <div className="flex items-center gap-2">
                    <TeamOutlined className="text-blue-500" />
                    <Text className="font-bold">15M+</Text>
                  </div>
                  <Text className="text-xs text-zinc-400">Thành viên</Text>
                </div>
              </div>
            </Card>
          </div>

          {/* RIGHT - About & Timeline */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="rounded-2xl shadow-lg" title={
              <Text className="font-black uppercase text-sm">Về chúng tôi</Text>
            }>
              <Paragraph className="text-zinc-600 leading-relaxed">
                
CGV là một trong năm Cụm Rạp Chiếu Phim lớn nhất toàn cầu và CGV Việt Nam là Nhà Phát Hành, nhà quản lý và vận hành Cụm Rạp Chiếu Phim CGV Cinemas lớn nhất tại Việt Nam. Mục tiêu của CGV Việt Nam là trở thành công ty giải trí điển hình, đóng góp cho sự phát triển không ngừng của lĩnh vực điện ảnh Việt Nam nói riêng và công nghiệp văn hóa mang đậm bản sắc Việt Nam nói chung.
CGV Việt Nam trên hành trình mang điện ảnh đến mọi miền Tổ quốc, cũng tập trung đến đối tượng khán giả ở các khu vực ít có điều kiện tiếp cận với điện ảnh, bằng cách tạo cơ hội để người dân địa phương có thể thưởng thức những tác phẩm điện ảnh chất lượng thông qua các chương trình vì cộng đồng như Trăng cười và Điện ảnh cho mọi người.

CGV Việt Nam cam kết nỗ lực, tiếp tục cuộc hành trình bền bỉ trong việc góp phần xây dựng một nền công nghiệp điện ảnh Việt Nam ngày càng vững mạnh cùng các khách hàng tiềm năng, các nhà làm phim, các đối tác kinh doanh uy tín, và cùng toàn thể xã hội.
              </Paragraph>
              <Divider />
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="p-4 bg-zinc-50 rounded-xl">
                  <TrophyFilled className="text-2xl text-yellow-500 mx-auto mb-2" />
                  <Title level={4} className="!m-0">TOP 1</Title>
                  <Text className="text-xs text-zinc-400 font-bold uppercase">Việt Nam</Text>
                </div>
                <div className="p-4 bg-zinc-50 rounded-xl">
                  <RocketFilled className="text-2xl text-red-500 mx-auto mb-2" />
                  <Title level={4} className="!m-0">80+</Title>
                  <Text className="text-xs text-zinc-400 font-bold uppercase">Cụm rạp</Text>
                </div>
                <div className="p-4 bg-zinc-50 rounded-xl">
                  <TeamOutlined className="text-2xl text-blue-500 mx-auto mb-2" />
                  <Title level={4} className="!m-0">15M+</Title>
                  <Text className="text-xs text-zinc-400 font-bold uppercase">Thành viên</Text>
                </div>
              </div>
            </Card>

            <Card className="rounded-2xl shadow-lg" title={
              <Text className="font-black uppercase text-sm">Lộ trình phát triển</Text>
            }>
              <Timeline
                mode="left"
                items={[
                  { 
                    label: <Text className="font-bold text-red-600">2026</Text>,
                    children: <Text strong>Nâng cấp IMAX Hải Phòng</Text>,
                    color: 'red'
                  },
                  { 
                    label: <Text className="font-bold">2024</Text>,
                    children: <Text>Mở rộng miền Bắc</Text>,
                  },
                  { 
                    label: <Text className="font-bold">2022</Text>,
                    children: <Text>10 triệu thành viên</Text>,
                  },
                  { 
                    label: <Text className="font-bold">2011</Text>,
                    children: <Text>Ra mắt Việt Nam</Text>,
                  },
                ]}
              />
            </Card>
          </div>
        </div>

        {/* MAP */}
        <div className="mt-8">
          <Card className="rounded-2xl shadow-lg" title={
            <div className="flex items-center gap-2">
              <EnvironmentOutlined className="text-red-600" />
              <Text className="font-black uppercase text-sm">Địa điểm làm việc</Text>
            </div>
          }>
            <div className="h-72 rounded-xl overflow-hidden">
              <iframe 
                title="Location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3728.8955146524316!2d106.69244677502604!3d20.835973780766345!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x314a7be683353597%3A0xc48c1f01c7d3c01a!2sCGV%20Aeon%20Mall%20H%E1%BA%A3i%20Ph%C3%B2ng!5e0!3m2!1svi!2svn!4v1715500000000!5m2!1svi!2svn" 
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                allowFullScreen 
                loading="lazy"
              />
            </div>
          </Card>
        </div>

      </div>
      <AIChatBot />
    </div>
  );
};

export default ProfileInfoPage;