/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Card, Col, Row, Typography, Tag, Descriptions, 
  Table, Divider, Button, Skeleton, Result, Space, Avatar, Badge
} from 'antd';
import { 
  ArrowLeftOutlined, FileExcelOutlined, 
  CheckCircleOutlined, 
  UserOutlined, VideoCameraOutlined, CreditCardOutlined,
  EnvironmentOutlined, CalendarOutlined, InfoCircleOutlined
} from '@ant-design/icons';
import api from '../../services/api';
import { formatCurrency } from '../../utils/format';
import moment from 'moment';
import * as XLSX from 'xlsx';

const { Title, Text } = Typography;

const InvoiceDetail: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState<any>(null);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        // Sử dụng endpoint chuẩn từ backend của bạn
        const response = await api.get(`/payments/booking-detail/${id}`);
        setBooking(response.data.data || response.data);
      } catch (error) {
        console.error("Lỗi tải chi tiết:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [id]);

  // --- LOGIC TÍNH TOÁN TỔNG TIỀN CHUẨN ---
  const totalTicketPrice = booking?.tickets?.reduce((sum: number, t: any) => sum + Number(t.price || 0), 0) || 0;
  const totalFoodPrice = booking?.booking_foods?.reduce((sum: number, f: any) => sum + (Number(f.price || 0) * Number(f.quantity || 0)), 0) || 0;
  const discountAmount = Number(booking?.promotion?.discount_value || 0);
  
  // Tổng thanh toán cuối cùng = Vé + Food - Giảm giá
  const finalCalculatedTotal = totalTicketPrice + totalFoodPrice - discountAmount;

  const handleExportExcel = () => {
    if (!booking) return;
    const workbook = XLSX.utils.book_new();
    
    const summaryData = [
      ["HÓA ĐƠN ĐIỆN TỬ CINEMA", ""],
      ["Mã đơn hàng", `#BK2026${booking.id}`],
      ["Khách hàng", booking.user?.full_name],
      ["Phim", booking.showtime?.movie?.title],
      ["Thời gian", moment(booking.showtime?.start_time).format('HH:mm DD/MM/YYYY')],
      ["Tiền vé", totalTicketPrice],
      ["Tiền bắp nước", totalFoodPrice],
      ["Giảm giá", discountAmount],
      ["TỔNG THANH TOÁN", finalCalculatedTotal],
      ["Trạng thái", booking.status === 'SUCCESS' ? 'Đã thanh toán' : 'Chờ xử lý'],
      [""]
    ];

    const wsData = [...summaryData];
    const worksheet = XLSX.utils.aoa_to_sheet(wsData);
    XLSX.utils.book_append_sheet(workbook, worksheet, "Chi_tiet");
    XLSX.writeFile(workbook, `CGV_Invoice_${booking.id}.xlsx`);
  };

  if (loading) return <div style={{ padding: 40 }}><Skeleton active paragraph={{ rows: 15 }} /></div>;
  if (!booking) return <Result status="404" title="Không tìm thấy hóa đơn" subTitle="Vui lòng kiểm tra lại mã đơn hàng hoặc liên hệ quản trị viên." />;

  return (
    <div style={{ padding: '24px', background: '#f0f2f5', minHeight: '100vh' }}>
      {/* Header Bar */}
      <div style={{ marginBottom: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Button 
          icon={<ArrowLeftOutlined />} 
          onClick={() => navigate(-1)} 
          type="text"
          style={{ fontWeight: 500 }}
        >
          Quay lại danh sách
        </Button>
        <Space>
          <Button icon={<FileExcelOutlined />} onClick={handleExportExcel}>Xuất hóa đơn</Button>
          <Button type="primary" danger icon={<CheckCircleOutlined />}>Gửi Email khách hàng</Button>
        </Space>
      </div>

      <Row gutter={[24, 24]}>
        {/* Cột trái: Thông tin chính */}
        <Col span={16}>
          <Card bordered={false} style={{ borderRadius: 8, overflow: 'hidden' }}>
            <div style={{ background: '#222', padding: '16px 24px', margin: '-24px -24px 24px -24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Title level={4} style={{ color: '#fff', margin: 0 }}>
                <VideoCameraOutlined style={{ marginRight: 10 }} />
                THÔNG TIN VÉ XEM PHIM
              </Title>
              <Badge 
                status={booking.status === 'SUCCESS' ? 'success' : 'warning'} 
                text={<span style={{ color: '#fff' }}>{booking.status === 'SUCCESS' ? 'ĐÃ THANH TOÁN' : 'CHỜ THANH TOÁN'}</span>} 
              />
            </div>

            <Row gutter={24}>
              <Col span={24}>
                <div style={{ marginBottom: 24 }}>
                   <Text type="secondary" style={{ fontSize: 12 }}>PHIM</Text>
                   <Title level={3} style={{ marginTop: 4, color: '#e71a0f' }}>{booking.showtime?.movie?.title?.toUpperCase()}</Title>
                </div>
              </Col>
              <Col span={12}>
                <Descriptions column={1} labelStyle={{ color: '#888' }}>
                  <Descriptions.Item label={<><EnvironmentOutlined /> Rạp</>}>
                    <Text strong>{booking.showtime?.room?.cinema?.name}</Text>
                  </Descriptions.Item>
                  <Descriptions.Item label={<><CalendarOutlined /> Thời gian</>}>
                    <Text strong>{moment(booking.showtime?.start_time).format('DD/MM/YYYY')} - {moment(booking.showtime?.start_time).format('HH:mm')}</Text>
                  </Descriptions.Item>
                </Descriptions>
              </Col>
              <Col span={12}>
                <Descriptions column={1} labelStyle={{ color: '#888' }}>
                  <Descriptions.Item label="Phòng chiếu">
                    <Text strong>{booking.showtime?.room?.name}</Text>
                  </Descriptions.Item>
                  <Descriptions.Item label="Ghế ngồi">
                    <Space wrap>
                      {booking.tickets?.map((t: any) => (
                        <Tag key={t.id} color="volcano" style={{ fontWeight: 'bold' }}>
                          {t.seat?.row}{t.seat?.number}
                        </Tag>
                      ))}
                    </Space>
                  </Descriptions.Item>
                </Descriptions>
              </Col>
            </Row>

            <Divider orientation="left" style={{ borderColor: '#f0f0f0' }}> CHI TIẾT DỊCH VỤ</Divider>
            
            <Table 
              pagination={false}
              size="middle"
              dataSource={[
                ...(booking.tickets || []).map((t: any) => ({ ...t, key: `t-${t.id}`, name: `Vé xem phim - Ghế ${t.seat?.row}${t.seat?.number}`, type: 'Ticket' })),
                ...(booking.booking_foods || []).map((f: any) => ({ ...f, key: `f-${f.id}`, name: f.food?.name, type: 'Food' }))
              ]}
              columns={[
                { title: 'Nội dung dịch vụ', dataIndex: 'name', key: 'name' },
                { title: 'Số lượng', dataIndex: 'quantity', key: 'quantity', align: 'center', render: (val, record) => record.type === 'Ticket' ? 1 : val },
                { title: 'Đơn giá', dataIndex: 'price', key: 'price', align: 'right', render: (val) => formatCurrency(val) },
                { title: 'Thành tiền', key: 'subtotal', align: 'right', render: (_, record: any) => formatCurrency(record.price * (record.quantity || 1)) },
              ]}
            />
          </Card>
        </Col>

        {/* Cột phải: Thanh toán & Khách hàng */}
        <Col span={8}>
          {/* Thông tin khách hàng */}
          <Card bordered={false} style={{ borderRadius: 8, marginBottom: 24 }}>
            <Title level={5}><UserOutlined /> KHÁCH HÀNG</Title>
            <Divider style={{ margin: '12px 0' }} />
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: 16 }}>
              <Avatar size={48} icon={<UserOutlined />} src={booking.user?.avatar} />
              <div style={{ marginLeft: 12 }}>
                <Text strong style={{ fontSize: 16 }}>{booking.user?.full_name}</Text><br />
                <Text type="secondary">{booking.user?.email}</Text>
              </div>
            </div>
          </Card>

          {/* Tổng kết tiền bạc */}
          <Card 
            bordered={false} 
            style={{ borderRadius: 8, background: '#fff', borderTop: '4px solid #e71a0f' }}
          >
            <Title level={5}><CreditCardOutlined /> TÓM TẮT THANH TOÁN</Title>
            <Divider style={{ margin: '12px 0' }} />
            
            <Space direction="vertical" style={{ width: '100%' }} size="middle">
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Text type="secondary">Tổng tiền vé:</Text>
                <Text strong>{formatCurrency(totalTicketPrice)}</Text>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Text type="secondary">Tổng combo/nước:</Text>
                <Text strong>{formatCurrency(totalFoodPrice)}</Text>
              </div>
              {discountAmount > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Text type="secondary">Giảm giá ({booking.promotion?.code}):</Text>
                  <Text type="danger">- {formatCurrency(discountAmount)}</Text>
                </div>
              )}
              
              <div style={{ background: '#fafafa', padding: '16px', borderRadius: 8, marginTop: 10 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Text strong style={{ fontSize: 16 }}>TỔNG CỘNG:</Text>
                  <Title level={3} style={{ margin: 0, color: '#e71a0f' }}>
                    {formatCurrency(finalCalculatedTotal)}
                  </Title>
                </div>
              </div>

              <div style={{ marginTop: 10 }}>
                <Text type="secondary" style={{ fontSize: 12 }}>
                  <InfoCircleOutlined /> Phương thức thanh toán: 
                  <Tag color="blue" style={{ marginLeft: 8 }}>{booking.payment?.payment_method || 'VNPAY'}</Tag>
                </Text>
              </div>
            </Space>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default InvoiceDetail;