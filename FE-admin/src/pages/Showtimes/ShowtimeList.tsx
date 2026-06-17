/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { 
  Table, Button, DatePicker, Select, Modal, Form, 
  InputNumber, Tag, Card, message, Space, Popconfirm, Badge 
} from 'antd';
import { 
  CalendarOutlined, PlusOutlined, DeleteOutlined, 
  VideoCameraOutlined, EditOutlined, ClockCircleOutlined 
} from '@ant-design/icons';
import dayjs from 'dayjs';
import api from '../../services/api'; 

interface Showtime {
  id: number;
  movie_id: number;
  room_id: number;
  start_time: string;
  end_time: string;
  price_base: string | number;
  movie?: { title: string; duration: number }; 
  room?: { 
    name: string; 
    room_type: string; 
    cinema?: { name: string } 
  };
}

const ShowtimeList: React.FC = () => {
  const [showtimes, setShowtimes] = useState<Showtime[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form] = Form.useForm();

  const [movies, setMovies] = useState<any[]>([]);
  const [rooms, setRooms] = useState<any[]>([]);

  // 1. Tải dữ liệu từ hệ thống
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [resShowtimes, resMovies, resRooms] = await Promise.all([
        api.get('/showtimes'),
        api.get('/movies'),
        api.get('/rooms')
      ]);
      
      setShowtimes(resShowtimes.data.data || []); 
      setMovies((resMovies.data.data || resMovies.data).filter((m: any) => m.is_active));
      setRooms(resRooms.data.data || resRooms.data);
    } catch (err: any) {
      console .error('Error fetching room data:', err);
      message.error('Không thể đồng bộ dữ liệu từ máy chủ!');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  // 2. Logic tính toán thời gian kết thúc dự kiến
  const selectedMovieId = Form.useWatch('movie_id', form);
  const selectedStartTime = Form.useWatch('start_time', form);
  const activeMovie = useMemo(() => movies.find(m => m.id === selectedMovieId), [selectedMovieId, movies]);

  const previewEndTime = useMemo(() => {
    if (activeMovie && selectedStartTime) {
      // Logic: Thời lượng phim + 15 phút nghỉ/dọn vệ sinh phòng chiếu
      return dayjs(selectedStartTime).add(activeMovie.duration + 15, 'minute');
    }
    return null;
  }, [activeMovie, selectedStartTime]);

  // 3. Xử lý Mở Modal (Create / Edit)
  const openModal = (record?: Showtime) => {
    if (record) {
      setEditingId(record.id);
      form.setFieldsValue({
        movie_id: record.movie_id,
        room_id: record.room_id,
        price_base: Number(record.price_base),
        start_time: dayjs(record.start_time),
      });
    } else {
      setEditingId(null);
      form.resetFields();
    }
    setIsModalOpen(true);
  };

  // 4. Gửi dữ liệu Update/Create
  const onFinish = async (values: any) => {
    const payload = {
      movie_id: values.movie_id,
      room_id: values.room_id,
      start_time: values.start_time.format('YYYY-MM-DDTHH:mm:ss'), 
      price_base: values.price_base
    };

    try {
      if (editingId) {
        await api.patch(`/showtimes/${editingId}`, payload);
        message.success('Cập nhật suất chiếu thành công!');
      } else {
        await api.post('/showtimes', payload);
        message.success('Thiết lập suất chiếu mới thành công!');
      }
      setIsModalOpen(false);
      fetchData();
    } catch (err: any) {
      console .error('Error fetching showtime data:', err);
      message.error('Lỗi: Suất chiếu bị trùng lịch tại phòng này!');
    }
  };

  const columns = [
    {
      title: 'THÔNG TIN PHIM',
      key: 'movie',
      width: '30%',
      render: (record: Showtime) => (
        <Space direction="vertical" size={0}>
          <div className="font-bold text-slate-800 text-base">
            <VideoCameraOutlined className="text-red-600 mr-2" />
            {record.movie?.title?.toUpperCase()}
          </div>
          <div className="flex items-center gap-2 mt-1">
            <Tag color="default">ID: {record.movie_id}</Tag>
            <span className="text-xs text-slate-400">
              <ClockCircleOutlined /> {record.movie?.duration} phút
            </span>
          </div>
        </Space>
      )
    },
    { 
      title: 'PHÒNG & RẠP', 
      key: 'room', 
      render: (record: Showtime) => (
        <Space direction="vertical" size={0}>
          <div className="font-bold text-slate-700">{record.room?.name}</div>
          <div className="text-xs text-slate-500">
            {record.room?.cinema?.name}
          </div>
          <Tag color="cyan" className="mt-1 border-none font-bold text-[10px]">
            {record.room?.room_type}
          </Tag>
        </Space>
      )
    },
    {
      title: 'LỊCH CHIẾU (TIMELINE)',
      key: 'time',
      render: (record: Showtime) => (
        <div className="bg-slate-50 p-2 rounded-lg border border-slate-200 flex items-center gap-4 w-fit shadow-sm">
          <div className="text-center px-2 border-r border-slate-300">
            <div className="text-[10px] text-slate-400 font-bold uppercase">{dayjs(record.start_time).format('MMMM')}</div>
            <div className="text-xl font-black text-red-600 leading-none">{dayjs(record.start_time).format('DD')}</div>
          </div>
          <div>
            <div className="font-mono text-base font-bold text-slate-800">
              {dayjs(record.start_time).format('HH:mm')} <span className="text-slate-300 mx-1">→</span> {dayjs(record.end_time).format('HH:mm')}
            </div>
            <Badge status="processing" text={<span className="text-[10px] text-slate-400 font-bold uppercase">Giờ Việt Nam</span>} />
          </div>
        </div>
      )
    },
    {
      title: 'GIÁ VÉ CƠ BẢN',
      dataIndex: 'price_base',
      render: (price: any) => (
        <div className="text-emerald-700 font-black text-base">
          {Number(price).toLocaleString('vi-VN')} <span className="text-xs font-normal underline">đ</span>
        </div>
      )
    },
    {
      title: 'QUẢN TRỊ',
      key: 'action',
      align: 'right' as const,
      render: (record: Showtime) => (
        <Space>
          <Button 
            type="text" 
            className="text-blue-600 hover:bg-blue-50" 
            icon={<EditOutlined />} 
            onClick={() => openModal(record)}
          >
            Sửa
          </Button>
          <Popconfirm 
            title="CẢNH BÁO XÓA" 
            description="Bạn có chắc chắn muốn gỡ bỏ suất chiếu này không?" 
            onConfirm={() => api.delete(`/showtimes/${record.id}`).then(() => fetchData())}
            okText="Xóa ngay"
            cancelText="Hủy"
            okButtonProps={{ danger: true }}
          >
            <Button danger type="text" icon={<DeleteOutlined />}>Gỡ</Button>
          </Popconfirm>
        </Space>
      )
    }
  ];

  return (
    <div className="p-6 bg-slate-100 min-h-screen">
      <Card 
        className="shadow-md border-none"
        title={
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-600 rounded-lg shadow-lg">
              <CalendarOutlined className="text-white text-xl" />
            </div>
            <div>
              <div className="text-xs text-slate-400 font-bold uppercase tracking-widest">Cinema Management</div>
              <div className="font-black text-slate-800 text-xl italic uppercase">Quản lý lịch chiếu phim</div>
            </div>
          </div>
        } 
        extra={
          <Button 
            type="primary" 
            size="large"
            className="bg-red-600 hover:bg-red-700 border-none shadow-lg flex items-center gap-2 font-bold"
            icon={<PlusOutlined />} 
            onClick={() => openModal()}
          >
            TẠO SUẤT CHIẾU MỚI
          </Button>
        }
      >
        <Table 
          dataSource={showtimes} 
          columns={columns} 
          rowKey="id" 
          loading={loading}
          pagination={{ pageSize: 8, showTotal: (total) => `Tổng cộng ${total} suất chiếu` }}
          className="custom-table"
        />
      </Card>

      <Modal 
        title={
          <div className="flex items-center gap-2 border-b pb-3">
             <EditOutlined className="text-red-600" />
             <span className="font-black uppercase">{editingId ? 'Cập nhật suất chiếu' : 'Thiết lập suất chiếu mới'}</span>
          </div>
        }
        open={isModalOpen} 
        onCancel={() => setIsModalOpen(false)} 
        onOk={() => form.submit()} 
        width={700}
        okText={editingId ? "LƯU THAY ĐỔI" : "XÁC NHẬN TẠO"}
        okButtonProps={{ className: 'bg-red-600 h-10 px-8 font-bold' }}
        cancelButtonProps={{ className: 'h-10' }}
        destroyOnClose
      >
        <Form form={form} layout="vertical" onFinish={onFinish} className="mt-6">
          <Form.Item label={<span className="font-bold text-slate-600">PHIM CHIẾU</span>} name="movie_id" rules={[{ required: true, message: 'Vui lòng chọn phim' }]}>
            <Select 
              size="large"
              placeholder="Tìm kiếm tên phim..." 
              options={movies.map(m => ({ value: m.id, label: m.title.toUpperCase() }))} 
              showSearch
              filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
            />
          </Form.Item>

          <div className="grid grid-cols-2 gap-6">
            <Form.Item label={<span className="font-bold text-slate-600">PHÒNG CHIẾU</span>} name="room_id" rules={[{ required: true, message: 'Chọn phòng' }]}>
              <Select 
                size="large"
                placeholder="Chọn phòng" 
                options={rooms.map(r => ({ value: r.id, label: `${r.name} - ${r.cinema?.name}` }))} 
              />
            </Form.Item>
            
            <Form.Item label={<span className="font-bold text-slate-600">GIÁ VÉ (VNĐ)</span>} name="price_base" rules={[{ required: true, message: 'Nhập giá vé' }]}>
              <InputNumber 
                size="large"
                className="w-full" 
                min={0} 
                step={1000} 
                formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                parser={value => value!.replace(/\D/g, '') as any}
              />
            </Form.Item>
          </div>

          <Form.Item label={<span className="font-bold text-slate-600">THỜI GIAN BẮT ĐẦU</span>} name="start_time" rules={[{ required: true, message: 'Chọn giờ chiếu' }]}>
            <DatePicker 
              showTime 
              size="large"
              format="YYYY-MM-DD HH:mm" 
              className="w-full"
              placeholder="Chọn ngày và giờ chiếu"
              disabledDate={current => current && current < dayjs().startOf('day')}
            />
          </Form.Item>

          {previewEndTime && (
            <div className="mt-4 p-4 bg-red-50 border-l-4 border-red-500 rounded-r-lg flex justify-between items-center">
              <div>
                <div className="text-[10px] text-red-400 font-bold uppercase tracking-tighter">Timeline Dự Kiến</div>
                <div className="text-red-700 font-black text-lg uppercase italic">
                  {selectedStartTime.format('HH:mm')} — {previewEndTime.format('HH:mm')}
                </div>
              </div>
              <div className="text-right text-[10px] text-red-400 italic">
                * Bao gồm {activeMovie?.duration}p phim <br/> + 15p dọn dẹp kỹ thuật
              </div>
            </div>
          )}
        </Form>
      </Modal>

      <style>{`
        .custom-table .ant-table-thead > tr > th {
          background: #f8fafc;
          color: #64748b;
          font-weight: 800;
          font-size: 11px;
          letter-spacing: 0.05em;
        }
        .ant-modal-content {
          border-radius: 16px;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
};

export default ShowtimeList;