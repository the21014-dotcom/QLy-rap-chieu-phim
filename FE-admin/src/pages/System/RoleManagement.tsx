/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { 
  Table, Tag, Button, Space, Card, Modal, 
  Checkbox, message, Badge,  Form, Input, Popconfirm
} from 'antd';
import { 
  EditOutlined, 
  LockOutlined, 
  SafetyOutlined, 

  DeleteOutlined,
  PlusOutlined,
  CheckSquareOutlined
} from '@ant-design/icons';
import api from '../../services/api';
// Sử dụng các Interface chuẩn từ file types đã định nghĩa
import type { IRole, IPermission } from '../../types/permission';

const RoleManagement: React.FC = () => {
  const [roles, setRoles] = useState<IRole[]>([]);
  const [allPermissions, setAllPermissions] = useState<IPermission[]>([]);
  const [loading, setLoading] = useState(false);
  
  // States cho Phân Quyền
  const [isPermModalOpen, setIsPermModalOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<IRole | null>(null);
  const [selectedPermIds, setSelectedPermIds] = useState<number[]>([]);

  // States cho CRUD Role
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [form] = Form.useForm();

  // 1. Fetch dữ liệu thực tế (Khớp với Prisma Schema)
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [resRoles, resPerms] = await Promise.all([
        api.get('/roles'),
        api.get('/permissions')
      ]);
      setRoles(resRoles.data);
      setAllPermissions(resPerms.data);
    } catch (err: any) {
      console .error('Error fetching data:', err);
      message.error('Không thể tải dữ liệu hệ thống!');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Nhóm các quyền theo Module để hiển thị Matrix
  const groupedPermissions = useMemo(() => {
    return allPermissions.reduce((acc: Record<string, IPermission[]>, curr) => {
      const module = curr.module || 'OTHERS';
      if (!acc[module]) acc[module] = [];
      acc[module].push(curr);
      return acc;
    }, {});
  }, [allPermissions]);

  // ==============================
  // LOGIC XỬ LÝ PHÂN QUYỀN
  // ==============================
  const handleOpenPermission = (record: IRole) => {
    setEditingRole(record);
    // Trích xuất ID của các permission mà role hiện đang có
    const currentIds = record.permissions?.map(rp => rp.permission_id) || [];
    setSelectedPermIds(currentIds);
    setIsPermModalOpen(true);
  };

  const toggleSelectModule = (moduleName: string) => {
    const modulePermIds = groupedPermissions[moduleName].map(p => p.id);
    const allSelected = modulePermIds.every(id => selectedPermIds.includes(id));

    if (allSelected) {
      setSelectedPermIds(prev => prev.filter(id => !modulePermIds.includes(id)));
    } else {
      setSelectedPermIds(prev => [...new Set([...prev, ...modulePermIds])]);
    }
  };

  const handleUpdatePermissions = async () => {
    if (!editingRole) return;
    try {
      setLoading(true);
      await api.put(`/roles/${editingRole.id}/permissions`, {
        permissionIds: selectedPermIds // Gửi mảng ID về backend
      });
      message.success(`Đã cập nhật quyền cho nhóm [${editingRole.name}]`);
      setIsPermModalOpen(false);
      fetchData();
    } catch (err: any) {
      console .error('Error updating permissions:', err);
      message.error('Cập nhật quyền hạn thất bại!');
    } finally {
      setLoading(false);
    }
  };

  // ==============================
  // LOGIC XỬ LÝ CRUD ROLE
  // ==============================
  const handleOpenCreateRole = () => {
    setModalMode('create');
    setEditingRole(null);
    form.resetFields();
    setIsRoleModalOpen(true);
  };

  const handleOpenEditRole = (record: IRole) => {
    setModalMode('edit');
    setEditingRole(record);
    form.setFieldsValue({
      name: record.name,
      description: record.description
    });
    setIsRoleModalOpen(true);
  };

  const onSubmitRoleForm = async (values: any) => {
    try {
      setLoading(true);
      if (modalMode === 'create') {
        await api.post('/roles', values);
        message.success('Thêm vai trò mới thành công!');
      } else if (modalMode === 'edit' && editingRole) {
        await api.put(`/roles/${editingRole.id}`, values);
        message.success('Cập nhật thông tin thành công!');
      }
      setIsRoleModalOpen(false);
      fetchData();
    } catch (err: any) {
      message.error(err.response?.data?.message || 'Lỗi lưu dữ liệu!');
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { 
      title: 'VAI TRÒ / CHỨC VỤ', 
      key: 'role_info',
      render: (_: any, record: IRole) => (
        <Space direction="vertical" size={0}>
          <div className="flex items-center gap-2">
            <b className="text-slate-800 uppercase tracking-tighter">{record.name}</b>
            {/* Giả sử bạn thêm is_system vào Prisma sau này để bảo vệ Role gốc */}
            {(record as any).is_system && <Badge status="processing" text="Hệ thống" color="green" />}
          </div>
          <span className="text-slate-400 text-xs">{record.description || 'Chưa có mô tả'}</span>
        </Space>
      ) 
    },
    { 
      title: 'QUYỀN HẠN', 
      key: 'perms_count',
      render: (_: any, record: IRole) => (
        <Tag color="cyan" className="border-none bg-cyan-50 text-cyan-600 font-medium">
          {record.permissions?.length || 0} quyền được gán
        </Tag>
      )
    },
    {
      title: 'THAO TÁC',
      key: 'action',
      align: 'right' as const,
      render: (_: any, record: IRole) => (
        <Space>
          <Button 
            type="primary" 
            ghost 
            size="small" 
            icon={<LockOutlined />}
            onClick={() => handleOpenPermission(record)}
          >
            Phân quyền
          </Button>
          <Button 
            type="text" 
            size="small" 
            icon={<EditOutlined className="text-blue-600" />} 
            onClick={() => handleOpenEditRole(record)}
          />
          {!(record as any).is_system && (
            <Popconfirm
              title="Xóa vai trò này?"
              onConfirm={() => {/* Logic xóa */}}
              okText="Xóa"
              cancelText="Hủy"
              okButtonProps={{ danger: true }}
            >
              <Button type="text" danger size="small" icon={<DeleteOutlined />} />
            </Popconfirm>
          )}
        </Space>
      )
    }
  ];

  return (
    <div className="space-y-4">
      {/* Header Banner */}
      <Card className="border-none shadow-sm bg-gradient-to-r from-slate-900 to-slate-800 rounded-xl">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-white text-xl font-bold m-0 flex items-center gap-2">
              <SafetyOutlined className="text-red-500" /> QUẢN LÝ PHÂN QUYỀN
            </h2>
            <p className="text-slate-400 m-0 text-xs mt-1">Thiết lập các nhóm vai trò và giới hạn quyền truy cập tài nguyên</p>
          </div>
          <Button 
            type="primary" 
            icon={<PlusOutlined />} 
            danger
            onClick={handleOpenCreateRole}
            className="h-10 px-6 font-bold"
          >
            THÊM VAI TRÒ
          </Button>
        </div>
      </Card>

      <Table 
        dataSource={roles} 
        columns={columns} 
        rowKey="id" 
        loading={loading}
        pagination={false} 
        className="shadow-sm rounded-lg overflow-hidden border border-slate-100"
      />

      {/* Modal CRUD Role */}
      <Modal
        title={modalMode === 'create' ? 'TẠO MỚI VAI TRÒ' : 'CẬP NHẬT VAI TRÒ'}
        open={isRoleModalOpen}
        onCancel={() => setIsRoleModalOpen(false)}
        onOk={() => form.submit()}
        confirmLoading={loading}
        destroyOnClose
      >
        <Form form={form} layout="vertical" onFinish={onSubmitRoleForm} className="pt-4">
          <Form.Item name="name" label="Tên vai trò" rules={[{ required: true }]}>
            <Input placeholder="VD: NHAN_VIEN_BAN_VE" />
          </Form.Item>
          <Form.Item name="description" label="Mô tả">
            <Input.TextArea rows={3} placeholder="Mô tả trách nhiệm của vai trò này..." />
          </Form.Item>
        </Form>
      </Modal>

      {/* Modal Phân quyền Matrix */}
      <Modal
        title={<div className="pb-2 border-b uppercase font-black text-blue-600">Thiết lập quyền: {editingRole?.name}</div>}
        open={isPermModalOpen}
        onCancel={() => setIsPermModalOpen(false)}
        onOk={handleUpdatePermissions}
        width={900}
        confirmLoading={loading}
        okText="CẬP NHẬT HỆ THỐNG"
        okButtonProps={{ className: 'bg-blue-600' }}
        centered
      >
        <div className="max-h-[70vh] overflow-y-auto pr-2 mt-4">
          {Object.keys(groupedPermissions).map(moduleName => (
            <div key={moduleName} className="mb-6 bg-slate-50 rounded-xl border border-slate-100 overflow-hidden">
              <div className="bg-white px-4 py-2 flex justify-between items-center border-b border-slate-100">
                <h4 className="m-0 font-bold text-slate-700 flex items-center gap-2">
                  <CheckSquareOutlined className="text-blue-500" /> {moduleName}
                </h4>
                <Button size="small" type="link" onClick={() => toggleSelectModule(moduleName)}>
                  Thêm/Bỏ nhanh tất cả
                </Button>
              </div>
              
              <div className="p-4 grid grid-cols-2 gap-3">
                {groupedPermissions[moduleName].map(perm => (
                  <div 
                    key={perm.id}
                    onClick={() => {
                      const id = perm.id;
                      setSelectedPermIds(prev => 
                        prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
                      );
                    }}
                    className={`flex justify-between items-center p-3 rounded-lg border transition-all cursor-pointer hover:shadow-sm
                      ${selectedPermIds.includes(perm.id) ? 'bg-blue-50 border-blue-200' : 'bg-white border-slate-200'}
                    `}
                  >
                    <div>
                      <div className="text-sm font-bold text-slate-700 leading-none">{perm.name}</div>
                      <small className="text-[10px] text-slate-400 font-mono italic">{perm.api_path}</small>
                    </div>
                    <Checkbox checked={selectedPermIds.includes(perm.id)} />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Modal>
    </div>
  );
};

export default RoleManagement;