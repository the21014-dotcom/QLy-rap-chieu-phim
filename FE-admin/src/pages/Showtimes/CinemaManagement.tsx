import React, { useState, useEffect } from 'react';
import { 
  Table, Button, Card, Space, Modal, Form, Input, 
  Select, message, Popconfirm, Tag, Typography, Tooltip, Badge 
} from 'antd';
import { 
  PlusOutlined, EditOutlined, DeleteOutlined, 
  BankOutlined, EnvironmentOutlined, PhoneOutlined,
  SearchOutlined, ReloadOutlined
} from '@ant-design/icons';
import { cinemaService } from '../../services/cinemaService';
/* eslint-disable @typescript-eslint/no-explicit-any */
const { Title, Text } = Typography;

const CinemaManagement: React.FC = () => {
  const [form] = Form.useForm();
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [searchText, setSearchText] = useState('');

  // Tải danh sách rạp (Backend đã bao gồm include rooms và _count)
  const fetchCinemas = async () => {
    setLoading(true);
    try {
      const res: any = await cinemaService.getAll();
      setData(res.data.data || []); // Truy xuất vào thuộc tính data của NestJS trả về
    } catch (error) {
         console .error("Fetch Cinemas Error:", error);
      message.error("Lỗi kết nối máy chủ khi tải danh sách rạp");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCinemas(); }, []);

  const handleSave = async (values: any) => {
    try {
      if (editingItem) {
        await cinemaService.update(editingItem.id, values);
        message.success("Cập nhật cụm rạp thành công");
      } else {
        await cinemaService.create(values);
        message.success("Thêm mới cụm rạp thành công");
      }
      setIsModalOpen(false);
      fetchCinemas();
    } catch (error: any) {
      message.error(error.response?.data?.message || "Thao tác thất bại");
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await cinemaService.delete(id);
      message.success("Đã xóa rạp khỏi hệ thống");
      fetchCinemas();
    } catch (error) {
        console .error("Delete Cinema Error:", error);
      message.error("Không thể xóa rạp (Rạp đang có phòng chiếu hoặc lịch chiếu)");
    }
  };

  const columns = [
    {
      title: 'THÔNG TIN CỤM RẠP',
      key: 'cinemaInfo',
      render: (_: any, record: any) => (
        <Space size="middle">
          <div className="p-3 bg-slate-100 rounded-lg text-blue-600">
            <BankOutlined style={{ fontSize: '20px' }} />
          </div>
          <div className="flex flex-col">
            <Text className="font-bold text-base text-slate-800">{record.name}</Text>
            <Space className="text-[12px] text-slate-400">
              <span><PhoneOutlined /> {record.hotline || 'N/A'}</span>
            </Space>
          </div>
        </Space>
      )
    },
    {
      title: 'KHU VỰC',
      dataIndex: 'city',
      key: 'city',
      render: (city: string) => (
        <Tag color="geekblue" className="font-bold border-none px-3 py-1 rounded-full uppercase">
          {city}
        </Tag>
      )
    },
    {
      title: 'ĐỊA CHỈ',
      dataIndex: 'address',
      key: 'address',
      width: '30%',
      render: (address: string) => (
        <Tooltip title={address}>
          <Text type="secondary" italic ellipsis={{ suffix: '...' }} className="max-w-[300px] block">
            <EnvironmentOutlined className="mr-1" /> {address}
          </Text>
        </Tooltip>
      )
    },
    {
      title: 'PHÒNG CHIẾU',
      key: 'rooms',
      align: 'center' as const,
      render: (_: any, record: any) => (
        <Badge 
          count={record._count?.rooms || 0} 
          showZero 
          color="#faad14" 
          overflowCount={99}
          className="font-bold"
        />
      )
    },
    {
      title: 'HÀNH ĐỘNG',
      key: 'action',
      align: 'right' as const,
      render: (_: any, record: any) => (
        <Space>
          <Button 
            type="primary"
            ghost
            icon={<EditOutlined />} 
            onClick={() => {
              setEditingItem(record);
              form.setFieldsValue(record);
              setIsModalOpen(true);
            }}
          > Sửa </Button>
          <Popconfirm
            title="Xác nhận xóa rạp?"
            description="Tất cả dữ liệu phòng chiếu liên quan sẽ bị xóa sạch."
            onConfirm={() => handleDelete(record.id)}
            okButtonProps={{ danger: true, loading }}
            okText="Xóa dữ liệu"
          >
            <Button danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const filteredData = data.filter(item => 
    item.name.toLowerCase().includes(searchText.toLowerCase()) || 
    item.city?.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <div className="p-6 bg-slate-50 min-h-screen">
      <Card 
        className="shadow-xl border-none rounded-2xl"
        title={
          <div className="flex items-center gap-4 py-3">
            <div className="w-2 h-10 bg-red-600 rounded-full"></div>
            <div>
              <Title level={3} className="m-0 uppercase tracking-tighter">Hệ thống Cụm Rạp</Title>
              <Text type="secondary" className="text-[11px] font-bold uppercase tracking-widest text-slate-400">
                Cinema Network Administration
              </Text>
            </div>
          </div>
        }
        extra={
          <Space>
            <Button icon={<ReloadOutlined />} onClick={fetchCinemas} />
            <Button 
              type="primary" 
              danger 
              size="large"
              icon={<PlusOutlined />} 
              className="h-12 px-6 font-bold rounded-xl shadow-lg shadow-red-100"
              onClick={() => {
                setEditingItem(null);
                form.resetFields();
                setIsModalOpen(true);
              }}
            >
              THÊM CỤM RẠP MỚI
            </Button>
          </Space>
        }
      >
        <div className="mb-6">
          <Input 
            prefix={<SearchOutlined className="text-slate-300" />}
            placeholder="Tìm kiếm rạp theo tên hoặc thành phố..." 
            size="large"
            className="max-w-md rounded-xl border-slate-200 bg-slate-50"
            onChange={(e) => setSearchText(e.target.value)}
            allowClear
          />
        </div>

        <Table 
          columns={columns} 
          dataSource={filteredData} 
          rowKey="id" 
          loading={loading}
          pagination={{ pageSize: 8, showTotal: (t) => `Tổng số ${t} cụm rạp` }}
          className="border border-slate-100 rounded-xl overflow-hidden"
        />
      </Card>

      {/* Modal CRUD - Khớp 100% CreateCinemaDto */}
      <Modal
        title={
          <div className="flex flex-col gap-1 mb-4">
             <Text className="text-xs font-black text-red-500 uppercase tracking-widest">Cinema Form</Text>
             <Title level={4} className="m-0 uppercase italic">{editingItem ? 'Cập nhật rạp' : 'Đăng ký rạp mới'}</Title>
          </div>
        }
        open={isModalOpen}
        onOk={() => form.submit()}
        onCancel={() => setIsModalOpen(false)}
        okText={editingItem ? "LƯU THAY ĐỔI" : "TẠO RẠP MỚI"}
        cancelText="HỦY BỎ"
        width={650}
        destroyOnClose
        okButtonProps={{ className: 'h-11 px-8 rounded-lg font-bold bg-red-600' }}
        cancelButtonProps={{ className: 'h-11 px-8 rounded-lg' }}
      >
        <Form form={form} layout="vertical" onFinish={handleSave} className="mt-4">
          <Form.Item
            name="name"
            label={<Text className="font-bold text-slate-600 uppercase text-[11px]">Tên thương hiệu cụm rạp</Text>}
            rules={[{ required: true, message: 'Tên rạp là bắt buộc' }]}
          >
            <Input placeholder="Ví dụ: CGV Vincom Bà Triệu" size="large" className="rounded-lg" />
          </Form.Item>

          <div className="grid grid-cols-2 gap-4">
            <Form.Item
              name="city"
              label={<Text className="font-bold text-slate-600 uppercase text-[11px]">Thành phố</Text>}
              rules={[{ required: true, message: 'Vui lòng chọn thành phố' }]}
            >
              <Select placeholder="Chọn khu vực" size="large" className="rounded-lg">
                <Select.Option value="Hồ Chí Minh">Hồ Chí Minh</Select.Option>
                <Select.Option value="Hà Nội">Hà Nội</Select.Option>
                <Select.Option value="Đà Nẵng">Đà Nẵng</Select.Option>
                <Select.Option value="Hải Phòng">Hải Phòng</Select.Option>
                <Select.Option value="Cần Thơ">Cần Thơ</Select.Option>
              </Select>
            </Form.Item>

            <Form.Item
              name="hotline"
              label={<Text className="font-bold text-slate-600 uppercase text-[11px]">Hotline liên hệ</Text>}
            >
              <Input placeholder="Số điện thoại rạp" size="large" className="rounded-lg" />
            </Form.Item>
          </div>

          <Form.Item
            name="address"
            label={<Text className="font-bold text-slate-600 uppercase text-[11px]">Địa chỉ chi tiết (Dùng cho Google Maps)</Text>}
            rules={[{ required: true, message: 'Địa chỉ không được để trống' }]}
          >
            <Input.TextArea 
              rows={3} 
              placeholder="Nhập địa chỉ chính xác để khách hàng dễ tìm kiếm..." 
              className="rounded-lg"
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default CinemaManagement;