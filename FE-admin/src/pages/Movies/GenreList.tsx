/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from 'react';
import { Table, Button, Space, Input, Modal, Form, message, Popconfirm, Card } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, TagOutlined } from '@ant-design/icons';
import axios from 'axios';
import type { Genre } from '../../types/genre';

const API_URL = 'http://localhost:8080/api/v1/genres';

const GenreList: React.FC = () => {
  const [genres, setGenres] = useState<Genre[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingGenre, setEditingGenre] = useState<Genre | null>(null);
  const [form] = Form.useForm();

  // 1. Hàm gọi API lấy danh sách thật từ Database
  const fetchGenres = async () => {
    setLoading(true);
    try {
      const response = await axios.get(API_URL);
      setGenres(response.data);
    } catch (error: any) {
      console.error('Error fetching genres:', error);
      message.error('Không thể kết nối đến máy chủ!');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchGenres(); }, []);

  // 2. Xử lý thêm mới hoặc cập nhật
  const onFinish = async (values: any) => {
    try {
      if (editingGenre) {
        // Cập nhật (PATCH)
        await axios.patch(`${API_URL}/${editingGenre.id}`, values);
        message.success('Cập nhật thể loại thành công!');
      } else {
        // Thêm mới (POST)
        await axios.post(API_URL, values);
        message.success('Thêm thể loại mới thành công!');
      }
      setIsModalOpen(false);
      fetchGenres(); // Load lại dữ liệu mới nhất
    } catch (error: any) {
      const errorMsg = error.response?.data?.message || 'Thao tác thất bại!';
      message.error(errorMsg);
    }
  };

  // 3. Xử lý xóa
  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      message.success('Đã xóa thể loại thành công');
      fetchGenres();
    } catch (error: any) {
      console .error('Delete Genre Error:', error);
      message.error('Không thể xóa thể loại này!');
    }
  };

  const columns = [
    {
      title: 'Tên thể loại',
      dataIndex: 'name',
      key: 'name',
      render: (text: string) => <span className="font-bold text-blue-600"><TagOutlined className="mr-2" />{text}</span>,
    },
    {
      title: 'Mô tả',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
    },
    {
      title: 'Số lượng phim',
      dataIndex: '_count', // Prisma trả về thông tin count trong object _count
      key: 'movie_count',
      align: 'center' as const,
      render: (countObj: any) => <b className="text-red-500">{countObj?.movies || 0}</b>,
    },
    {
      title: 'Thao tác',
      key: 'action',
      width: 200,
      render: (_: any, record: Genre) => (
        <Space size="middle">
          <Button 
            type="text" 
            icon={<EditOutlined className="text-orange-500" />} 
            onClick={() => {
              setEditingGenre(record);
              form.setFieldsValue(record);
              setIsModalOpen(true);
            }}
          >
            Sửa
          </Button>
          <Popconfirm 
            title="Xóa thể loại này?" 
            description="Lưu ý: Các phim thuộc thể loại này sẽ bị gỡ nhãn."
            onConfirm={() => handleDelete(record.id)}
            okText="Xóa"
            cancelText="Hủy"
            okButtonProps={{ danger: true }}
          >
            <Button type="text" danger icon={<DeleteOutlined />}>Xóa</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <Card className="shadow-sm border-none bg-gradient-to-r from-slate-800 to-slate-900">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-black text-white m-0 uppercase italic tracking-wider">Quản lý thể loại</h1>
            <p className="text-slate-400 m-0">Danh mục phân loại phim cho hệ thống TA Cinema</p>
          </div>
          <Button 
            type="primary" 
            size="large" 
            icon={<PlusOutlined />} 
            onClick={() => {
              setEditingGenre(null);
              form.resetFields();
              setIsModalOpen(true);
            }}
            className="bg-red-600 hover:bg-red-700 border-none h-12 px-8 font-bold"
          >
            THÊM THỂ LOẠI
          </Button>
        </div>
      </Card>

      <Table 
        columns={columns} 
        dataSource={genres} 
        rowKey="id" 
        loading={loading}
        pagination={{ pageSize: 8 }}
        className="shadow-md rounded-xl overflow-hidden"
      />

      <Modal 
        title={<span className="text-xl font-bold uppercase">{editingGenre ? 'Cập nhật thể loại' : 'Thêm thể loại mới'}</span>}
        open={isModalOpen} 
        onCancel={() => setIsModalOpen(false)} 
        onOk={() => form.submit()}
        destroyOnClose
        okText="Lưu lại"
        cancelText="Hủy bỏ"
        okButtonProps={{ className: 'bg-red-600' }}
      >
        <Form form={form} layout="vertical" onFinish={onFinish} className="mt-6">
          <Form.Item 
            name="name" 
            label={<span className="font-semibold">Tên thể loại</span>}
            rules={[{ required: true, message: 'Vui lòng nhập tên thể loại!' }]}
          >
            <Input placeholder="Ví dụ: Hành động, Tình cảm..." size="large" />
          </Form.Item>
          
          <Form.Item 
            name="description" 
            label={<span className="font-semibold">Mô tả chi tiết</span>}
          >
            <Input.TextArea rows={4} placeholder="Nhập mô tả chi tiết cho thể loại phim này..." />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default GenreList;