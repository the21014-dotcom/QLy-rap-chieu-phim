/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect, useCallback } from 'react';
import { Table, Button, Tag, Space, Card, Modal, Form, Input, Select, InputNumber, message, Popconfirm, Row, Col } from 'antd';
import { ApartmentOutlined, PlusOutlined, EditOutlined, AppstoreOutlined, DeleteOutlined } from '@ant-design/icons';
import api from '../../services/api'; 

// ====== TYPES ======
interface Room {
  id: number;
  cinema_id: number;
  name: string;
  room_type: string;
  total_rows: number;
  cols_per_row: number;
  total_seats: number;
  cinema?: { name: string; city: string };
  seats?: Seat[];
}

interface Seat {
  id: number;
  row: string;
  number: number;
  type: string;
  price_extra: number;
}

interface Cinema {
  id: number;
  name: string;
  city: string;
  address: string;
}

// ====== COMPONENT ======
const RoomList: React.FC = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [cinemas, setCinemas] = useState<Cinema[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCinemaModalOpen, setIsCinemaModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [seats, setSeats] = useState<Seat[]>([]);
  const [isSeatModalOpen, setIsSeatModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [cinemaForm] = Form.useForm();

  // Watchers
  const watchRows = Form.useWatch('total_rows', form);
  const watchCols = Form.useWatch('cols_per_row', form);

  // Kiểm tra token trước
  const checkToken = () => {
    const token = localStorage.getItem('admin_token');
    console.log('🔑 Token hiện tại:', token ? 'Có token' : 'KHÔNG CÓ TOKEN');
    if (!token) {
      message.warning('Vui lòng đăng nhập ADMIN trước!');
      return false;
    }
    return true;
  };

  // Fetch rooms & cinemas
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [resRooms, resCinemas] = await Promise.all([
        api.get('/rooms'),
        api.get('/cinemas')
      ]);
      console.log('📥 Rooms:', resRooms.data);
      console.log('📥 Cinemas:', resCinemas.data);
      setRooms(resRooms.data?.data || resRooms.data || []);
      setCinemas(resCinemas.data?.data || resCinemas.data || []);
    } catch (err: any) {
      console.error("Fetch Error:", err);
      message.error('Không thể tải dữ liệu');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  // Fetch seats for specific room
  const fetchSeats = async (roomId: number) => {
    try {
      const res = await api.get(`/rooms/${roomId}/seats`);
      const roomData = res.data.data || res.data;
      setSeats(roomData.seats || []);
      setSelectedRoom(roomData);
      setIsSeatModalOpen(true);
    } catch (err: any) {
      message.error(err?.response?.data?.message || 'Không tải được sơ đồ ghế');
    }
  };

  // Save room - THÊM DEBUG
 // Save room - ĐÃ SỬA BỎ TOTAL_SEATS THỪA
  const onFinish = async (values: any) => {
    // Kiểm tra token trước
    if (!checkToken()) return;

    try {
      // 🌟 THAY ĐỔI: Không truyền total_seats lên backend nữa, backend sẽ tự tính dựa vào total_rows * cols_per_row
      const payload = { 
        ...values,
        cinema_id: Number(values.cinema_id) // Đảm bảo cinema_id truyền đi là kiểu số dạng Number
      };
      
      console.log('📤 Gửi payload đã chuẩn hóa:', payload);
      
      if (editingId) {
        // Lưu ý: Route update của bạn đang là PATCH ở backend (@Patch(':id')) 
        // Nên đổi từ api.put sang api.patch để khớp logic hệ thống
        await api.patch(`/rooms/${editingId}`, payload);
        message.success('Cập nhật phòng thành công!');
      } else {
        const res = await api.post('/rooms', payload);
        console.log('✅ Phản hồi:', res.data);
        message.success('Thêm phòng mới thành công!');
      }
      setIsModalOpen(false);
      fetchData();
    } catch (err: any) {
      console.error('❌ Lỗi chi tiết:', err);
      if (err.response?.status === 401) {
        message.error('Chưa đăng nhập! Vui lòng đăng nhập ADMIN.');
      } else if (err.response?.status === 403) {
        message.error('Không có quyền ADMIN! Liên hệ quản trị viên.');
      } else {
        message.error(err?.response?.data?.message || 'Lỗi khi lưu phòng');
      }
    }
  };

  // Add new cinema
  const onAddCinema = async (values: any) => {
    if (!checkToken()) return;
    
    try {
      await api.post('/cinemas', values);
      message.success('Thêm rạp mới thành công!');
      setIsCinemaModalOpen(false);
      cinemaForm.resetFields();
      fetchData();
    } catch (err: any) {
      console.error('❌ Lỗi thêm rạp:', err);
      message.error(err?.response?.data?.message || 'Lỗi khi thêm rạp');
    }
  };

  // Get seat badge
  const getSeatBadge = (type: string) => {
    const config: any = {
      NORMAL: { color: 'default', label: 'Thường' },
      VIP: { color: 'gold', label: 'VIP' },
      SWEETBOX: { color: 'pink', label: 'Đôi' },
    };
    return config[type] || config.NORMAL;
  };

  // Columns
  const columns = [
    { 
      title: 'RẠP / THÀNH PHỐ', 
      key: 'cinema',
      render: (_: any, record: Room) => (
        <div>
          <span className="font-bold">{record.cinema?.name}</span>
          <Tag color="default" className="ml-2">{record.cinema?.city}</Tag>
        </div>
      )
    },
    { 
      title: 'TÊN PHÒNG', 
      dataIndex: 'name', 
      key: 'name', 
      render: (text: string, record: Room) => (
        <div className="flex items-center gap-2">
          <b className="text-blue-600">{text}</b>
          <Tag color={record.room_type === 'IMAX' ? 'volcano' : record.room_type === 'GOLD_CLASS' ? 'gold' : 'blue'}>
            {record.room_type}
          </Tag>
        </div>
      ) 
    },
    { title: 'CẤU TRÚC', key: 'matrix', render: (_: any, r: Room) => <Tag>{r.total_rows}×{r.cols_per_row}</Tag> },
    { title: 'SỨC CHỨA', dataIndex: 'total_seats', key: 'total_seats' },
    {
      title: 'THAO TÁC',
      key: 'action',
      render: (_: any, record: Room) => (
        <Space>
          <Button type="link" icon={<AppstoreOutlined />} onClick={() => fetchSeats(record.id)}>Sơ đồ</Button>
          <Button type="link" icon={<EditOutlined />} onClick={() => {
            setEditingId(record.id);
            form.setFieldsValue(record);
            setIsModalOpen(true);
          }} />
          <Popconfirm title="Xóa phòng?" onConfirm={async () => {
            if (!checkToken()) return;
            try {
              await api.delete(`/rooms/${record.id}`);
              fetchData();
            } catch  {
              message.error('Xóa thất bại');
            }
          }}>
            <Button type="link" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  // ====== RENDER ======
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <Card className="mb-6 shadow-md">
        <div className="flex justify-between items-center">
          <Space size="middle">
            <div className="p-3 bg-red-600 rounded-xl">
              <ApartmentOutlined className="text-white text-2xl" />
            </div>
            <div>
              <h2 className="text-xl font-bold m-0">Quản lý Phòng chiếu</h2>
              <p className="text-gray-400 text-xs m-0">Thêm/sửa/xem sơ đồ ghế</p>
            </div>
          </Space>
          <Space>
            <Button type="primary" onClick={() => setIsCinemaModalOpen(true)}>
              THÊM RẠP
            </Button>
            <Button type="primary" danger icon={<PlusOutlined />} onClick={() => {
              if (!checkToken()) return;
              setEditingId(null);
              form.resetFields();
              setIsModalOpen(true);
            }}>
              THÊM PHÒNG
            </Button>
          </Space>
        </div>
      </Card>

      {/* Table */}
      <Table dataSource={rooms} columns={columns} rowKey="id" loading={loading} pagination={{ pageSize: 8 }} />

      {/* Modal Add/Edit Room */}
      <Modal 
        title={<b className="uppercase">{editingId ? 'Cập nhật phòng' : 'Thêm phòng mới'}</b>} 
        open={isModalOpen} 
        onOk={() => form.submit()} 
        onCancel={() => setIsModalOpen(false)}
        width={600}
      >
        <Form form={form} layout="vertical" onFinish={onFinish} className="mt-4">
          <Form.Item name="cinema_id" label="Chọn rạp" rules={[{ required: true, message: 'Chọn rạp' }]}>
            <Select placeholder="Chọn rạp" options={cinemas.map(c => ({ value: c.id, label: `${c.name} - ${c.city}` }))} />
          </Form.Item>
          
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="name" label="Tên phòng" rules={[{ required: true }]}>
                <Input placeholder="VD: Cinema 01" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="room_type" label="Loại phòng" rules={[{ required: true }]}>
                <Select placeholder="Chọn loại"
                  options={[
                    { value: 'STANDARD_2D', label: 'STANDARD 2D' }, 
                    { value: 'PREMIUM_3D', label: 'PREMIUM 3D' }, 
                    { value: 'IMAX', label: 'IMAX' },
                    { value: 'GOLD_CLASS', label: 'GOLD CLASS' }
                  ]} 
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="total_rows" label="Số hàng" rules={[{ required: true }]}>
                <InputNumber min={1} max={20} className="w-full" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="cols_per_row" label="Số ghế/hàng" rules={[{ required: true }]}>
                <InputNumber min={1} max={30} className="w-full" />
              </Form.Item>
            </Col>
          </Row>

          {watchRows && watchCols && (
            <div className="p-3 bg-gray-100 rounded-lg text-center">
              <span className="text-gray-500">Tổng: </span>
              <b className="text-red-600 text-xl">{watchRows * watchCols}</b> ghế
            </div>
          )}
        </Form>
      </Modal>

      {/* Modal Add Cinema */}
      <Modal 
        title={<b className="uppercase">Thêm Rạp mới</b>} 
        open={isCinemaModalOpen} 
        onOk={() => cinemaForm.submit()} 
        onCancel={() => setIsCinemaModalOpen(false)}
        width={500}
      >
        <Form form={cinemaForm} layout="vertical" onFinish={onAddCinema} className="mt-4">
          <Form.Item name="name" label="Tên rạp" rules={[{ required: true }]}>
            <Input placeholder="VD: CGV Aeon Hải Phòng" />
          </Form.Item>
          
          <Form.Item name="city" label="Thành phố" rules={[{ required: true }]}>
            <Select placeholder="Chọn thành phố"
              options={[
                { value: 'Hà Nội', label: 'Hà Nội' },
                { value: 'Hồ Chí Minh', label: 'Hồ Chí Minh' },
                { value: 'Đà Nẵng', label: 'Đà Nẵng' },
                { value: 'Hải Phòng', label: 'Hải Phòng' },
                { value: 'Hải Dương', label: 'Hải Dương' },
                { value: 'Hưng Yên', label: 'Hưng Yên' },
              ]} 
            />
          </Form.Item>

          <Form.Item name="address" label="Địa chỉ">
            <Input placeholder="VD: AEON Mall Lê Chân" />
          </Form.Item>
        </Form>
      </Modal>

      {/* Modal Seat Map */}
      <Modal 
        title={<b>Sơ đồ ghế - {selectedRoom?.name}</b>} 
        open={isSeatModalOpen} 
        onCancel={() => setIsSeatModalOpen(false)}
        width={800}
        footer={null}
      >
        <div className="text-center mb-4">
          <Tag>Thường</Tag> <Tag color="gold">VIP</Tag> <Tag color="pink">Đôi</Tag>
        </div>
        
        <div className="bg-gray-300 h-2 rounded-full mb-8 mx-auto w-3/4"></div>
        <p className="text-center text-xs text-gray-400 mb-6">MÀN HÌNH</p>

        <div className="flex flex-wrap justify-center gap-1">
          {seats.map((seat: Seat) => (
            <div 
              key={seat.id}
              className={`w-8 h-8 rounded flex items-center justify-center text-xs font-bold
                ${seat.type === 'NORMAL' ? 'bg-gray-200 text-gray-600' : ''}
                ${seat.type === 'VIP' ? 'bg-yellow-400 text-yellow-900' : ''}
                ${seat.type === 'SWEETBOX' ? 'bg-pink-500 text-white' : ''}
              `}
              title={`Hàng ${seat.row}, Ghế ${seat.number}`}
            >
              {seat.number}
            </div>
          ))}
        </div>

               <div className="flex justify-center gap-1 mt-2">
          {[...new Set(seats.map(s => s.row))].map(row => (
            <div key={row} className="w-8 text-center text-xs text-gray-400">{row}</div>
          ))}
        </div>
      </Modal>
    </div>
  );
};

export default RoomList;