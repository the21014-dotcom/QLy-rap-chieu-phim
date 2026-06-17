/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from 'react';
import { Table, Button, Tag, Space, Card, Input, Image, Popconfirm, Tooltip, Modal, Form, Select, message } from 'antd';
import { 
  SearchOutlined, 
  NotificationOutlined, 
  EditOutlined, 
  DeleteOutlined, 
  PlusOutlined,
  EyeOutlined,
  CheckCircleOutlined,
  StopOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';
import axios from 'axios'; // Thay bằng import api from '@/utils/api' của bạn

// Đảm bảo interface này khớp 100% với Prisma Model của bạn
interface Article {
  id: string; 
  type: 'NEWS' | 'EVENT';
  title: string;
  thumbnail: string;
  content: string; // Thêm trường nội dung
  author_id?: string; 
  status: 'PUBLISHED' | 'DRAFT';
  views: number;
  publish_date: string;
}

const API_URL = 'http://localhost:8080/api/v1/articles'; // Đổi lại đúng endpoint của bạn

const NewsEvents: React.FC = () => {
  const [data, setData] = useState<Article[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [filterType, setFilterType] = useState<string>('ALL');
  const [form] = Form.useForm();

  // 1. READ: Lấy danh sách từ API
  const fetchArticles = async () => {
    setLoading(true);
    try {
      // Gắn header Authorization nếu backend yêu cầu (tránh lỗi 401 như bạn đang gặp bên API movies)
      const token = localStorage.getItem('token'); 
      const response = await axios.get(API_URL, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setData(response.data.data || response.data);
    } catch (error) {
      console.error('Lỗi khi tải dữ liệu:', error);
      message.error('Không thể tải danh sách bài viết!');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  // 2. CREATE / UPDATE: Xử lý submit Form
  const handleSave = async (values: any) => {
    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };

      if (editingId) {
        // Cập nhật
        await axios.put(`${API_URL}/${editingId}`, values, { headers });
        message.success('Cập nhật bài viết thành công!');
      } else {
        // Thêm mới
        // Set mặc định một số trường nếu cần
        const newPayload = { ...values, views: 0, publish_date: new Date().toISOString() };
        await axios.post(API_URL, newPayload, { headers });
        message.success('Tạo bài viết mới thành công!');
      }
      setIsModalVisible(false);
      form.resetFields();
      fetchArticles(); // Tải lại danh sách
    } catch (error) {
      console.error('Lỗi lưu dữ liệu:', error);
      message.error('Có lỗi xảy ra khi lưu bài viết!');
    }
  };

  // 3. DELETE: Xóa bài viết
  const handleDelete = async (id: string) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_URL}/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      message.success('Xóa bài viết thành công!');
      fetchArticles();
    } catch (error) {
      console.error('Lỗi khi xóa:', error);
      message.error('Không thể xóa bài viết này!');
    }
  };

  // Mở modal thêm mới
  const openCreateModal = () => {
    setEditingId(null);
    form.resetFields();
    form.setFieldsValue({ status: 'DRAFT', type: 'NEWS' });
    setIsModalVisible(true);
  };

  // Mở modal chỉnh sửa
  const openEditModal = (record: Article) => {
    setEditingId(record.id);
    form.setFieldsValue(record);
    setIsModalVisible(true);
  };

  // Lọc dữ liệu hiển thị trên bảng
  const filteredData = data.filter(item => {
    if (filterType === 'ALL') return true;
    return item.type === filterType;
  });

  const columns = [
    {
      title: 'Hình ảnh',
      dataIndex: 'thumbnail',
      key: 'thumbnail',
      width: 120,
      render: (src: string) => (
        <Image src={src} width={80} className="rounded shadow-sm object-cover h-12" fallback="https://via.placeholder.com/80x50" />
      )
    },
    { 
      title: 'Phân loại', 
      dataIndex: 'type', 
      key: 'type',
      render: (type: string) => (
        <Tag color={type === 'EVENT' ? 'purple' : 'blue'} className="font-bold">
          {type === 'EVENT' ? 'SỰ KIỆN' : 'TIN TỨC'}
        </Tag>
      ) 
    },
    { 
      title: 'Tiêu đề bài viết', 
      dataIndex: 'title', 
      key: 'title', 
      width: '30%',
      render: (text: string) => <b className="text-slate-700">{text}</b>
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag icon={status === 'PUBLISHED' ? <CheckCircleOutlined /> : <StopOutlined />} 
             color={status === 'PUBLISHED' ? 'success' : 'default'}>
          {status === 'PUBLISHED' ? 'ĐÃ ĐĂNG' : 'BẢN NHÁP'}
        </Tag>
      )
    },
    {
      title: 'Lượt xem',
      dataIndex: 'views',
      key: 'views',
      sorter: (a: Article, b: Article) => a.views - b.views,
      render: (v: number) => <span className="font-mono text-slate-500">{v?.toLocaleString() || 0}</span>
    },
    { 
      title: 'Ngày đăng', 
      dataIndex: 'publish_date', 
      key: 'publish_date',
      render: (date: string) => date ? dayjs(date).format('DD/MM/YYYY HH:mm') : 'N/A'
    },
    {
      title: 'Thao tác',
      key: 'action',
      align: 'right' as const,
      render: (_: any, record: Article) => (
        <Space>
          <Tooltip title="Xem trước">
            <Button type="text" icon={<EyeOutlined />} />
          </Tooltip>
          <Button type="text" className="text-blue-600" icon={<EditOutlined />} onClick={() => openEditModal(record)} />
          <Popconfirm title="Xóa bài viết này?" onConfirm={() => handleDelete(record.id)}>
            <Button type="text" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      )
    }
  ];

  return (
    <div className="space-y-4">
      <Card 
        bordered={false}
        className="shadow-sm border-t-4 border-t-red-600"
        title={
          <div className="flex items-center gap-2 text-xl font-black italic uppercase">
            <NotificationOutlined className="text-red-600" /> 
            Quản lý Tin tức & Sự kiện
          </div>
        }
        extra={
          <Button type="primary" danger icon={<PlusOutlined />} size="large" onClick={openCreateModal} className="font-bold shadow-lg shadow-red-200">
            VIẾT BÀI MỚI
          </Button>
        }
      >
        <div className="flex flex-col md:flex-row justify-between gap-4 mb-6 bg-slate-50 p-4 rounded-xl">
          <Input.Search 
            placeholder="Tìm kiếm tiêu đề hoặc nội dung..." 
            className="md:w-96"
            size="large"
            enterButton={<SearchOutlined />} 
          />
          <Space>
            <Tag color={filterType === 'ALL' ? 'red' : 'default'} onClick={() => setFilterType('ALL')} className="cursor-pointer px-3 py-1 rounded-full">Tất cả ({data.length})</Tag>
            <Tag color={filterType === 'NEWS' ? 'blue' : 'default'} onClick={() => setFilterType('NEWS')} className="cursor-pointer px-3 py-1 rounded-full">Tin tức ({data.filter(d => d.type === 'NEWS').length})</Tag>
            <Tag color={filterType === 'EVENT' ? 'purple' : 'default'} onClick={() => setFilterType('EVENT')} className="cursor-pointer px-3 py-1 rounded-full">Sự kiện ({data.filter(d => d.type === 'EVENT').length})</Tag>
          </Space>
        </div>

        <Table 
          columns={columns} 
          dataSource={filteredData} 
          rowKey="id"
          loading={loading}
          pagination={{ pageSize: 8 }}
          className="border border-slate-100 rounded-lg"
        />
      </Card>

      {/* Modal Thêm/Sửa Bài Viết */}
      <Modal
        title={editingId ? "Cập nhật bài viết" : "Viết bài mới"}
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onOk={() => form.submit()}
        okText="Lưu dữ liệu"
        cancelText="Hủy"
        width={800}
      >
        <Form form={form} layout="vertical" onFinish={handleSave}>
          <div className="grid grid-cols-2 gap-4">
            <Form.Item name="title" label="Tiêu đề" rules={[{ required: true, message: 'Vui lòng nhập tiêu đề' }]} className="col-span-2">
              <Input placeholder="Nhập tiêu đề bài viết" />
            </Form.Item>

            <Form.Item name="type" label="Phân loại" rules={[{ required: true }]}>
              <Select>
                <Select.Option value="NEWS">Tin tức</Select.Option>
                <Select.Option value="EVENT">Sự kiện</Select.Option>
              </Select>
            </Form.Item>

            <Form.Item name="status" label="Trạng thái" rules={[{ required: true }]}>
              <Select>
                <Select.Option value="PUBLISHED">Đã đăng</Select.Option>
                <Select.Option value="DRAFT">Bản nháp</Select.Option>
              </Select>
            </Form.Item>

            <Form.Item name="thumbnail" label="Link Ảnh (Thumbnail)" className="col-span-2">
              <Input placeholder="Nhập URL hình ảnh" />
            </Form.Item>
            
            {/* Nếu bạn có dùng CKEditor hay ReactQuill thì thay thẻ TextArea này */}
            <Form.Item name="content" label="Nội dung" className="col-span-2">
              <Input.TextArea rows={6} placeholder="Nhập nội dung..." />
            </Form.Item>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default NewsEvents;