import React, { useEffect, useState, useCallback } from 'react';
import { Row, Col, Card, Statistic, Typography, Table, Tag, Space, Spin, Button, message } from 'antd';
import { 
  ArrowUpOutlined, ArrowDownOutlined, 
  TagOutlined, UserAddOutlined, 
  PercentageOutlined, FireOutlined, 
  ReloadOutlined, WalletOutlined,
  HomeOutlined, PieChartOutlined
} from '@ant-design/icons';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, PieChart, Pie, Cell, Legend
} from 'recharts';
import api from '../../services/api';
import { formatCurrency } from '../../utils/format';

/* eslint-disable @typescript-eslint/no-explicit-any */
const { Title, Text } = Typography;

// Hộp chứa cấu trúc chữ của Tên Phim chống vỡ layout
const textEllipsisStyle: React.CSSProperties = {
  display: '-webkit-box',
  WebkitLineClamp: 2,
  WebkitBoxOrient: 'vertical',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'normal',
  wordBreak: 'break-word',
  lineHeight: '1.4',
  maxWidth: '240px'
};

const Dashboard: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState<any>(null);
  const [weeklyRevenue, setWeeklyRevenue] = useState<any[]>([]);
  const [topMovies, setTopMovies] = useState<any[]>([]);
  const [cinemasData, setCinemasData] = useState<any[]>([]);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [resSummary, resWeekly, resTop, resCinemas] = await Promise.all([
        api.get('/statistics/summary'),
        api.get('/statistics/revenue-weekly'),
        api.get('/statistics/top-movies'),
        api.get('/statistics/cinemas-breakdown')
      ]);
      setSummary(resSummary.data);
      setWeeklyRevenue(resWeekly.data);
      setTopMovies(resTop.data);
      setCinemasData(resCinemas.data);
    } catch (error) {
      message.error("Không thể tải dữ liệu báo cáo mới nhất");
      console.error("Lỗi báo cáo:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Hệ màu cao cấp đồng bộ CGV/Lotte Cinema (Đỏ chủ đạo - Xám khói - Than đen)
  const SYSTEM_COLORS = ['#e71a0f', '#363636', '#8c8c8c'];

  const pieData = summary ? [
    { name: 'Doanh thu Vé', value: summary.revenueByTicket || 0 },
    { name: 'Doanh thu F&B', value: summary.revenueByFood || 0 },
  ] : [];

  // 1. Cấu hình cột bảng Xếp hạng phim (Bố cục cố định width, chống tràn chữ)
  const movieColumns = [
    {
      title: 'PHIM',
      dataIndex: 'title',
      key: 'title',
      width: '45%',
      render: (text: string) => (
        <div style={textEllipsisStyle} title={text.toUpperCase()}>
          <Text strong style={{ color: '#1a1a1a', fontSize: '13px' }}>
            {text.toUpperCase()}
          </Text>
        </div>
      ),
    },
    {
      title: 'VÉ ĐÃ BÁN',
      dataIndex: 'totalTickets',
      key: 'totalTickets',
      width: '18%',
      align: 'center' as const,
      render: (val: number) => (
        <Tag color="red" style={{ borderRadius: 4, fontWeight: 500, margin: 0 }}>
          {val.toLocaleString()} vé
        </Tag>
      )
    },
    {
      title: 'DOANH THU',
      dataIndex: 'totalRevenue',
      key: 'totalRevenue',
      width: '22%',
      align: 'right' as const,
      render: (val: number) => (
        <Text strong style={{ color: '#e71a0f' }}>
          {formatCurrency(val)}
        </Text>
      )
    },
    {
      title: 'TỶ LỆ LẤP ĐẦY',
      dataIndex: 'occupancy',
      key: 'occupancy',
      width: '15%',
      align: 'right' as const,
      render: (val: number) => (
        <Space direction="vertical" style={{ width: '100%' }} size={0}>
          <Text strong style={{ color: val > 60 ? '#52c41a' : (val > 30 ? '#1890ff' : '#faad14'), fontSize: '13px' }}>
            {val}%
          </Text>
          <div style={{ height: 6, background: '#f0f0f0', borderRadius: 3, overflow: 'hidden', marginTop: 2, width: '100%' }}>
            <div 
              style={{ 
                width: `${val}%`, 
                height: '100%', 
                background: val > 60 ? 'linear-gradient(90deg, #52c41a, #73d13d)' : (val > 30 ? 'linear-gradient(90deg, #1890ff, #40a9ff)' : 'linear-gradient(90deg, #faad14, #ffc53d)'),
                transition: 'width 1s ease-in-out'
              }} 
            />
          </div>
        </Space>
      )
    },
  ];

  // 2. Cấu hình cột bảng chi tiết Cụm Rạp
  const cinemaColumns = [
    {
      title: 'CỤM RẠP',
      dataIndex: 'name',
      key: 'name',
      render: (text: string, record: any) => (
        <Space direction="vertical" size={0}>
          <Text strong style={{ color: '#1a1a1a' }}>{text}</Text>
          <Text type="secondary" style={{ fontSize: '12px' }}>{record.city}</Text>
        </Space>
      )
    },
    {
      title: 'LƯỢNG VÉ XUẤT',
      dataIndex: 'totalTickets',
      key: 'totalTickets',
      align: 'center' as const,
      render: (val: number) => <Text style={{ fontWeight: 500 }}>{val.toLocaleString()} vé</Text>
    },
    {
      title: 'DOANH THU VÉ',
      dataIndex: 'revenueByTicket',
      key: 'revenueByTicket',
      align: 'right' as const,
      render: (val: number) => formatCurrency(val)
    },
    {
      title: 'DOANH THU F&B',
      dataIndex: 'revenueByFood',
      key: 'revenueByFood',
      align: 'right' as const,
      render: (val: number) => <Text style={{ color: '#52c41a', fontWeight: 500 }}>{formatCurrency(val)}</Text>
    },
    {
      title: 'TỔNG DOANH THU',
      dataIndex: 'totalRevenue',
      key: 'totalRevenue',
      align: 'right' as const,
      render: (val: number) => <Text strong style={{ color: '#e71a0f' }}>{formatCurrency(val)}</Text>
    }
  ];

  if (loading && !summary) {
    return (
      <div style={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', background: '#f8f9fa' }}>
        <Space direction="vertical" align="center" size="middle">
          <Spin size="large" />
          <Text type="secondary" style={{ fontSize: 15, fontWeight: 500 }}>Đang phân tích hiệu năng hệ thống báo cáo...</Text>
        </Space>
      </div>
    );
  }

  return (
    <div style={{ padding: '24px', background: '#f8f9fa', minHeight: '100vh' }}>
      
      {/* SECTION 1: HEADER BANNER */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <Title level={2} style={{ margin: 0, color: '#141414', fontWeight: 700 }}>Báo Cáo Doanh Thu Toàn Hệ Thống</Title>
          <Text type="secondary" style={{ fontSize: '14px' }}>Giám sát thời gian thực chỉ số phòng vé, hiệu suất lấp đầy và nguồn thu phụ trợ</Text>
        </div>
        <Button 
          type="primary" 
          danger 
          icon={<ReloadOutlined />} 
          onClick={fetchData} 
          loading={loading}
          style={{ borderRadius: 6, fontWeight: 500, height: 40, background: '#e71a0f' }}
        >
          Làm mới dữ liệu
        </Button>
      </div>

      {/* SECTION 2: 4 THẺ SỐ LIỆU TỔNG QUAN (KPI CARDS) */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card bordered={false} style={{ borderRadius: 12, background: 'linear-gradient(135deg, #e71a0f 0%, #a3120a 100%)', boxShadow: '0 4px 15px rgba(231,26,15,0.2)' }}>
            <Statistic
              title={<Text style={{ color: 'rgba(255,255,255,0.85)', fontWeight: 500 }}>Tổng doanh thu (Vé + F&B)</Text>}
              value={summary?.totalRevenue} 
              formatter={(val) => <span style={{ color: '#fff', fontSize: '26px', fontWeight: 700 }}>{formatCurrency(Number(val))}</span>}
            />
            <div style={{ marginTop: 10 }}>
              <Tag icon={summary?.revenueGrowth >= 0 ? <ArrowUpOutlined /> : <ArrowDownOutlined />} color="white" style={{ color: summary?.revenueGrowth >= 0 ? '#52c41a' : '#ff4d4f', border: 'none', fontWeight: 600 }}>
                {Math.abs(summary?.revenueGrowth)}%
              </Tag>
              <Text style={{ color: 'rgba(255,255,255,0.75)', fontSize: '12px' }}> so với tháng trước</Text>
            </div>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card bordered={false} style={{ borderRadius: 12, boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
            <Statistic
              title={<Text type="secondary" style={{ fontWeight: 500 }}>Lượng vé đã bán</Text>}
              value={summary?.totalTickets}
              prefix={<TagOutlined style={{ color: '#e71a0f', marginRight: 6 }} />}
              valueStyle={{ color: '#141414', fontWeight: 700 }}
              formatter={(val) => `${Number(val).toLocaleString()} vé`}
            />
            <Text type="secondary" style={{ fontSize: '12px' }}>Tổng lượt khách qua rạp</Text>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card bordered={false} style={{ borderRadius: 12, boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
            <Statistic
              title={<Text type="secondary" style={{ fontWeight: 500 }}>Thành viên mới</Text>}
              value={summary?.newUsers}
              prefix={<UserAddOutlined style={{ color: '#1890ff', marginRight: 6 }} />}
              valueStyle={{ color: '#141414', fontWeight: 700 }}
              formatter={(val) => `${Number(val).toLocaleString()} user`}
            />
            <Text type="secondary" style={{ fontSize: '12px' }}>Khách hàng đăng ký mới</Text>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card bordered={false} style={{ borderRadius: 12, boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
            <Statistic
              title={<Text type="secondary" style={{ fontWeight: 500 }}>Hiệu suất lấp đầy</Text>}
              value={summary?.occupancyRate}
              precision={1}
              suffix="%"
              prefix={<PercentageOutlined style={{ color: '#faad14', marginRight: 6 }} />}
              valueStyle={{ color: '#141414', fontWeight: 700 }}
            />
            <Text type="secondary" style={{ fontSize: '12px' }}>Trung bình ghế có chủ / suất</Text>
          </Card>
        </Col>
      </Row>

      {/* SECTION 3: BIỂU ĐỒ XU HƯỚNG VÀ TỶ TRỌNG NGUỒN THU (HÀNG THỨ NHẤT) */}
      <Row gutter={[20, 20]} style={{ marginBottom: 24 }}>
        {/* Biểu đồ doanh thu 7 ngày qua */}
        <Col xs={24} lg={15}>
          <Card 
            title={<Space><WalletOutlined style={{ color: '#e71a0f' }} /><span style={{ fontWeight: 600 }}>Xu hướng phát triển doanh thu (7 ngày gần nhất)</span></Space>} 
            bordered={false} 
            style={{ borderRadius: 12, height: 440, boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}
            bodyStyle={{ padding: '24px 16px 12px 12px' }}
          >
            <ResponsiveContainer width="100%" height={340}>
              <BarChart data={weeklyRevenue} margin={{ top: 10, right: 10, left: -5, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: '#8c8c8c' }} />
                <YAxis axisLine={false} tickLine={false} tickFormatter={(v) => `${(v/1000000).toFixed(1)}M`} tick={{ fill: '#8c8c8c' }} />
                <Tooltip 
                  cursor={{ fill: 'rgba(231,26,15,0.02)' }}
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div style={{ background: '#141414', padding: '12px', borderRadius: 8, boxShadow: '0 4px 12px rgba(0,0,0,0.2)' }}>
                          <p style={{ margin: 0, color: '#a6a6a6', fontSize: '12px', marginBottom: 4 }}>Ngày {data.date}</p>
                          <p style={{ margin: 0, color: '#e71a0f', fontWeight: 'bold' }}>Doanh thu: {formatCurrency(data.revenue)}</p>
                          <p style={{ margin: 0, color: '#fff', fontSize: '12px', marginTop: 2 }}>Lượng vé: {data.ticketsSold.toLocaleString()} lượt</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="revenue" fill="url(#colorWeeklyRev)" radius={[5, 5, 0, 0]} barSize={26}>
                  <defs>
                    <linearGradient id="colorWeeklyRev" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#e71a0f" stopOpacity={0.95}/>
                      <stop offset="95%" stopColor="#a3120a" stopOpacity={0.95}/>
                    </linearGradient>
                  </defs>
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Col>

        {/* Biểu đồ tròn cơ cấu cơ cấu dịch vụ */}
        <Col xs={24} lg={9}>
          <Card 
            title={<Space><PieChartOutlined style={{ color: '#e71a0f' }} /><span style={{ fontWeight: 600 }}>Cơ cấu nguồn thu chi tiết</span></Space>} 
            bordered={false} 
            style={{ borderRadius: 12, height: 440, boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}
          >
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={68}
                  outerRadius={88}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={SYSTEM_COLORS[index % SYSTEM_COLORS.length]} stroke="none" />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                <Legend iconType="circle" verticalAlign="bottom" height={36}/>
              </PieChart>
            </ResponsiveContainer>
            <div style={{ textAlign: 'center', marginTop: 12, padding: '14px', background: '#fafafa', borderRadius: 8, border: '1px solid #f0f0f0' }}>
               <Text strong style={{ color: '#141414', display: 'block', marginBottom: 2 }}>Tỷ Lệ Bám Đuổi F&B</Text>
               <Text type="secondary" style={{ fontSize: '12px' }}>Theo dõi tỷ trọng đính kèm bắp nước trên mỗi lượt khách mua vé.</Text>
            </div>
          </Card>
        </Col>
      </Row>

      {/* SECTION 4: HIỆU NĂNG PHÂN PHỐI DOANH THU CỤM RẠP VÀ BẢNG PHIM HOT (HÀNG THỨ HAI) */}
      <Row gutter={[20, 20]} style={{ marginBottom: 24 }}>
        {/* Biểu đồ cột chồng doanh thu cụm rạp */}
        <Col xs={24} lg={12}>
          <Card 
            title={<Space><HomeOutlined style={{ color: '#e71a0f' }} /><span style={{ fontWeight: 600 }}>So sánh doanh thu giữa các cụm rạp (Vé vs F&B)</span></Space>}
            bordered={false}
            style={{ borderRadius: 12, height: 460, boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}
            bodyStyle={{ padding: '24px 16px 12px 12px' }}
          >
            <ResponsiveContainer width="100%" height={360}>
              <BarChart data={cinemasData} margin={{ top: 10, right: 10, left: -5, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11 }} />
                <YAxis axisLine={false} tickLine={false} tickFormatter={(v) => `${(v/1000000).toFixed(0)}M`} />
                <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                <Legend iconType="circle" />
                <Bar dataKey="revenueByTicket" name="Doanh thu Vé" stackId="cinemaStack" fill="#e71a0f" barSize={24} />
                <Bar dataKey="revenueByFood" name="Doanh thu F&B" stackId="cinemaStack" fill="#52c41a" radius={[4, 4, 0, 0]} barSize={24} />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Col>

        {/* Bảng danh sách phim top bán chạy nhất */}
        <Col xs={24} lg={12}>
          <Card 
            title={<Space><FireOutlined style={{ color: '#e71a0f' }} /><span style={{ fontWeight: 600 }}>BẢNG XẾP HẠNG DOANH THU THEO PHIM</span></Space>} 
            bordered={false} 
            style={{ borderRadius: 12, height: 460, boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}
            bodyStyle={{ padding: '8px 12px' }}
          >
            <Table 
              dataSource={topMovies} 
              columns={movieColumns} 
              pagination={false} 
              rowKey="id"
              scroll={{ y: 340 }}
              size="middle"
              locale={{ emptyText: 'Chưa thu thập được dữ liệu suất chiếu phim' }}
            />
          </Card>
        </Col>
      </Row>

      {/* SECTION 5: BẢNG DỮ LIỆU ĐÓNG BẰNG ĐUÔI CHI TIẾT */}
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Card 
            title={<Space><HomeOutlined style={{ color: '#e71a0f' }} /><span style={{ fontWeight: 600 }}>SỐ LIỆU DOANH THU SẢN LƯỢNG CHI TIẾT TỪNG CHI NHÁNH</span></Space>} 
            bordered={false} 
            style={{ borderRadius: 12, boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}
          >
            <Table 
              dataSource={cinemasData} 
              columns={cinemaColumns} 
              pagination={false}
              rowKey="id"
              size="large"
              locale={{ emptyText: 'Chưa có dữ liệu phân rã chi nhánh' }}
            />
          </Card>
        </Col>
      </Row>

    </div>
  );
};

export default Dashboard;