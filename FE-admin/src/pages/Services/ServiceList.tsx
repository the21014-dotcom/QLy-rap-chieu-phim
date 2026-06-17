import React, { useState, useEffect } from 'react';
import { Table, Button, Card, Space, message, Popconfirm, Image, Tag, Switch, Typography, Input } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, CoffeeOutlined, SearchOutlined } from '@ant-design/icons';
import { foodService } from '../../services/foodService';
import ServiceModal from './ServiceModal';
/* eslint-disable @typescript-eslint/no-explicit-any */

const { Text } = Typography;

const ServiceList: React.FC = () => {
  const [searchText, setSearchText] = useState('');
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any | null>(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await foodService.getAll();
      // Khớp với cấu trúc trả về { message: "...", data: [...] } của NestJS
      setData(res.data.data || res.data);
    } catch (err: any) {
      console .error("Load Services Error:", err);
      message.error("Không thể tải danh sách dịch vụ ăn uống");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);


const handleSave = async (values: any) => {
  try {
    // Chuyển đổi dữ liệu để đảm bảo an toàn trước khi gửi lên API
    const payload = {
      ...values,
      price: Number(values.price), // Đảm bảo luôn là kiểu number
      is_available: !!values.is_available, // Đảm bảo là boolean
    };

    if (editingItem) {
      await foodService.update(editingItem.id, payload);
      message.success("Cập nhật món ăn thành công!");
    } else {
      await foodService.create(payload);
      message.success("Thêm món mới vào menu thành công!");
    }
    setIsModalOpen(false);
    loadData();
  } catch (err: any) {
    // Log lỗi chi tiết để kiểm tra trường nào bị thiếu
    console.error("Save Error Detail:", err.response?.data);
    message.error(err.response?.data?.message || "Lỗi lưu dữ liệu!"); 
  }
};

  const toggleStatus = async (id: number, currentStatus: boolean) => {
    try {
      await foodService.update(id, { is_available: !currentStatus });
      message.success("Đã cập nhật trạng thái kinh doanh");
      loadData();
    } catch (err: any) {
      console .error("Toggle Status Error:", err);
      message.error("Cập nhật trạng thái thất bại");
    }
  };

  const columns = [
    {
  title: 'Sản phẩm',
  key: 'product',
  width: 300, // Thu nhỏ lại một chút
  render: (_: any, record: any) => (
    <div className="flex items-center gap-3 overflow-hidden"> 
      <div className="flex-shrink-0"> {/* Chặn ảnh bị bóp méo hoặc đẩy ra ngoài */}
        <Image 
          src={record.image_url} 
          width={60} 
          height={60}
          className="rounded-lg object-cover border shadow-sm"
          fallback="https://via.placeholder.com/60?text=No+Food"
        />
      </div>
      <div className="flex flex-col min-w-0 flex-1"> {/* min-w-0 rất quan trọng để ellipsis hoạt động */}
        <Text className="font-bold text-slate-800 text-sm truncate" title={record.name}>
          {record.name}
        </Text>
        <Text type="secondary" className="text-[11px]" ellipsis={{ tooltip: record.description }}>
          {record.description || 'Chưa có mô tả'}
        </Text>
      </div>
    </div>
  )
},
    { 
      title: 'Phân loại', 
      dataIndex: 'category', 
      key: 'category',
      render: (cat: string) => {
        // Khớp 100% với Enum FoodCategory trong Prisma
        const config: any = { 
          CORN: { color: 'gold', label: 'Bắp rang' }, 
          DRINK: { color: 'blue', label: 'Nước uống' }, 
          COMBO: { color: 'volcano', label: 'Combo' },
          SNACK: { color: 'green', label: 'Đồ ăn vặt' }
        };
        const item = config[cat] || { color: 'default', label: cat };
        return <Tag color={item.color} className="font-bold border-none uppercase px-2">{item.label}</Tag>;
      }
    },
    { 
      title: 'Giá bán', 
      dataIndex: 'price', 
      sorter: (a: any, b: any) => a.price - b.price,
      render: (p: number) => (
        <Text className="font-mono font-bold text-red-600 text-lg">
          {p.toLocaleString('vi-VN')}₫
        </Text>
      )
    },
    { 
      title: 'Trạng thái', 
      dataIndex: 'is_available', 
      align: 'center' as const,
      render: (st: boolean, record: any) => (
        <Space orientation="vertical" size={0}>
          <Switch 
            checked={st} 
            size="small" 
            onChange={() => toggleStatus(record.id, st)}
          />
          <Text className="text-[10px] mt-1 uppercase font-semibold">
            {st ? "Đang bán" : "Tạm ngưng"}
          </Text>
        </Space>
      ) 
    },
    {
      title: 'Hành động',
      align: 'right' as const,
      render: (_: any, record: any) => (
        <Space>
          <Button 
            type="text"
            icon={<EditOutlined className="text-blue-500" />} 
            onClick={() => { setEditingItem(record); setIsModalOpen(true); }}
          />
          <Popconfirm 
            title="Xóa món ăn?" 
            onConfirm={async () => {
              await foodService.delete(record.id);
              message.success("Đã xóa món ăn khỏi hệ thống");
              loadData();
            }}
            okButtonProps={{ danger: true }}
          >
            <Button danger type="text" icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      )
    }
  ];

  const filteredData = data.filter(item => 
    item.name.toLowerCase().includes(searchText.toLowerCase()) ||
    item.category?.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <div className="p-4">
      <Card 
        className="shadow-md rounded-xl border-none"
        title={
          <div className="flex items-center gap-3 py-2">
            <div className="p-3 bg-red-600 text-white rounded-xl shadow-lg shadow-red-100">
              <CoffeeOutlined className="text-2xl" />
            </div>
            <div>
              <h2 className="text-xl font-black uppercase tracking-tight m-0 text-slate-800">MENU DỊCH VỤ ĂN UỐNG</h2>
              <p className="text-[12px] text-slate-400 font-medium m-0 uppercase tracking-widest">Cinema Food & Beverage Management</p>
            </div>
          </div>
        }
        extra={
          <Button 
            type="primary" 
            danger 
            size="large" 
            icon={<PlusOutlined />} 
            onClick={() => { setEditingItem(null); setIsModalOpen(true); }}
            className="font-bold h-12 px-6 rounded-lg shadow-lg shadow-red-200"
          >
            THÊM MÓN MỚI
          </Button>
        }
      >
        <div className="mb-6 flex gap-4">
          <Input 
            prefix={<SearchOutlined className="text-slate-400" />} 
            placeholder="Tìm theo tên món hoặc loại (CORN, DRINK, COMBO...)" 
            className="max-w-md h-12 rounded-xl bg-slate-50 border-slate-100"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            allowClear
          />
        </div>

        <Table 
          columns={columns} 
          dataSource={filteredData}
          rowKey="id" 
          loading={loading}
          scroll={{ x: 1000 }}
          pagination={{ pageSize: 7, showTotal: (total) => `Tổng cộng ${total} món ăn` }}
          className="border border-slate-50 rounded-xl"
        />
      </Card>

      <ServiceModal 
        open={isModalOpen} 
        onCancel={() => setIsModalOpen(false)} 
        onSave={handleSave} 
        initialValues={editingItem} 
      />
    </div>
  );
};

export default ServiceList;