/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Card, Button, Typography, Space, message, Tooltip, Tag, Row, Col, Divider
} from 'antd';
import { 
  SaveOutlined, ReloadOutlined, ArrowLeftOutlined, 
  PlayCircleOutlined, CheckCircleFilled, CloseCircleFilled
} from '@ant-design/icons';
import api from '../../services/api';

const { Title, Text } = Typography;

// --- CONFIG GHẾ ---
const SEAT_CONFIG: any = {
  NORMAL: { label: 'Ghế thường', color: '#10b981', bg: 'bg-emerald-100', text: 'text-emerald-700' },
  VIP: { label: 'VIP', color: '#f59e0b', bg: 'bg-amber-400', text: 'text-amber-900' },
  SWEETBOX: { label: 'Đôi', color: '#ec4899', bg: 'bg-pink-500', text: 'text-white' },
  BROKEN: { label: 'Hỏng', color: '#6b7280', bg: 'bg-gray-300', text: 'text-gray-500' },
};

const SeatManagement: React.FC = () => {
  const { roomId } = useParams<{ roomId: string }>();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(false);
  const [rooms, setRooms] = useState<any[]>([]);
  const [roomInfo, setRoomInfo] = useState<any | null>(null);
  const [seats, setSeats] = useState<any[]>([]);
  const [draftSeats, setDraftSeats] = useState<Record<number, any>>({});

  // Fetch rooms list
  const fetchRooms = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get('/rooms');
      setRooms(res.data?.data || res.data || []);
    } catch { message.error('Không tải danh sách phòng'); } 
    finally { setLoading(false); }
  }, []);

  // Fetch seats
  const fetchSeats = useCallback(async () => {
    if (!roomId) return;
    setLoading(true);
    try {
      const res = await api.get(`/rooms/${roomId}/seats`);
      const data = res.data?.data || res.data;
      setRoomInfo(data);
      setSeats(data.seats || []);
      setDraftSeats({});
    } catch { message.error('Lỗi khi tải sơ đồ ghế'); } 
    finally { setLoading(false); }
  }, [roomId]);

  useEffect(() => { fetchRooms(); }, [fetchRooms]);
  useEffect(() => { fetchSeats(); }, [fetchSeats]);

  // Toggle seat type
  const handleToggleType = (seat: any) => {
    const types = ['NORMAL', 'VIP', 'SWEETBOX', 'BROKEN'];
    const currentIdx = types.indexOf(seat.type);
    const nextType = types[(currentIdx + 1) % types.length];
    setDraftSeats(prev => ({
      ...prev,
      [seat.id]: { ...prev[seat.id], type: nextType, price_extra: SEAT_CONFIG[nextType].color === '#10b981' ? 0 : SEAT_CONFIG[nextType].color === '#f59e0b' ? 20000 : 40000 }
    }));
  };

  // Save changes
  const handleSave = async () => {
    const updates = Object.entries(draftSeats).map(([id, data]) => ({ id: Number(id), ...data }));
    setLoading(true);
    try {
      await Promise.all(updates.map(u => api.patch(`/seats/${u.id}`, u)));
      message.success(`Đã lưu ${updates.length} thay đổi`);
      fetchSeats();
    } catch { message.error('Lưu thất bại'); } 
    finally { setLoading(false); }
  };

  // Group seats by row
  const seatGrid = useMemo(() => {
    const rows: Record<string, any[]> = {};
    seats.forEach(s => {
      const displayData = { ...s, ...draftSeats[s.id] };
      if (!rows[s.row]) rows[s.row] = [];
      rows[s.row].push(displayData);
    });
    return Object.keys(rows).sort().map(r => ({
      rowName: r,
      seats: rows[r].sort((a, b) => a.number - b.number)
    }));
  }, [seats, draftSeats]);

  // ====== CHỌN PHÒNG ======
  if (!roomId) {
    return (
      <div className="p-6 min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
        <Card className="shadow-lg">
          <Title level={3} className="text-center mb-2">Chọn phòng chiếu</Title>
          <Text type="secondary" className="text-center block mb-6">Nhấp vào phòng để quản lý ghế</Text>
          
          <Row gutter={[16, 16]}>
            {rooms.map(room => (
              <Col xs={12} sm={8} md={6} lg={4} key={room.id}>
                <Card 
                  hoverable 
                  className="text-center cursor-pointer border-2 hover:border-red-500 transition-all"
                  onClick={() => navigate(`/admin/showtimes/seats/${room.id}`)}
                >
                  <div className="bg-red-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                    <PlayCircleOutlined className="text-2xl text-red-600" />
                  </div>
                  <Title level={5} className="mt-2 text-blue-600">{room.name}</Title>
                  <Tag color="blue">{room.room_type}</Tag>
                  <div className="mt-2 text-gray-500 text-sm">{room.total_rows}×{room.cols_per_row} = {room.total_seats} ghế</div>
                </Card>
              </Col>
            ))}
          </Row>
        </Card>
      </div>
    );
  }

  // ====== QUẢN LÝ GHẾ ======
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 p-6">
      <Space direction="vertical" className="w-full" size="large">
        {/* Toolbar */}
        <Card className="shadow-xl border-0">
          <div className="flex justify-between items-center">
            <Space>
              <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/admin/showtimes/seats')} shape="circle" />
              <div>
                <Title level={3} style={{ margin: 0 }} className="text-red-600">{roomInfo?.name || 'Đang tải...'}</Title>
                <Space>
                  <Tag color="blue">{roomInfo?.room_type}</Tag>
                  <Text type="secondary">{seats.length} ghế</Text>
                </Space>
              </div>
            </Space>
            <Space>
              <Button icon={<ReloadOutlined />} onClick={fetchSeats} loading={loading}>Làm mới</Button>
              <Button type="primary" danger icon={<SaveOutlined />} onClick={handleSave} disabled={Object.keys(draftSeats).length === 0} loading={loading}>
                Lưu {Object.keys(draftSeats).length} thay đổi
              </Button>
            </Space>
          </div>
        </Card>

        {/* Legend */}
        <Card className="shadow-lg border-0">
          <div className="flex flex-wrap justify-center gap-4">
            {Object.entries(SEAT_CONFIG).map(([type, config]: any) => (
              <div key={type} className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded flex items-center justify-center ${config.bg} ${config.text}`}>
                  {type === 'BROKEN' ? <CloseCircleFilled /> : type === 'SWEETBOX' ? '2' : '1'}
                </div>
                <span className="font-medium">{config.label}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Seat Map */}
        <Card className="shadow-2xl border-0">
          {seats.length === 0 ? (
            <div className="text-center py-12">
              <Text>Phòng chưa có ghế. Liên hệ quản trị để tạo.</Text>
            </div>
          ) : (
            <div className="bg-slate-800 p-8 rounded-xl overflow-x-auto">
              {/* Screen */}
              <div className="text-center mb-12">
                <div className="w-3/4 h-3 bg-gradient-to-r from-transparent via-blue-500 to-transparent rounded-full mx-auto shadow-[0_0_20px_rgba(59,130,246,0.6)]" />
                <Text className="text-blue-400 text-sm tracking-[1em] uppercase">Màn hình</Text>
              </div>

              {/* Seat Grid */}
              <div className="flex flex-col items-center">
                {seatGrid.map(row => (
                  <div key={row.rowName} className="flex items-center gap-3 mb-2">
                    {/* Row Label */}
                    <div className="w-6 text-center font-bold text-yellow-500">{row.rowName}</div>
                    
                    {/* Seats */}
                    <div className="flex gap-1.5">
                      {row.seats.map((seat: any) => {
                        const config = SEAT_CONFIG[seat.type];
                        const isChanged = draftSeats[seat.id];
                        
                        return (
                          <Tooltip 
                            key={seat.id} 
                            title={
                              <div className="text-center">
                                <div className="font-bold">{seat.row}{seat.number}</div>
                                <div>{config.label}</div>
                                {seat.price_extra > 0 && <div>+{seat.price_extra.toLocaleString()}đ</div>}
                              </div>
                            }
                          >
                            <div 
                              onClick={() => handleToggleType(seat)}
                              className={`
                                w-9 h-9 flex items-center justify-center rounded-md cursor-pointer transition-all hover:scale-125 hover:z-10
                                ${config.bg} ${config.text} font-bold text-sm
                                ${isChanged ? 'ring-4 ring-white shadow-lg' : ''}
                              `}
                            >
                              {seat.number}
                            </div>
                          </Tooltip>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>

              {/* Bottom spacing */}
              <div className="mt-8 text-center">
                <Text className="text-slate-500 text-sm">💡 Nhấp vào ghế để đổi loại</Text>
              </div>
            </div>
          )}
        </Card>
      </Space>
    </div>
  );
};

export default SeatManagement;