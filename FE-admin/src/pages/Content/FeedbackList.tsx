import React, { useState, useEffect, useCallback } from 'react';
import { 
  Table, Tag, Space, Button, Card, Typography, 
  Rate, Popconfirm, message, Input, Select, Avatar, 
  Tooltip, Row, Col, Statistic, Modal, Form, Badge
} from 'antd';
import { 
  DeleteOutlined, SearchOutlined, UserOutlined,
  CommentOutlined, ReloadOutlined, StarFilled, 
  CheckCircleFilled, EditOutlined, PlusOutlined,
  FireFilled, NotificationOutlined
} from '@ant-design/icons';
import api from '../../services/api';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/vi';

dayjs.extend(relativeTime);
dayjs.locale('vi');

const { Title, Text } = Typography;
const { Option } = Select;
const { TextArea } = Input;

const CGV_RED = '#e71a0f';
const CGV_BLACK = '#1a1a1a';

const FeedbackList: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any[]>([]);
  const [movies, setMovies] = useState<any[]>([]);
  const [searchText, setSearchText] = useState('');
  const [ratingFilter, setRatingFilter] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [fbRes, movieRes] = await Promise.all([
        api.get('/feedbacks'),
        api.get('/movies')
      ]);
      setData(fbRes.data);
      setMovies(movieRes.data);
    } catch (err) {
      message.error('Lỗi kết nối hệ thống vé');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const openModal = (record?: any) => {
    if (record) {
      setEditingId(record.id);
      form.setFieldsValue({
        content: record.content,
        rating: record.rating,
        movie_id: record.movie?.id,
        user_id: record.user_id || record.user?.id
      });
    } else {
      setEditingId(null);
      form.resetFields();
    }
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      const payload = {
        ...values,
        movie_id: Number(values.movie_id),
        user_id: Number(values.user_id),
        rating: Number(values.rating)
      };
      
      if (editingId) {
        await api.patch(`/feedbacks/${editingId}`, payload);
        message.success('Cập nhật thành công');
      } else {
        await api.post('/feedbacks', payload);
        message.success('Đã thêm đánh giá mới');
      }
      setIsModalOpen(false);
      fetchData();
    } catch (err: any) {
      message.error(err.response?.data?.message || 'Lỗi lưu dữ liệu');
    }
  };

  const columns = [
    {
      title: 'KHÁCH HÀNG',
      dataIndex: 'user',
      key: 'user',
      width: 220, // Cố định chiều rộng để không bị đè chữ
      render: (user: any) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Avatar 
            size={40} 
            src={user?.avatar} 
            icon={<UserOutlined />} 
            style={{ border: `2px solid ${CGV_RED}`, flexShrink: 0 }}
          />
          <div style={{ overflow: 'hidden' }}>
            <Text strong style={{ fontSize: '14px', whiteSpace: 'nowrap' }}>{user?.full_name}</Text>
            <br />
            <Text type="secondary" style={{ fontSize: '11px' }} copyable>{user?.email}</Text>
          </div>
        </div>
      ),
    },
    {
      title: 'PHIM',
      dataIndex: 'movie',
      key: 'movie',
      width: 180,
      render: (movie: any) => (
        <Tag color="black" style={{ border: `1px solid ${CGV_RED}`, color: CGV_RED, fontWeight: 'bold', whiteSpace: 'normal', height: 'auto' }}>
          {movie?.title?.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: 'CHẤT LƯỢNG',
      dataIndex: 'rating',
      key: 'rating',
      width: 150,
      render: (rating: number) => <Rate disabled defaultValue={rating} style={{ fontSize: 12, color: '#fadb14' }} />,
    },
    {
      title: 'NỘI DUNG',
      dataIndex: 'content',
      key: 'content',
      width: 300,
      render: (text: string) => (
        <Text type="secondary" italic style={{ fontSize: '13px' }}>"{text}"</Text>
      )
    },
    {
      title: 'THỜI GIAN',
      dataIndex: 'created_at',
      key: 'created_at',
      width: 130,
      render: (date: string) => <Text style={{ fontSize: '12px' }}>{dayjs(date).fromNow()}</Text>,
    },
    {
      title: 'THAO TÁC',
      key: 'action',
      width: 110,
      fixed: 'right' as const,
      align: 'center' as const,
      render: (_: any, record: any) => (
        <Space>
          <Button type="text" shape="circle" icon={<EditOutlined />} onClick={() => openModal(record)} />
          <Popconfirm title="Xóa đánh giá?" onConfirm={() => api.delete(`/feedbacks/${record.id}`).then(fetchData)}>
            <Button type="text" danger shape="circle" icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: '20px', background: '#f0f2f5', minHeight: '100vh' }}>
      {/* Header Banner */}
      <Card 
        styles={{ body: { padding: '15px 25px' } }} // Thay bodyStyle cũ
        style={{ marginBottom: 20, borderRadius: 10, background: CGV_BLACK, border: 'none' }}
      >
        <Row justify="space-between" align="middle">
          <Col>
            <Title level={3} style={{ color: '#fff', margin: 0 }}>
              <CommentOutlined style={{ color: CGV_RED, marginRight: 10 }} />
              QUẢN LÝ ĐÁNH GIÁ PHIM
            </Title>
          </Col>
          <Col>
            <Button 
              danger 
              type="primary" 
              size="large" 
              icon={<PlusOutlined />} 
              onClick={() => openModal()}
              style={{ background: CGV_RED, borderRadius: 5, fontWeight: 'bold' }}
            >
              TẠO FEEDBACK MỚI
            </Button>
          </Col>
        </Row>
      </Card>

      {/* Stats */}
      <Row gutter={[16, 16]} style={{ marginBottom: 20 }}>
        <Col xs={24} sm={8}>
          <Card variant="borderless" style={{ borderRadius: 8 }}>
            <Statistic title="Tổng đánh giá" value={data.length} prefix={<NotificationOutlined />} />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card variant="borderless" style={{ borderRadius: 8 }}>
            <Statistic title="Hài lòng" value={4.8} suffix="/ 5" prefix={<StarFilled style={{ color: '#fadb14' }} />} />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card variant="borderless" style={{ borderRadius: 8 }}>
            <Statistic title="Tỷ lệ tích cực" value={92} suffix="%" prefix={<CheckCircleFilled style={{ color: '#52c41a' }} />} />
          </Card>
        </Col>
      </Row>

      {/* Table Section */}
      <Card 
        variant="borderless" // Thay bordered={false} bị lỗi thời
        style={{ borderRadius: 10, overflow: 'hidden' }}
        title={
          <Space wrap size="middle">
            <Input 
              placeholder="Tìm phim, khách hàng..." 
              prefix={<SearchOutlined />} 
              style={{ width: 250 }} 
              onChange={e => setSearchText(e.target.value)}
              allowClear
            />
            <Select placeholder="Lọc sao" style={{ width: 120 }} allowClear onChange={setRatingFilter}>
              {[5,4,3,2,1].map(s => <Option key={s} value={s}>{s} Sao</Option>)}
            </Select>
          </Space>
        }
        extra={<Button icon={<ReloadOutlined />} onClick={fetchData} />}
      >
        <div style={{ overflowX: 'auto' }}> {/* Bọc div để fix lỗi đè chữ */}
          <Table 
            columns={columns} 
            dataSource={data.filter(item => 
              item.user?.full_name?.toLowerCase().includes(searchText.toLowerCase()) || 
              item.movie?.title?.toLowerCase().includes(searchText.toLowerCase())
            )} 
            rowKey="id" 
            loading={loading}
            scroll={{ x: 1100 }} // FIX CHÍNH: Tạo thanh cuộn ngang khi màn hình hẹp
            pagination={{ pageSize: 8 }}
          />
        </div>
      </Card>

      {/* Modal */}
      <Modal
        title={editingId ? "CẬP NHẬT FEEDBACK" : "TẠO FEEDBACK MỚI"}
        open={isModalOpen}
        onOk={handleSave}
        onCancel={() => setIsModalOpen(false)}
        okText="LƯU DỮ LIỆU"
        cancelText="HỦY"
        destroyOnClose // Vẫn dùng được nhưng chú ý nếu dùng antd v5.x thì không cần thiết lắm
        width={600}
      >
        <Form form={form} layout="vertical" style={{ paddingTop: 15 }}>
          <Row gutter={16}>
            <Col span={14}>
              <Form.Item name="movie_id" label="Phim đánh giá" rules={[{ required: true }]}>
                <Select placeholder="Chọn phim">
                  {movies.map(m => <Option key={m.id} value={m.id}>{m.title}</Option>)}
                </Select>
              </Form.Item>
            </Col>
            <Col span={10}>
              <Form.Item name="user_id" label="ID User Seeding" rules={[{ required: true }]}>
                <Input type="number" />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item name="rating" label="Số sao" rules={[{ required: true }]}>
            <Rate />
          </Form.Item>
          <Form.Item name="content" label="Nội dung" rules={[{ required: true }]}>
            <TextArea rows={4} placeholder="Nhập review..." />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default FeedbackList;