/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect, useCallback } from 'react';
import { 
  Table, Avatar, Tag, Button, Input, Space,
  message, Modal, Form, Select, Badge, Popconfirm
} from 'antd';
import { 
  UserOutlined, MailOutlined, PhoneOutlined, SearchOutlined, 
  PlusOutlined, EditOutlined, DeleteOutlined, 
  SafetyCertificateOutlined, UserSwitchOutlined
} from '@ant-design/icons';
import { userApi } from '../../services/userApi';
import type { IUser } from '../../types/auth';

interface Props {
  roleName: 'CUSTOMER' | 'STAFF' | 'ADMIN';
  title: string;
}

const UserManagement: React.FC<Props> = ({ roleName, title }) => {
  const [users, setUsers] = useState<IUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<IUser | null>(null);
  const [form] = Form.useForm();

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      // Backend lọc theo role name (Ví dụ: 'CUSTOMER')
      const res = await userApi.getAll({ role: roleName, search: searchText });
      const data = res.data || res;
      setUsers(Array.isArray(data) ? data : []);
    } catch (err: any) {
      console.error(`Fetch ${title} Error:`, err);
      message.error(`Không thể tải danh sách ${title}`);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }, [roleName, searchText, title]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const onFinish = async (values: any) => {
    try {
      if (editingUser) {
        await userApi.update(+editingUser.id, values);
        message.success("Cập nhật thành công");
      } else {
        // Ép roleName khi tạo mới để đảm bảo đúng phân hệ
        await userApi.create({ ...values, roleName: roleName });
        message.success(`Thêm ${title} thành công`);
      }
      setIsModalOpen(false);
      fetchUsers();
    } catch (err: any) {
      message.error(err.response?.data?.message || "Thao tác thất bại");
    }
  };

  const columns = [
    {
      title: title.toUpperCase(),
      key: 'user',
      render: (_: any, record: IUser) => (
        <Space>
          <Avatar 
            size={42} 
            src={record.avatar} 
            icon={<UserOutlined />} 
            className="border-2 border-white shadow-sm"
            style={{ backgroundColor: roleName === 'CUSTOMER' ? '#1677ff' : '#722ed1' }}
          />
          <div>
            <div className="font-bold text-slate-800">{record.full_name || 'Chưa đặt tên'}</div>
            <Tag color="default" className="m-0 text-[10px] leading-none bg-slate-100 border-none text-slate-500">
              ID: {record.id}
            </Tag>
          </div>
        </Space>
      )
    },
    {
      title: 'LIÊN HỆ',
      key: 'contact',
      render: (record: IUser) => (
        <div className="text-xs">
          <div className="flex items-center gap-1.5"><MailOutlined className="opacity-40"/> {record.email}</div>
          <div className="flex items-center gap-1.5 mt-1"><PhoneOutlined className="opacity-40"/> {record.phone || '---'}</div>
        </div>
      )
    },
    {
      title: 'PHÂN LOẠI',
      align: 'center' as const,
      render: (record: IUser) => {
        if (roleName === 'CUSTOMER') {
          return (
            <Tag color="blue" icon={<UserSwitchOutlined />}>
              Thành viên
            </Tag>
          );
        }
        return (
          <Tag color="magenta" icon={<SafetyCertificateOutlined />}>
            {record.role?.name || 'NHÂN VIÊN'}
          </Tag>
        );
      }
    },
    {
      title: 'TRẠNG THÁI',
      dataIndex: 'is_verified',
      align: 'center' as const,
      render: (v: boolean) => v ? 
        <Badge status="success" text="Hoạt động" /> : 
        <Badge status="default" text="Đã khóa" />
    },
    {
      title: 'THAO TÁC',
      align: 'right' as const,
      render: (_: any, record: IUser) => (
        <Space>
          <Button 
            icon={<EditOutlined />} 
            type="text" 
            onClick={() => {
              setEditingUser(record);
              form.setFieldsValue(record);
              setIsModalOpen(true);
            }} 
          />
          <Popconfirm 
            title="Xóa tài khoản này?" 
            onConfirm={() => userApi.delete(+record.id).then(() => fetchUsers())}
            okText="Xóa"
            cancelText="Hủy"
          >
            <Button icon={<DeleteOutlined />} type="text" danger />
          </Popconfirm>
        </Space>
      )
    }
  ];

  return (
    <div className="p-6 bg-[#f8fafc] min-h-full">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div>
            <h2 className="text-xl font-black text-slate-800 flex items-center gap-2 m-0">
              <UserOutlined className="text-indigo-600" />
              QUẢN LÝ {title.toUpperCase()}
            </h2>
            <p className="text-slate-400 text-xs m-0">Dữ liệu tài khoản hệ thống {title.toLowerCase()}</p>
          </div>
          <Space>
            <Input 
              placeholder="Tìm theo tên, email..." 
              prefix={<SearchOutlined />} 
              onChange={e => setSearchText(e.target.value)}
              className="w-64 rounded-lg"
              allowClear
            />
            <Button 
              type="primary" 
              icon={<PlusOutlined />} 
              onClick={() => { setEditingUser(null); form.resetFields(); setIsModalOpen(true); }} 
              className="rounded-lg bg-indigo-600"
            >
              THÊM MỚI
            </Button>
          </Space>
        </div>

        <Table 
          columns={columns} 
          dataSource={users} 
          rowKey="id" 
          loading={loading} 
          pagination={{ pageSize: 8, showTotal: (total) => `Tổng cộng ${total} ${title.toLowerCase()}` }} 
        />
      </div>

      <Modal
        title={editingUser ? `Cập nhật ${title}` : `Thêm ${title} mới`}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={() => form.submit()}
        destroyOnClose
        okText="Xác nhận"
        cancelText="Hủy bỏ"
      >
        <Form form={form} layout="vertical" onFinish={onFinish} className="mt-4">
          <Form.Item name="email" label="Địa chỉ Email" rules={[{ required: true, type: 'email', message: 'Vui lòng nhập đúng định dạng email' }]}>
            <Input disabled={!!editingUser} placeholder="example@gmail.com" />
          </Form.Item>
          
          {!editingUser && (
            <Form.Item name="password" label="Mật khẩu khởi tạo" rules={[{ required: true, min: 6, message: 'Mật khẩu tối thiểu 6 ký tự' }]}>
              <Input.Password placeholder="******" />
            </Form.Item>
          )}

          <div className="grid grid-cols-2 gap-4">
            <Form.Item name="full_name" label="Họ và tên"><Input placeholder="Nguyễn Văn A" /></Form.Item>
            <Form.Item name="phone" label="Số điện thoại"><Input placeholder="09xxxxxxx" /></Form.Item>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Form.Item name="is_verified" label="Trạng thái tài khoản" initialValue={true}>
              <Select options={[{value: true, label: 'Hoạt động'}, {value: false, label: 'Khóa tài khoản'}]} />
            </Form.Item>
            
            <Form.Item label="Hạng (Mặc định)">
              <Input value={roleName === 'CUSTOMER' ? "Thành viên" : "Nhân viên"} disabled className="bg-slate-50" />
            </Form.Item>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default UserManagement;