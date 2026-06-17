import React, { useState, useEffect, useCallback } from 'react';
import { 
  Table, Tag, Space, Button, Card, Typography, 
  Modal, Form, Input, InputNumber, Select, DatePicker, 
  Switch, Popconfirm, message, Tooltip , Badge
} from 'antd';
import { 
  PlusOutlined, EditOutlined, DeleteOutlined, TagOutlined,
   InfoCircleOutlined 
} from '@ant-design/icons';
import api from '../../services/api';
import dayjs from 'dayjs';

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;
const { Option } = Select;

// Định nghĩa enum dựa trên Prisma Client
const DiscountType = {
  PERCENT: 'PERCENT' as const,
  FIXED: 'FIXED' as const,
};

type DiscountType = typeof DiscountType[keyof typeof DiscountType];

interface Promotion {
  id: number;
  code: string;
  description: string;
  discount_type: DiscountType;
  discount_value: number;
  min_order_value: number;
  max_discount_amount?: number;
  usage_limit: number;
  used_count: number;
  start_date: string;
  end_date: string;
  is_active: boolean;
}

const PromotionManagement: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  // 1. Fetch Data
  const fetchPromotions = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get('/promotions');
      setPromotions(res.data);
    } catch {
      message.error('Không thể tải danh sách khuyến mãi');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchPromotions(); }, [fetchPromotions]);

  // 2. Open Modal (Create/Edit)
  const openModal = (record?: Promotion) => {
    if (record) {
      setEditingId(record.id);
      form.setFieldsValue({
        ...record,
        dates: [dayjs(record.start_date), dayjs(record.end_date)]
      });
    } else {
      setEditingId(null);
      form.resetFields();
      form.setFieldsValue({ is_active: true, discount_type: DiscountType.PERCENT });
    }
    setIsModalOpen(true);
  };

  // 3. Submit Form
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const payload = {
        ...values,
        start_date: values.dates[0].toISOString(),
        end_date: values.dates[1].toISOString(),
      };
      delete payload.dates; // Xóa field ảo của DatePicker

      setLoading(true);
      if (editingId) {
        await api.patch(`/promotions/${editingId}`, payload);
        message.success('Cập nhật thành công');
      } else {
        await api.post('/promotions', payload);
        message.success('Thêm mã mới thành công');
      }
      setIsModalOpen(false);
      fetchPromotions();
    } catch (error: unknown) { 
     const errorMsg = (error as { response?: { data?: { message?: string } } }).response?.data?.message || 'Có lỗi xảy ra';
     message.error(Array.isArray(errorMsg) ? errorMsg[0] : errorMsg);
    } finally {
      setLoading(false);
    }
  };

  // 4. Delete
  const handleDelete = async (id: number) => {
    try {
      await api.delete(`/promotions/${id}`);
      message.success('Đã xóa mã khuyến mãi');
      fetchPromotions();
    } catch {
      message.error('Xóa thất bại');
    }
  };

  const columns = [
    {
      title: 'Mã Code',
      dataIndex: 'code',
      render: (code: string) => <Tag color="magenta" style={{ fontWeight: 'bold' }}>{code}</Tag>
    },
    {
      title: 'Loại giảm giá',
      dataIndex: 'discount_type',
      render: (type: DiscountType, record: Promotion) => (
        <span>
          {type === DiscountType.PERCENT ? 'Giảm %' : 'Giảm tiền mặt'}
          <br />
          <Text strong>
            {record.discount_value.toLocaleString()}
            {type === DiscountType.PERCENT ? '%' : 'đ'}
          </Text>
        </span>
      )
    },
    {
      title: 'Sử dụng',
      render: (record: Promotion) => (
        <span>
          {record.used_count} / {record.usage_limit}
          <Tooltip title={`Tối thiểu đơn: ${record.min_order_value.toLocaleString()}đ`}>
            <InfoCircleOutlined style={{ marginLeft: 8, color: '#1890ff' }} />
          </Tooltip>
        </span>
      )
    },
    {
      title: 'Thời hạn',
      render: (record: Promotion) => (
        <div style={{ fontSize: '12px' }}>
          {dayjs(record.start_date).format('DD/MM/YY')} - {dayjs(record.end_date).format('DD/MM/YY')}
        </div>
      )
    },
    {
      title: 'Trạng thái',
      dataIndex: 'is_active',
      render: (active: boolean) => (
        <Badge status={active ? 'success' : 'error'} text={active ? 'Hoạt động' : 'Tắt'} />
      )
    },
    {
      title: 'Thao tác',
      fixed: 'right' as const,
      render: (record: Promotion) => (
        <Space>
          <Button icon={<EditOutlined />} onClick={() => openModal(record)} />
          <Popconfirm title="Xóa mã này?" onConfirm={() => handleDelete(record.id)}>
            <Button danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      )
    }
  ];

  return (
    <Card>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <Title level={4}><TagOutlined /> Quản Lý Khuyến Mãi</Title>
          <Text type="secondary">Tạo mã giảm giá theo % hoặc số tiền cố định</Text>
        </div>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => openModal()}>
          Thêm mã mới
        </Button>
      </div>

      <Table 
        dataSource={promotions} 
        columns={columns} 
        rowKey="id" 
        loading={loading}
        pagination={{ pageSize: 8 }}
      />

      <Modal
        title={editingId ? 'Chỉnh sửa mã' : 'Tạo mã khuyến mãi mới'}
        open={isModalOpen}
        onOk={handleSubmit}
        onCancel={() => setIsModalOpen(false)}
        confirmLoading={loading}
        width={600}
        okText="Xác nhận"
        cancelText="Hủy"
      >
        <Form form={form} layout="vertical" style={{ marginTop: 20 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 16px' }}>
           <Form.Item 
             name="code" 
             label="Mã khuyến mãi" 
             rules={[{ required: true, message: 'Vui lòng nhập code' }]}
              >
             <Input 
             placeholder="Ví dụ: GIAM20K" 
              style={{ textTransform: 'uppercase' }} // Dùng CSS để hiển thị viết hoa
            onChange={(e) => {
      // Ép giá trị về viết hoa khi lưu vào form
      form.setFieldsValue({ code: e.target.value.toUpperCase() });
    }}
  />
</Form.Item>

            <Form.Item name="discount_type" label="Loại giảm giá" rules={[{ required: true }]}>
              <Select>
                <Option value={DiscountType.PERCENT}>Phần trăm (%)</Option>
                <Option value={DiscountType.FIXED}>Số tiền cố định (đ)</Option>
              </Select>
            </Form.Item>

            <Form.Item name="discount_value" label="Giá trị giảm" rules={[{ required: true }]}>
              <InputNumber style={{ width: '100%' }} min={0} placeholder="Ví dụ: 10 hoặc 20000" />
            </Form.Item>

            <Form.Item name="usage_limit" label="Số lượng mã" rules={[{ required: true }]}>
              <InputNumber style={{ width: '100%' }} min={1} />
            </Form.Item>
          </div>

          <Form.Item name="description" label="Mô tả" rules={[{ required: true }]}>
            <Input.TextArea rows={2} placeholder="Mô tả điều kiện sử dụng mã..." />
          </Form.Item>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 16px' }}>
            <Form.Item name="min_order_value" label="Đơn hàng tối thiểu (đ)" initialValue={0}>
              <InputNumber style={{ width: '100%' }} min={0} />
            </Form.Item>

            <Form.Item name="max_discount_amount" label="Giảm tối đa (đ)">
              <InputNumber style={{ width: '100%' }} min={0} placeholder="Chỉ áp dụng cho loại %" />
            </Form.Item>
          </div>

          <Form.Item name="dates" label="Thời gian áp dụng" rules={[{ required: true }]}>
            <RangePicker style={{ width: '100%' }} showTime format="YYYY-MM-DD HH:mm" />
          </Form.Item>

          <Form.Item name="is_active" label="Trạng thái hoạt động" valuePropName="checked">
            <Switch checkedChildren="Bật" unCheckedChildren="Tắt" />
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
};

export default PromotionManagement;