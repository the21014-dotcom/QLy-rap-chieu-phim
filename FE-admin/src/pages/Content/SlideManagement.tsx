/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import { 
  Card, Button, Image, List, Tag, Popconfirm, 
  Switch, Tooltip, Modal, Form, Input, InputNumber, 
  Select, Upload, Divider 
} from 'antd';
import { 
  PlusOutlined, 
  DeleteOutlined, 
  EditOutlined, 
  CloudUploadOutlined, 
  LinkOutlined, 
  OrderedListOutlined,
  EyeOutlined
} from '@ant-design/icons';

// 1. Interface khớp 100% với Prisma Schema
interface Slide {
  id: string;
  title: string;
  image_url: string;
  link_url?: string;      
  movie_id?: string;     
  position: number;       
  is_active: boolean;     
  created_at: string;
}

const SlideManagement: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [editingId, setEditingId] = useState<string | null>(null);

  // Dữ liệu giả lập
  const [slides, setSlides] = useState<Slide[]>([
    { 
      id: 'sld-01', 
      title: 'Khuyến mãi hè 2026 - Giảm 50% bắp nước', 
      image_url: 'https://ocwp.cgv.vn/media/banner/cache/1/3/13-promotion.jpg', 
      link_url: '/promotions/summer-2026',
      position: 1,
      is_active: true,
      created_at: '2026-04-01'
    },
    { 
      id: 'sld-02', 
      title: 'Banner Captain America: New World', 
      image_url: 'https://ocwp.cgv.vn/media/banner/cache/1/3/captain-america-banner.jpg', 
      movie_id: 'mov-99',
      position: 2,
      is_active: true,
      created_at: '2026-04-10'
    },
  ]);

  // FIX: Đưa logic tạo ID và Date vào bên trong hàm xử lý sự kiện để tránh lỗi Purity
  const handleSubmit = (values: any) => {
    const isEditing = !!editingId;
    
    const slideData: Slide = {
      id: isEditing ? editingId! : `sld-${Date.now()}`,
      title: values.title,
      image_url: values.image_url,
      link_url: values.link_url,
      movie_id: values.movie_id,
      position: values.position,
      is_active: values.is_active,
      created_at: isEditing 
        ? (slides.find(s => s.id === editingId)?.created_at || new Date().toISOString()) 
        : new Date().toISOString().split('T')[0]
    };

    if (isEditing) {
      setSlides(prev => prev.map(s => s.id === editingId ? slideData : s));
    } else {
      setSlides(prev => [...prev, slideData]);
    }
    
    setIsModalOpen(false);
    setEditingId(null);
    form.resetFields();
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex justify-between items-end border-b border-slate-100 pb-4">
        <div>
          <h1 className="text-2xl font-black italic uppercase text-slate-800 m-0">
            Hệ thống Banner & Slide trang chủ
          </h1>
          <p className="text-slate-400 text-xs">Quản lý nội dung hiển thị tại Header của ứng dụng/website</p>
        </div>
        <Button 
          type="primary" 
          danger 
          icon={<PlusOutlined />} 
          size="large" 
          className="font-bold shadow-lg shadow-red-200"
          onClick={() => { 
            setEditingId(null); 
            form.resetFields(); 
            setIsModalOpen(true); 
          }}
        >
          TẠO BANNER MỚI
        </Button>
      </div>

      {/* Grid Danh sách Slide */}
      <List
        grid={{ gutter: 20, xs: 1, sm: 2, md: 2, lg: 3 }}
        dataSource={[...slides].sort((a, b) => a.position - b.position)}
        renderItem={(item) => (
          <List.Item>
            <Card
              className="overflow-hidden rounded-xl border-none shadow-md hover:shadow-xl transition-all duration-300 group"
              cover={
                <div className="relative overflow-hidden h-[200px]">
                  <Image 
                    src={item.image_url} 
                    alt={item.title} 
                    preview={{ mask: <EyeOutlined /> }}
                    className="object-cover w-full h-full group-hover:scale-105 transition-transform" 
                  />
                  <div className="absolute top-2 left-2 flex gap-1">
                    <Tag color="black" className="m-0 font-mono opacity-80">#{item.position}</Tag>
                  </div>
                  {!item.is_active && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center z-10">
                      <Tag color="default" className="text-lg px-4 py-1">ĐÃ ẨN</Tag>
                    </div>
                  )}
                </div>
              }
              actions={[
                <Tooltip key="edit" title="Chỉnh sửa">
                  <Button 
                    type="text" 
                    icon={<EditOutlined />} 
                    onClick={() => { 
                      setEditingId(item.id);
                      form.setFieldsValue(item);
                      setIsModalOpen(true); 
                    }} 
                  />
                </Tooltip>,
                <Tooltip key="toggle" title={item.is_active ? "Tắt hiển thị" : "Bật hiển thị"}>
                  <Switch 
                    size="small" 
                    checked={item.is_active} 
                    onChange={(checked) => setSlides(prev => prev.map(s => s.id === item.id ? {...s, is_active: checked} : s))} 
                  />
                </Tooltip>,
                <Popconfirm 
                  key="delete" 
                  title="Xóa banner này vĩnh viễn?" 
                  onConfirm={() => setSlides(prev => prev.filter(s => s.id !== item.id))}
                >
                  <Button type="text" danger icon={<DeleteOutlined />} />
                </Popconfirm>
              ]}
            >
              <Card.Meta 
                title={<span className="text-slate-700 font-bold truncate block">{item.title}</span>} 
                description={
                  <div className="space-y-1 mt-2">
                    <div className="flex items-center gap-1 text-[11px] text-blue-500">
                      <LinkOutlined /> 
                      <span className="truncate">{item.movie_id ? `Movie ID: ${item.movie_id}` : item.link_url}</span>
                    </div>
                  </div>
                } 
              />
            </Card>
          </List.Item>
        )}
      />

      {/* Modal Thêm/Sửa Banner */}
      <Modal
        title={<span className="font-black italic text-lg uppercase">{editingId ? "Cập nhật Slide" : "Tạo Slide mới"}</span>}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={() => form.submit()}
        width={600}
        okText="LƯU BANNER"
        cancelText="HỦY"
        okButtonProps={{ danger: true, type: 'primary' }}
      >
        <Form form={form} layout="vertical" className="mt-4" initialValues={{ is_active: true, position: 1 }} onFinish={handleSubmit}>
          <Form.Item name="title" label="Tiêu đề Banner" rules={[{ required: true, message: 'Vui lòng nhập tiêu đề' }]}>
            <Input placeholder="Ví dụ: Khuyến mãi bắp nước tháng 5..." />
          </Form.Item>

          <div className="grid grid-cols-2 gap-4">
            <Form.Item name="position" label="Vị trí hiển thị">
              <InputNumber min={1} className="w-full" addonBefore={<OrderedListOutlined />} />
            </Form.Item>
            <Form.Item name="is_active" label="Trạng thái" valuePropName="checked">
              <Switch checkedChildren="Hiển thị" unCheckedChildren="Ẩn" />
            </Form.Item>
          </div>

          <Form.Item label="Hình ảnh Banner (Tỷ lệ 16:9 hoặc 21:9)">
            <Upload.Dragger className="bg-slate-50" beforeUpload={() => false}>
              <p className="ant-upload-drag-icon"><CloudUploadOutlined className="text-red-500" /></p>
              <p className="text-xs text-slate-500 font-bold">Kéo thả ảnh hoặc Click để chọn</p>
              <p className="text-[10px] text-slate-400 uppercase">Khuyên dùng: 1920x800px</p>
            </Upload.Dragger>
          </Form.Item>

          <Form.Item name="image_url" label="Hoặc nhập Link ảnh trực tiếp" rules={[{ required: true, message: 'Vui lòng nhập link ảnh' }]}>
            <Input placeholder="https://..." />
          </Form.Item>

          <Divider>
            <span className="text-[10px] text-slate-400 font-bold uppercase italic">Điều hướng khi Click</span>
          </Divider>

          <div className="bg-slate-50 p-4 rounded-lg">
             <Form.Item name="movie_id" label="Liên kết tới Phim (Movie ID)">
                <Select placeholder="Chọn phim từ danh sách..." allowClear>
                    <Select.Option value="mov-99">Captain America: New World</Select.Option>
                    <Select.Option value="mov-100">Lật Mặt 7</Select.Option>
                </Select>
             </Form.Item>
             <div className="text-center text-[10px] my-1 text-slate-300">--- HOẶC ---</div>
             <Form.Item name="link_url" label="Link URL tự do">
                <Input prefix={<LinkOutlined />} placeholder="/promotions/..." />
             </Form.Item>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default SlideManagement;