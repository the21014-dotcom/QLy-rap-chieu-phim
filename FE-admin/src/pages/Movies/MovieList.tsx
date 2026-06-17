/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { useState, useEffect } from 'react';
import { Table, Button, Space, Tag, Input, Modal, Form, Select, InputNumber, message, Popconfirm, Image, DatePicker, Row, Col, Typography } from 'antd';
import { PlusOutlined, SearchOutlined, EditOutlined, DeleteOutlined, VideoCameraOutlined, CalendarOutlined, UserOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { movieApi } from '../../services/movieApi'; 
import { MovieRating } from '../../types/movie'; 
import type { Movie } from '../../types/movie';

const { Text } = Typography;

const MovieList: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [allGenres, setAllGenres] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [searchText, setSearchText] = useState('');
  const [form] = Form.useForm();

  const fetchAllGenres = async () => {
  try {
    const data = await movieApi.getAllGenres();
    setAllGenres(data);
  } catch (error) {
    console.error('Lỗi lấy danh sách thể loại:', error);
  }
};

// Gọi trong useEffect
useEffect(() => { 
  fetchMovies(); 
  fetchAllGenres(); // Gọi thêm hàm này
}, []);

  const fetchMovies = async () => {
    setLoading(true);
    try {
      const res = await movieApi.getAll();
      const data = Array.isArray(res) ? res : (res as any).data || [];
      setMovies(data);
    } catch (error) {
      console.error('Error fetching movies:', error);
      message.error('Không thể tải danh sách phim');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchMovies(); }, []);

  const columns = [
    {
      title: 'Poster',
      dataIndex: 'poster_url',
      key: 'poster_url',
      width: 80,
      render: (url: string) => (
        <Image 
          src={url} 
          width={60} 
          className="rounded-lg shadow-sm object-cover" 
          fallback="https://via.placeholder.com/60x90?text=No+Poster" 
        />
      ),
    },
    {
      title: 'Thông tin phim',
      dataIndex: 'title',
      key: 'title',
      render: (text: string, record: Movie) => (
        <div className="flex flex-col">
          <Text className="font-bold text-slate-800 text-base">{text}</Text>
          <Text type="secondary" className="text-[12px]">
            <UserOutlined /> Đạo diễn: {record.director || 'Chưa cập nhật'}
          </Text>
          <div className="flex gap-1 flex-wrap mt-1">
            {(record as any).genres?.map((g: any) => (
              <Tag key={g.genre_id} color="blue" className="text-[10px] m-0">
                {g.genre?.name}
              </Tag>
            ))}
          </div>
        </div>
      ),
    },
    {
      title: 'Chi tiết',
      key: 'details',
      render: (_: any, record: Movie) => (
        <Space orientation="vertical" size={0}>
          <Tag icon={<CalendarOutlined />} className="m-0 border-none bg-slate-100">
            {record.duration} phút
          </Tag>
          <small className="text-slate-500 block mt-1">🌍 {record.language}</small>
          <small className="text-blue-500 block italic">🎥 {record.trailer_url ? 'Có Trailer' : 'Thiếu Trailer'}</small>
        </Space>
      )
    },
    {
      title: 'Độ tuổi',
      dataIndex: 'rating',
      key: 'rating',
      align: 'center' as const,
      render: (rating: MovieRating) => {
        const config: any = { P: 'green', C13: 'blue', C16: 'orange', C18: 'red' };
        return <Tag color={config[rating]} className="font-black px-3 rounded-md">{rating}</Tag>;
      },
    },
    {
      title: 'Trạng thái',
      dataIndex: 'is_active',
      key: 'is_active',
      render: (active: boolean) => (
        <Tag color={active ? 'processing' : 'default'} className="rounded-full">
          {active ? 'Hiển thị' : 'Ẩn'}
        </Tag>
      )
    },
    {
      title: 'Thao tác',
      key: 'action',
      align: 'right' as const,
      render: (_: any, record: Movie) => (
        <Space>
          <Button type="text" className="text-blue-500" icon={<EditOutlined />} onClick={() => handleEdit(record)} />
          <Popconfirm title="Xóa phim này?" onConfirm={() => handleDelete(record.id)}>
            <Button type="text" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const handleEdit = (movie: any) => {
    setEditingId(movie.id);
    form.setFieldsValue({
      ...movie,
      release_date: movie.release_date ? dayjs(movie.release_date) : null,
      end_date: movie.end_date ? dayjs(movie.end_date) : null,
      // Map genre_id để Select Mode Multiple nhận diện được
      genre_ids: movie.genres?.map((g: any) => g.genre_id) || []
    });
    setIsModalOpen(true);
  };

  const onFinish = async (values: any) => {
    const payload = {
    title: values.title,
    rating: values.rating,
    duration: Number(values.duration),
    director: values.director,
    actors: values.actors,
    language: values.language,
    release_date: values.release_date ? values.release_date.toISOString() : null,
    end_date: values.end_date ? values.end_date.toISOString() : null,
    poster_url: values.poster_url,
    landscape_url: values.landscape_url,
    trailer_url: values.trailer_url,
    is_active: values.is_active,
    description: values.description,
    // Đảm bảo gửi mảng ID chuẩn cho Backend
    genre_ids: values.genre_ids || [] 
  };

    try {
      if (editingId) {
        await movieApi.update(String(editingId), payload);
        message.success('Cập nhật phim thành công');
      } else {
        await movieApi.create(payload);
        message.success('Thêm phim mới thành công');
      }
      setIsModalOpen(false);
      fetchMovies();
    } catch (error: any) {
      console.error('Error saving movie:', error);
      message.error('Lỗi khi lưu thông tin');
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await movieApi.delete(String(id));
      message.success('Đã xóa phim');
      fetchMovies();
    } catch (err) {
      console.error('Error deleting movie:', err);
      message.error('Xóa thất bại');
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6 bg-white p-6 rounded-2xl shadow-sm">
        <h1 className="text-2xl font-black text-slate-800 flex items-center gap-2 m-0 uppercase italic">
          <VideoCameraOutlined className="text-red-600" /> QUẢN LÝ PHIM
        </h1>
        <Button 
          type="primary" danger size="large" icon={<PlusOutlined />} 
          onClick={() => { setEditingId(null); form.resetFields(); setIsModalOpen(true); }}
        >
          THÊM PHIM MỚI
        </Button>
      </div>

      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
        <Input 
          prefix={<SearchOutlined />} 
          placeholder="Tìm kiếm phim..." 
          onChange={(e) => setSearchText(e.target.value)}
          className="mb-4 max-w-md h-11"
        />
        <Table columns={columns} dataSource={movies.filter(m => m.title.toLowerCase().includes(searchText.toLowerCase()))} rowKey="id" loading={loading} />
      </div>

      <Modal 
        title={editingId ? "CẬP NHẬT PHIM" : "THÊM PHIM MỚI"}
        open={isModalOpen} 
        onCancel={() => setIsModalOpen(false)} 
        onOk={() => form.submit()} 
        width={1000}
        style={{ top: 20 }}
      >
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="title" label="Tên phim" rules={[{ required: true }]}>
                <Input placeholder="Ví dụ: Lật Mặt 7" className="h-10" />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name="rating" label="Phân loại" rules={[{ required: true }]}>
                <Select className="h-10">
                  <Select.Option value="P">P - Mọi độ tuổi</Select.Option>
                  <Select.Option value="C13">C13 - Trên 13 tuổi</Select.Option>
                  <Select.Option value="C16">C16 - Trên 16 tuổi</Select.Option>
                  <Select.Option value="C18">C18 - Trên 18 tuổi</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name="duration" label="Thời lượng (phút)" rules={[{ required: true }]}>
                <InputNumber min={1} className="w-full h-10" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={8}>
              <Form.Item name="director" label="Đạo diễn">
                <Input prefix={<UserOutlined />} className="h-10" />
              </Form.Item>
            </Col>
            <Col span={16}>
              <Form.Item name="actors" label="Diễn viên">
                <Input placeholder="Các diễn viên cách nhau bởi dấu phẩy" className="h-10" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={8}>
              <Form.Item name="language" label="Ngôn ngữ" rules={[{ required: true }]}>
                <Select className="h-10">
                  <Select.Option value="Tiếng Việt">Tiếng Việt</Select.Option>
                  <Select.Option value="Tiếng Anh (Phụ đề)">Tiếng Anh (Phụ đề)</Select.Option>
                  <Select.Option value="Lồng tiếng">Lồng tiếng</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="release_date" label="Ngày khởi chiếu">
                <DatePicker className="w-full h-10" format="DD/MM/YYYY" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="end_date" label="Ngày kết thúc (dự kiến)">
                <DatePicker className="w-full h-10" format="DD/MM/YYYY" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="poster_url" label="Link Poster (Dọc - 2:3)">
                <Input className="h-10" placeholder="https://..." />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="landscape_url" label="Link Banner (Ngang - 16:9)">
                <Input className="h-10" placeholder="Sử dụng cho trang chủ" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="trailer_url" label="Link Trailer (Youtube ID)">
                <Input className="h-10" placeholder="Ví dụ: dQw4w9WgXcQ" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="is_active" label="Trạng thái hiển thị" initialValue={true}>
                <Select className="h-10">
                  <Select.Option value={true}>Hiển thị công khai</Select.Option>
                  <Select.Option value={false}>Ẩn khỏi danh sách</Select.Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
  <Col span={24}>
    <Form.Item 
      name="genre_ids" // Tên này phải khớp với logic xử lý trong handleEdit
      label="Thể loại phim" 
      rules={[{ required: true, message: 'Vui lòng chọn ít nhất một thể loại!' }]}
    >
      <Select
        mode="multiple" // Cho phép chọn nhiều thể loại (Hành động + Hài chẳng hạn)
        allowClear
        style={{ width: '100%' }}
        placeholder="Chọn các thể loại cho phim"
        className="min-h-10"
      >
        {allGenres.map(genre => (
          <Select.Option key={genre.id} value={genre.id}>
            {genre.name}
          </Select.Option>
        ))}
      </Select>
    </Form.Item>
  </Col>
          </Row>

          <Form.Item name="description" label="Mô tả nội dung phim">
            <Input.TextArea rows={4} placeholder="Tóm tắt nội dung phim..." />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default MovieList;