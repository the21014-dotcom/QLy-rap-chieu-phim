/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from 'react';
import { 
  Table, Tag, Space, Button, Card, Typography, 
  Modal, message, Popconfirm, Badge, Descriptions, Select, Tooltip, Avatar
} from 'antd';
import { 
  TagOutlined, EyeOutlined, DeleteOutlined, 
  UserOutlined, VideoCameraOutlined, EditOutlined,
  PlusOutlined, InfoCircleOutlined, CalendarOutlined,
  CheckCircleOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';
import { ticketService } from '../../services/ticketService';
import type { Ticket } from '../../types/ticket';
import { formatCurrency } from '../../utils/format';

const { Title, Text } = Typography;

const TicketList: React.FC = () => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editStatus, setEditStatus] = useState<string>('');

  // Hàm bổ trợ hiển thị tên ghế chuẩn
  const formatSeatLabel = (row: string, column: any) => {
    const col = Number(column);
    return `${row}${col < 10 ? `0${col}` : col}`;
  };

  // 1. Fetch dữ liệu
  const fetchTickets = async () => {
    setLoading(true);
    try {
      const data = await ticketService.getAll();
      setTickets(Array.isArray(data) ? data : []);
    } catch (error: any) {
      console.log(tickets)
      message.error(error.response?.data?.message || 'Không thể tải danh sách vé');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchTickets(); }, []);

  // 2. Cập nhật trạng thái
  const handleUpdateStatus = async () => {
    if (!selectedTicket) return;
    setSubmitLoading(true);
    try {
      await ticketService.update(selectedTicket.id, { status: editStatus });
      message.success(`Cập nhật vé #${selectedTicket.id} thành công`);
      setIsEditOpen(false);
      fetchTickets();
    } catch {
      message.error('Cập nhật thất bại');
    } finally {
      setSubmitLoading(false);
    }
  };

  // 3. Xóa vé
  const handleDelete = async (id: number) => {
    try {
      await ticketService.delete(id);
      message.success('Xóa vé thành công');
      fetchTickets();
    } catch {
      message.error('Lỗi khi xóa vé');
    }
  };

  const getStatusTag = (status: string) => {
  const configs: any = {
    BOOKING: { color: 'processing', text: 'ĐANG ĐẶT', icon: <InfoCircleOutlined /> },
    SUCCESS: { 
      color: '#52c41a', // Màu xanh lá cây đậm chuyên nghiệp
      text: 'THANH TOÁN THÀNH CÔNG', 
      icon: <CheckCircleOutlined />,
      className: 'ant-tag-zoom' // Bạn có thể thêm animation nhỏ ở CSS
    },
    FAILED: { color: 'error', text: 'GIAO DỊCH LỖI', icon: <DeleteOutlined /> },
  };
  
  const config = configs[status] || { color: 'default', text: status };
  
  return (
    <Badge status={status === 'SUCCESS' ? 'success' : 'default'}>
      <Tag 
        icon={config.icon} 
        color={config.color} 
        style={{ borderRadius: 4, fontWeight: 700, padding: '2px 8px' }}
      >
        {config.text}
      </Tag>
    </Badge>
  );
};

  const columns = [
    {
      title: 'Mã vé',
      dataIndex: 'id',
      key: 'id',
      width: 90,
      align: 'center' as const,
      render: (id: number) => <Text code>#TIC-{id}</Text>,
    },
    {
      title: 'Khách hàng',
      key: 'user',
      width: 200,
      render: (_: any, record: Ticket) => (
        <Space>
          <Avatar size="small" icon={<UserOutlined />} style={{ backgroundColor: '#1890ff' }} />
          <div style={{ display: 'flex', flexDirection: 'column', maxWidth: '140px' }}>
            <Text strong ellipsis>{record.booking?.user?.full_name || 'N/A'}</Text>
            <Text type="secondary" style={{ fontSize: 11 }} ellipsis>{record.booking?.user?.email}</Text>
          </div>
        </Space>
      ),
    },
    {
      title: 'Phim & Suất chiếu',
      key: 'showtime',
      width: 280,
      render: (_: any, record: Ticket) => (
        <div style={{ maxWidth: '260px' }}>
          <Text strong style={{ color: '#1d39c4' }} ellipsis block>
            <VideoCameraOutlined /> {record.showtime?.movie?.title}
          </Text>
          <Space size="small" style={{ fontSize: 12, marginTop: 4 }}>
            <Tag color="cyan" bordered={false} style={{ margin: 0 }}>P. {record.showtime?.room?.name}</Tag>
            <Text type="secondary">
              <CalendarOutlined /> {dayjs(record.showtime?.start_time).format('DD/MM HH:mm')}
            </Text>
          </Space>
        </div>
      ),
    },
    {
      title: 'Ghế',
      key: 'seat',
      align: 'center' as const,
      width: 100,
      render: (_: any, record: any) => {
        // PHẦN THAY ĐỔI: Lấy dữ liệu ghế từ showtime_seat.seat
        const s = record.showtime_seat?.seat || record.seat;
        if (!s || !s.row) return <Text type="secondary">N/A</Text>;
        
        const label = formatSeatLabel(s.row, s.number || s.column);
        const isVip = s.type === 'VIP';

        return (
          <Tooltip title={`Loại: ${s.type || 'Thường'}`}>
            <Tag 
              color={isVip ? 'volcano' : 'orange'} 
              style={{ 
                margin: 0, 
                fontWeight: 'bold', 
                borderRadius: '4px',
                minWidth: '45px',
                textAlign: 'center'
              }}
            >
              {label}
            </Tag>
          </Tooltip>
        );
      },
    },
    {
      title: 'Thành tiền',
      dataIndex: 'price',
      key: 'price',
      align: 'right' as const,
      width: 120,
      render: (price: number) => (
        <Text strong style={{ color: '#cf1322' }}>
          {formatCurrency(price)}
        </Text>
      ),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      align: 'center' as const,
      width: 130,
      render: (status: string) => getStatusTag(status),
    },
    {
      title: 'Hành động',
      key: 'action',
      align: 'center' as const,
      width: 110,
      render: (_: any, record: Ticket) => (
        <Space>
          <Button size="small" shape="circle" icon={<EyeOutlined />} onClick={() => { setSelectedTicket(record); setIsDetailOpen(true); }} />
          <Button 
            size="small" 
            type="primary" 
            ghost 
            icon={<EditOutlined />} 
            onClick={() => { 
              setSelectedTicket(record); 
              setEditStatus(record.status);
              setIsEditOpen(true); 
            }} 
          />
          <Popconfirm title="Xóa vé?" onConfirm={() => handleDelete(record.id)} okText="Xóa" cancelText="Hủy" okButtonProps={{ danger: true }}>
            <Button size="small" danger icon={<DeleteOutlined />} shape="circle" />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: '24px', background: '#f0f2f5', minHeight: '100vh' }}>
      <Card 
        bordered={false} 
        style={{ borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}
        title={
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Title level={4} style={{ margin: 0 }}><TagOutlined /> Quản lý Giao dịch Vé</Title>
            <Button type="primary" danger icon={<PlusOutlined />}>XUẤT BÁO CÁO</Button>
          </div>
        }
      >
        <Table 
          columns={columns} 
          dataSource={tickets} 
          rowKey="id" 
          loading={loading}
          size="middle"
          pagination={{ pageSize: 8, showTotal: (t) => `Tổng ${t} bản ghi` }}
          scroll={{ x: 1000 }}
        />
      </Card>

      {/* MODAL CHI TIẾT */}
      <Modal
        title="CHI TIẾT VÉ XEM PHIM"
        open={isDetailOpen}
        onCancel={() => setIsDetailOpen(false)}
        footer={[<Button key="ok" type="primary" onClick={() => setIsDetailOpen(false)}>Đóng</Button>]}
        width={600}
      >
        {selectedTicket && (
          <Descriptions bordered column={2} size="small">
            <Descriptions.Item label="Mã vé" span={2}><Text code>#TIC-{selectedTicket.id}</Text></Descriptions.Item>
            <Descriptions.Item label="Khách hàng" span={2}>{selectedTicket.booking?.user?.full_name}</Descriptions.Item>
            <Descriptions.Item label="Phim" span={2}><Text strong style={{ color: '#1890ff' }}>{selectedTicket.showtime?.movie?.title}</Text></Descriptions.Item>
            <Descriptions.Item label="Vị trí">
              {selectedTicket.showtime?.room?.name} - 
              <Text strong style={{ color: '#f5222d', marginLeft: 4 }}>
                Ghế {selectedTicket.showtime_seat?.seat?.row}{selectedTicket.showtime_seat?.seat?.number || selectedTicket.showtime_seat?.seat?.column}
              </Text>
            </Descriptions.Item>
            <Descriptions.Item label="Suất chiếu">{dayjs(selectedTicket.showtime?.start_time).format('HH:mm DD/MM/YYYY')}</Descriptions.Item>
            <Descriptions.Item label="Trạng thái" span={2}>{getStatusTag(selectedTicket.status)}</Descriptions.Item>
            <Descriptions.Item label="Giá vé" span={2}>
              <Text type="danger" strong style={{ fontSize: 18 }}>{formatCurrency(selectedTicket.price)}</Text>
            </Descriptions.Item>
          </Descriptions>
        )}
      </Modal>

      {/* MODAL EDIT STATUS */}
      <Modal
        title="Cập nhật trạng thái"
        open={isEditOpen}
        onOk={handleUpdateStatus}
        confirmLoading={submitLoading}
        onCancel={() => setIsEditOpen(false)}
      >
        <Select style={{ width: '100%' }} value={editStatus} onChange={(v) => setEditStatus(v)}>
          <Select.Option value="BOOKING">ĐANG ĐẶT</Select.Option>
          <Select.Option value="SUCCESS">THÀNH CÔNG</Select.Option>
          <Select.Option value="FAILED">ĐÃ HỦY</Select.Option>
        </Select>
      </Modal>
    </div>
  );
};

export default TicketList;