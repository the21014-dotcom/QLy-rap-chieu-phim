/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react';
import { 
  Table, Tag, Space, Button, Input, Select, 
  Card, Typography, Tooltip, message, Badge, Modal, Popconfirm 
} from 'antd';
import { 
  EyeOutlined, ReloadOutlined, DeleteOutlined, EditOutlined, SearchOutlined, CreditCardOutlined
} from '@ant-design/icons';
import api from '../../services/api';
import { formatCurrency } from '../../utils/format';
import { useNavigate } from 'react-router-dom';

const { Title, Text } = Typography;

// --- ĐỊNH NGHĨA INTERFACE ĐỂ SỬA LỖI TYPESCRIPT ---
interface FoodItem {
  food?: { name: string };
  price: number;
  quantity: number;
}

interface TicketItem {
  seat?: {
    row: string;
    number: number;
  };
  price: number;
}

interface InvoiceRecord {
  id: number;
  total_amount: number; // Tiền vé từ Backend
  status: string;
  payment?: { payment_method: string };
  booking_foods?: FoodItem[];
  tickets?: TicketItem[];
}

const InvoiceList: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<InvoiceRecord[]>([]);
  const [total, setTotal] = useState(0);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<InvoiceRecord | null>(null);
  
  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
    status: undefined,
    search: '',
  });

  const fetchInvoices = async () => {
    setLoading(true);
    try {
      const response: any = await api.get('/bookings/admin/all', { params: filters });
      const actualData = response.data || response;
      setData(actualData.items || []);
      setTotal(actualData.total || 0);
    } catch  {
      message.error("Không thể tải danh sách hóa đơn");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, [filters]);

  const handleDelete = async (id: number) => {
    try {
      await api.delete(`/bookings/${id}`);
      message.success("Đã xóa hóa đơn thành công");
      fetchInvoices();
    } catch  {
      message.error("Lỗi: Không thể xóa");
    }
  };

  const handleUpdateStatus = async () => {
    if (!editingRecord) return;
    try {
      await api.patch(`/bookings/${editingRecord.id}`, { status: editingRecord.status });
      message.success("Cập nhật trạng thái thành công");
      setIsEditModalOpen(false);
      fetchInvoices();
    } catch  {
      message.error("Cập nhật thất bại");
    }
  };

  const columns = [
    {
      title: 'Mã đơn',
      dataIndex: 'id',
      key: 'id',
      width: 120,
      render: (id: number) => <Text code>#BK2026{id}</Text>,
    },
    {
      title: 'Dịch vụ & Bắp nước',
      key: 'services',
      render: (_: any, record: InvoiceRecord) => {
        // Tính tiền bắp nước riêng
        const foodSum = record.booking_foods?.reduce((sum, f) => 
          sum + (Number(f.price || 0) * Number(f.quantity || 0)), 0) || 0;
        
        // Sửa lỗi 'Aundefined' bằng kiểm tra an toàn
        const seatNames = record.tickets?.map(t => 
          t.seat ? `${t.seat.row}${t.seat.number}` : '?'
        ).join(', ');

        return (
          <Space direction="vertical" size={0}>
            <Tag color="volcano" style={{ marginBottom: 4 }}>
              Ghế: {seatNames || 'N/A'}
            </Tag>
            {record.booking_foods && record.booking_foods.length > 0 ? (
              <Tooltip title={record.booking_foods.map(f => `${f.food?.name} x${f.quantity}`).join(', ')}>
                <Tag color="green">Bắp nước: {formatCurrency(foodSum)}</Tag>
              </Tooltip>
            ) : <Text type="secondary" style={{ fontSize: 11 }}>Không kèm bắp nước</Text>}
          </Space>
        );
      },
    },
    {
      title: 'Tổng thanh toán',
      key: 'total',
      render: (_: any, record: InvoiceRecord) => {
        // TÍNH TỔNG CUỐI CÙNG: Tiền vé (total_amount) + Tiền bắp nước
      
        // GIẢ ĐỊNH: total_amount từ API chỉ là tiền vé. Nếu đã gộp rồi thì không cần cộng foodSum.
        const finalTotal = Number(record.total_amount || 0);

        return (
          <div style={{ textAlign: 'right' }}>
            <Text strong style={{ color: '#f5222d', fontSize: '15px' }}>
              {formatCurrency(finalTotal)}
            </Text>
            <br />
            <Space size={4}>
               <CreditCardOutlined style={{ fontSize: '12px', color: '#8c8c8c' }} />
               <Tag color="blue" style={{ margin: 0, fontSize: '11px' }}>
                 {record.payment?.payment_method || 'CASH'}
               </Tag>
            </Space>
          </div>
        );
      }
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const configs: any = { 
          SUCCESS: { color: 'success', text: 'THÀNH CÔNG' }, 
          PENDING: { color: 'processing', text: 'CHỜ XỬ LÝ' }, 
          CANCELLED: { color: 'default', text: 'ĐÃ HỦY' } 
        };
        const config = configs[status] || { color: 'default', text: status };
        return <Badge status={config.color} text={config.text} />;
      },
    },
    {
      title: 'Thao tác',
      key: 'action',
      width: 120,
      render: (_: any, record: InvoiceRecord) => (
        <Space>
          <Button size="small" icon={<EyeOutlined />} onClick={() => navigate(`/admin/invoices/${record.id}`)} />
          <Button size="small" icon={<EditOutlined />} onClick={() => {
            setEditingRecord(record);
            setIsEditModalOpen(true);
          }} />
          <Popconfirm title="Xóa đơn hàng?" onConfirm={() => handleDelete(record.id)}>
            <Button size="small" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: '24px' }}>
      <Card title={<Title level={4}>Quản lý Giao dịch</Title>}>
        <div style={{ marginBottom: 20, display: 'flex', gap: 12 }}>
          <Input 
            placeholder="Tìm kiếm..." 
            style={{ width: 250 }} 
            prefix={<SearchOutlined />}
            onChange={e => setFilters({...filters, search: e.target.value, page: 1})} 
          />
          <Select 
            placeholder="Trạng thái" 
            style={{ width: 150 }} 
            allowClear 
            onChange={val => setFilters({...filters, status: val, page: 1})}
          >
             <Select.Option value="SUCCESS">Thành công</Select.Option>
             <Select.Option value="PENDING">Chờ xử lý</Select.Option>
             <Select.Option value="CANCELLED">Đã hủy</Select.Option>
          </Select>
          <Button type="primary" onClick={fetchInvoices} icon={<ReloadOutlined />}>Làm mới</Button>
        </div>

        <Table 
          columns={columns} 
          dataSource={data} 
          loading={loading} 
          rowKey="id"
          pagination={{
            total,
            current: filters.page,
            pageSize: filters.limit,
            onChange: (page, size) => setFilters({...filters, page, limit: size})
          }}
        />
      </Card>

      <Modal 
        title="Cập nhật hóa đơn" 
        open={isEditModalOpen} 
        onOk={handleUpdateStatus} 
        onCancel={() => setIsEditModalOpen(false)}
      >
        {editingRecord && (
          <Select 
            style={{ width: '100%' }} 
            value={editingRecord.status} 
            onChange={val => setEditingRecord({...editingRecord, status: val})}
          >
            <Select.Option value="SUCCESS">Thành công</Select.Option>
            <Select.Option value="PENDING">Chờ xử lý</Select.Option>
            <Select.Option value="CANCELLED">Hủy đơn</Select.Option>
          </Select>
        )}
      </Modal>
    </div>
  );
};

export default InvoiceList;