import React from 'react';
import { Modal, Form, Input, InputNumber, Switch, Select, Divider, Row, Col } from 'antd';
import { PictureOutlined, InfoCircleOutlined, TagsOutlined, DollarOutlined } from '@ant-design/icons';
/* eslint-disable @typescript-eslint/no-explicit-any */

interface Props {
  open: boolean;
  onCancel: () => void;
  onSave: (values: any) => void;
  initialValues?: any | null;
}

const ServiceModal: React.FC<Props> = ({ open, onCancel, onSave, initialValues }) => {
  const [form] = Form.useForm();

  React.useEffect(() => {
    if (open) {
      if (initialValues) {
        form.setFieldsValue(initialValues);
      } else {
        form.resetFields();
        form.setFieldsValue({ 
          is_available: true, 
          category: 'COMBO', // Mặc định khớp Enum FoodCategory
          price: 0 
        });
      }
    }
  }, [open, initialValues, form]);

  return (
    <Modal
      title={
        <div className="flex items-center gap-3 border-b pb-4">
           <div className={`w-3 h-8 rounded-full ${initialValues ? 'bg-orange-500' : 'bg-green-500 shadow-lg shadow-green-100'}`}></div>
           <span className="font-black text-xl text-slate-800 uppercase italic tracking-tighter">
             {initialValues ? "Chỉnh sửa thông tin món" : "Thêm món mới vào Menu"}
           </span>
        </div>
      }
      open={open}
      onCancel={onCancel}
      onOk={() => form.submit()}
      destroyOnHidden={true}
      width={700}
      okText={initialValues ? "LƯU THAY ĐỔI" : "TẠO MÓN MỚI"}
      cancelText="HỦY BỎ"
      okButtonProps={{ className: 'h-10 px-8 font-bold rounded-lg' }}
      cancelButtonProps={{ className: 'h-10 px-8 rounded-lg' }}
    >
      <Form 
        form={form} 
        layout="vertical" 
        onFinish={onSave}
        className="mt-6"
        requiredMark={false}
      >
        <Row gutter={24}>
          <Col span={14}>
            <Form.Item 
              name="name" 
              label={<span className="font-bold text-slate-600 uppercase text-[11px]"><TagsOutlined /> Tên món ăn / Combo</span>} 
              rules={[{ required: true, message: 'Tên món không được để trống!' }]}
            >
              <Input placeholder="Ví dụ: Combo Bắp Phô Mai & Coca" size="large" className="rounded-lg" />
            </Form.Item>
          </Col>
          <Col span={10}>
            <Form.Item 
              name="category" 
              label={<span className="font-bold text-slate-600 uppercase text-[11px]">Phân loại (Prisma Enum)</span>} 
              rules={[{ required: true }]}
            >
              <Select size="large" className="rounded-lg">
                <Select.Option value="CORN">Bắp rang (CORN)</Select.Option>
                <Select.Option value="DRINK">Nước uống (DRINK)</Select.Option>
                <Select.Option value="COMBO">Combo bắp nước (COMBO)</Select.Option>
                <Select.Option value="SNACK">Đồ ăn vặt (SNACK)</Select.Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={24}>
          <Col span={14}>
            <Form.Item 
              name="price" 
              label={<span className="font-bold text-slate-600 uppercase text-[11px]"><DollarOutlined /> Giá bán niêm yết (VNĐ)</span>} 
              rules={[{ required: true, message: 'Vui lòng nhập giá bán!' }]}
            >
              <InputNumber 
                className="w-full rounded-lg" 
                size="large"
                min={0}
                formatter={v => `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} 
                parser={v => v!.replace(/\$\s?|(,*)/g, '') as any}
                placeholder="0"
                addonAfter="VNĐ"
              />
            </Form.Item>
          </Col>
          <Col span={10}>
            <Form.Item 
              name="is_available" 
              label={<span className="font-bold text-slate-600 uppercase text-[11px]">Kinh doanh ngay?</span>} 
              valuePropName="checked"
            >
              <Switch 
                checkedChildren="ĐANG BÁN" 
                unCheckedChildren="TẠM DỪNG" 
                className="mt-1"
              />
            </Form.Item>
          </Col>
        </Row>

        <Divider className="my-4" />

        <Form.Item 
          name="image_url" 
          label={<span className="font-bold text-slate-600 uppercase text-[11px]"><PictureOutlined /> Đường dẫn hình ảnh (Poster/Thumbnail)</span>}
          rules={[{ type: 'string', message: 'Vui lòng nhập URL hợp lệ' }]}
        >
          <Input placeholder="https://image-server.com/food-image.jpg" size="large" className="rounded-lg" />
        </Form.Item>

        <Form.Item 
          name="description" 
          label={<span className="font-bold text-slate-600 uppercase text-[11px]"><InfoCircleOutlined /> Chi tiết thành phần</span>}
        >
          <Input.TextArea 
            rows={3} 
            placeholder="Mô tả chi tiết (Vd: 1 bắp caramel lớn, 2 pepsi vừa, 1 xúc xích...)" 
            className="rounded-lg"
          />
        </Form.Item>
        
        <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 flex items-start gap-3">
           <InfoCircleOutlined className="text-blue-500 mt-1" />
           <p className="text-[12px] text-blue-700 m-0 leading-relaxed font-medium">
             Dữ liệu này sẽ được đồng bộ trực tiếp với ứng dụng của khách hàng. Hãy đảm bảo hình ảnh rõ nét và mô tả chính xác các thành phần trong combo.
           </p>
        </div>
      </Form>
    </Modal>
  );
};

export default ServiceModal;