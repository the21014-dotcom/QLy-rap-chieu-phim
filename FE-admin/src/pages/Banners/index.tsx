/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect, useCallback } from 'react';
import { 
  Table, Button, Card, Switch, Image, Space, Tag, Modal, 
  Form, Input, InputNumber, Select, message, DatePicker, 
 Popconfirm, Row, Col, Badge, Typography, Upload, Radio
} from 'antd';
import { 
  PlusOutlined, EditOutlined, DeleteOutlined, PictureOutlined, 
  LinkOutlined, CalendarOutlined,  SwapOutlined,
  UploadOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';
import { bannerService } from '../../services/bannerService';
import type { Banner } from '../../types/banners';
import { BASE_URL } from '../../constants/config';

const { RangePicker } = DatePicker;
const { Text } = Typography;

const BannerManagement: React.FC = () => {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null);
  const [imageSource, setImageSource] = useState<'url' | 'file'>('file');
  const [fileList, setFileList] = useState<any[]>([]);
  const [form] = Form.useForm();

  // 1. Load dữ liệu từ API
  const loadBanners = useCallback(async () => {
    setLoading(true);
    try {
      const response: any = await bannerService.getAll();
      const rawData = response.data?.data || response.data || response; 
      setBanners(Array.isArray(rawData) ? rawData : []);
    } catch { 
      message.error('Không thể tải dữ liệu banner');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadBanners(); }, [loadBanners]);

  // 2. Xử lý Lưu (Create/Update)
  const handleSave = async (values: any) => {
    const formData = new FormData();
    
    // Xử lý Ảnh
    if (imageSource === 'file' && fileList.length > 0) {
      // Trường hợp tải file mới từ máy
      if (fileList[0].originFileObj) {
        formData.append('image', fileList[0].originFileObj);
      } else {
        // Trường hợp sửa nhưng giữ nguyên ảnh cũ (đã là file trên server)
        formData.append('image_url', editingBanner?.image_url || '');
      }
    } else {
      // Trường hợp dùng Link URL
      formData.append('image_url', values.image_url || '');
    }

    // Map các trường còn lại khớp Backend
    formData.append('title', values.title || '');
    formData.append('priority', String(values.priority || 0));
    formData.append('is_active', String(values.is_active));
    formData.append('type', values.type);
    formData.append('position', values.position);
    formData.append('target_link', values.target_link || '');
    
    if (values.movie_id) {
      formData.append('movie_id', String(values.movie_id));
    }

    if (values.duration && values.duration.length === 2) {
      formData.append('start_date', values.duration[0].toISOString());
      formData.append('end_date', values.duration[1].toISOString());
    }

    setLoading(true);
    try {
      if (editingBanner) {
        await bannerService.update(editingBanner.id.toString(), formData);
        message.success('Cập nhật banner thành công');
      } else {
        await bannerService.create(formData);
        message.success('Thêm banner mới thành công');
      }
      setIsModalOpen(false);
      resetModal();
      loadBanners();
    } catch (error: any) {
      message.error('Lỗi: ' + (error.response?.data?.message || 'Không thể lưu'));
    } finally {
      setLoading(false);
    }
  };

  const resetModal = () => {
    setEditingBanner(null);
    setFileList([]);
    setImageSource('file');
    form.resetFields();
  };

  const handleDelete = async (id: number) => {
    try {
      await bannerService.delete(id.toString());
      message.success('Đã xóa banner');
      loadBanners();
    } catch (error: any) {
      message.error('Xóa thất bại: ' + (error.response?.data?.message || 'Lỗi kết nối'));
    }
  };

  const columns = [
    {
      title: 'Banner',
      dataIndex: 'image_url',
      key: 'image_url',
      width: 240,
      render: (url: string, record: Banner) => {
        const fullUrl = url?.startsWith('http') ? url : `${BASE_URL}${url}`;
        return (
          <div style={{ position: 'relative', width: 220, height: 90 }}>
            <Image 
              src={fullUrl} 
              alt={record.title}
              style={{ borderRadius: '8px', objectFit: 'cover', border: '1px solid #f0f0f0' }}
              width={220} height={90}
              fallback="https://via.placeholder.com/220x90?text=No+Image"
            />
            <div style={{ position: 'absolute', top: 5, left: 5 }}>
              <Tag color={record.type === 'MOVIE' ? 'volcano' : 'green'} style={{ fontSize: '10px' }}>
                {record.type}
              </Tag>
            </div>
          </div>
        );
      },
    },
    {
      title: 'Thông tin hiển thị',
      key: 'content',
      render: (_: any, record: Banner) => (
        <Space direction="vertical" size={0}>
          <Text strong style={{ textTransform: 'uppercase' }}>{record.title}</Text>
          <Text type="secondary" style={{ fontSize: '12px' }}>
            <LinkOutlined /> {record.target_link || 'Link nội bộ'}
          </Text>
          <Space size="small" style={{ marginTop: 4 }}>
            <Tag icon={<SwapOutlined />} color="blue">{record.position}</Tag>
            <Tag icon={<CalendarOutlined />}>
              {record.start_date ? dayjs(record.start_date).format('DD/MM') : 'Start'} - 
              {record.end_date ? dayjs(record.end_date).format('DD/MM') : 'End'}
            </Tag>
          </Space>
        </Space>
      ),
    },
    {
      title: 'Độ ưu tiên',
      dataIndex: 'priority',
      key: 'priority',
      align: 'center' as const,
      sorter: (a: Banner, b: Banner) => (a.priority || 0) - (b.priority || 0),
      render: (val: number) => <Badge count={val} showZero color="#faad14" />
    },
    {
      title: 'Trạng thái',
      dataIndex: 'is_active',
      key: 'is_active',
      align: 'center' as const,
      render: (active: boolean, record: Banner) => (
        <Switch 
          checked={active} 
          size="small"
          onChange={async (val) => {
            try {
              await bannerService.update(record.id.toString(), { is_active: val });
              message.success('Đã cập nhật trạng thái');
              loadBanners();
            } catch { message.error('Lỗi cập nhật'); }
          }} 
        />
      ),
    },
    {
      title: 'Hành động',
      key: 'action',
      align: 'right' as const,
      render: (_: any, record: Banner) => (
        <Space>
          <Button 
            type="text" 
            icon={<EditOutlined />} 
            onClick={() => { 
              setEditingBanner(record);
              setImageSource(record.image_url?.startsWith('/uploads') ? 'file' : 'url');
              setIsModalOpen(true); 
              form.setFieldsValue({
                ...record,
                duration: record.start_date && record.end_date ? [dayjs(record.start_date), dayjs(record.end_date)] : null
              }); 
            }} 
          />
          <Popconfirm title="Xóa banner này?" onConfirm={() => handleDelete(record.id)} okText="Xóa" cancelText="Hủy" okButtonProps={{ danger: true }}>
            <Button type="text" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <Card 
      title={<Space><PictureOutlined /> <span>QUẢN LÝ BANNER & SLIDER</span></Space>}
      extra={<Button type="primary" danger icon={<PlusOutlined />} onClick={() => { resetModal(); setIsModalOpen(true); }}>THÊM MỚI</Button>}
    >
      <Table columns={columns} dataSource={banners} rowKey="id" loading={loading} pagination={{ pageSize: 6 }} />

      <Modal
        title={editingBanner ? "CHỈNH SỬA BANNER" : "THÊM BANNER MỚI"}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={() => form.submit()}
        width={700}
        confirmLoading={loading}
      >
        <Form form={form} layout="vertical" onFinish={handleSave}>
          <Row gutter={16}>
            <Col span={16}><Form.Item name="title" label="Tiêu đề Banner" rules={[{ required: true }]}><Input /></Form.Item></Col>
            <Col span={8}>
              <Form.Item name="type" label="Loại" rules={[{ required: true }]}>
                <Select>
                  <Select.Option value="MOVIE">PHIM</Select.Option>
                  <Select.Option value="PROMOTION">KHUYẾN MÃI</Select.Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item label="Nguồn hình ảnh">
            <Radio.Group value={imageSource} onChange={(e) => setImageSource(e.target.value)}>
              <Radio value="file">Tải lên từ máy</Radio>
              <Radio value="url">Link URL</Radio>
            </Radio.Group>
          </Form.Item>

          {imageSource === 'file' ? (
            <Form.Item label="Chọn file ảnh">
              <Upload
                listType="picture"
                maxCount={1}
                beforeUpload={() => false}
                fileList={fileList}
                onChange={({ fileList }) => setFileList(fileList)}
              >
                <Button icon={<UploadOutlined />}>Chọn File (JPG/PNG)</Button>
              </Upload>
            </Form.Item>
          ) : (
            <Form.Item name="image_url" label="Nhập URL ảnh" rules={[{ required: true }]}>
              <Input prefix={<LinkOutlined />} />
            </Form.Item>
          )}

          <Row gutter={16}>
            <Col span={12}><Form.Item name="target_link" label="Đường dẫn click"><Input placeholder="/movies/123" /></Form.Item></Col>
            <Col span={12}><Form.Item name="position" label="Vị trí"><Select><Select.Option value="HOME_SLIDER">Trang chủ</Select.Option><Select.Option value="POPUP">Popup</Select.Option></Select></Form.Item></Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}><Form.Item name="duration" label="Thời hạn hiển thị"><RangePicker showTime style={{ width: '100%' }} /></Form.Item></Col>
            <Col span={6}><Form.Item name="priority" label="Ưu tiên"><InputNumber min={0} style={{ width: '100%' }} /></Form.Item></Col>
            <Col span={6}><Form.Item name="is_active" label="Kích hoạt" valuePropName="checked"><Switch /></Form.Item></Col>
          </Row>
        </Form>
      </Modal>
    </Card>
  );
};

export default BannerManagement;