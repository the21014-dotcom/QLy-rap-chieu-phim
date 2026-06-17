import  { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { QRCodeCanvas } from 'qrcode.react';
import { Calendar, MapPin, Armchair, Coffee, CheckCircle2, Download } from 'lucide-react';
import moment from 'moment';
/* eslint-disable @typescript-eslint/no-explicit-any */
const BookingSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const bookingId = searchParams.get('bookingId');
  const [booking, setBooking] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookingDetail = async () => {
      try {
        // Gọi tới API "xịn" chúng ta vừa viết ở Backend
        const response = await axios.get(`http://localhost:8080/api/v1/payments/booking-detail/${bookingId}`);
        setBooking(response.data);
      } catch (error) {
        console.error("Lỗi khi lấy thông tin vé:", error);
      } finally {
        setLoading(false);
      }
    };

    if (bookingId) fetchBookingDetail();
  }, [bookingId]);

  if (loading) return <div className="flex justify-center items-center h-screen">Đang xác thực giao dịch...</div>;
  if (!booking) return <div className="text-center mt-10">Không tìm thấy thông tin đơn hàng.</div>;

  return (
    <div className="min-h-screen bg-gray-900 py-10 px-4 text-white">
      {/* Thông báo thành công */}
      <div className="flex flex-col items-center mb-8 animate-bounce">
        <CheckCircle2 size={60} className="text-green-500 mb-2" />
        <h1 className="text-2xl font-bold">Thanh toán thành công!</h1>
        <p className="text-gray-400 text-sm">Cảm ơn bạn đã lựa chọn dịch vụ của chúng tôi.</p>
      </div>

      {/* Chiếc vé xịn */}
      <div className="max-w-md mx-auto bg-white text-gray-900 rounded-3xl overflow-hidden shadow-2xl relative">
        {/* Phần đầu: Poster & Tên phim */}
        <div className="relative h-48 bg-black">
          <img 
            src={booking.showtime.movie.poster_url} 
            className="w-full h-full object-cover opacity-60" 
            alt="poster"
          />
          <div className="absolute bottom-4 left-6 text-white">
            <span className="bg-red-600 px-2 py-1 rounded text-xs font-bold mb-2 inline-block">
              {booking.showtime.movie.rating}
            </span>
            <h2 className="text-xl font-bold uppercase truncate">{booking.showtime.movie.title}</h2>
          </div>
        </div>

        {/* Nội dung vé */}
        <div className="p-6 space-y-4 relative">
          {/* Thông tin rạp & thời gian */}
          <div className="flex justify-between border-b pb-4">
            <div className="space-y-1">
              <div className="flex items-center text-gray-500 text-sm">
                <MapPin size={14} className="mr-1" /> Rạp
              </div>
              <p className="font-bold text-sm">{booking.showtime.room.cinema.name}</p>
              <p className="text-xs text-gray-400">{booking.showtime.room.name}</p>
            </div>
            <div className="text-right space-y-1">
              <div className="flex items-center justify-end text-gray-500 text-sm">
                <Calendar size={14} className="mr-1" /> Thời gian
              </div>
              <p className="font-bold text-sm">{moment(booking.showtime.start_time).format('HH:mm')}</p>
              <p className="text-xs text-gray-400">{moment(booking.showtime.start_time).format('DD/MM/YYYY')}</p>
            </div>
          </div>

          {/* Thông tin ghế & bắp nước */}
          <div className="grid grid-cols-2 gap-4 border-b pb-4">
            <div className="space-y-1">
              <div className="flex items-center text-gray-500 text-sm">
                <Armchair size={14} className="mr-1" /> Ghế đã chọn
              </div>
              <p className="font-bold text-blue-600">
                {booking.tickets.map((t: any) => `${t.seat.row}${t.seat.number}`).join(', ')}
              </p>
            </div>
            <div className="space-y-1">
              <div className="flex items-center text-gray-500 text-sm">
                <Coffee size={14} className="mr-1" /> Combo bắp nước
              </div>
              <p className="text-xs font-medium">
                {booking.booking_foods.length > 0 
                  ? booking.booking_foods.map((f: any) => `${f.quantity}x ${f.food.name}`).join(', ')
                  : "Không có"}
              </p>
            </div>
          </div>

          {/* QR Code */}
          <div className="flex flex-col items-center py-4 bg-gray-50 rounded-2xl">
            <QRCodeCanvas 
              value={`BOOKING_ID:${booking.id}`} 
              size={140}
              level={"H"}
              includeMargin={true}
            />
            <p className="mt-2 text-[10px] text-gray-400 uppercase tracking-widest font-bold">Mã vé: #{booking.id}</p>
          </div>
          
          {/* Đường đứt đoạn trang trí cho giống vé thật */}
          <div className="absolute -left-3 top-[65%] w-6 h-6 bg-gray-900 rounded-full"></div>
          <div className="absolute -right-3 top-[65%] w-6 h-6 bg-gray-900 rounded-full"></div>
        </div>

        {/* Chân vé */}
        <div className="bg-gray-100 p-4 text-center border-t border-dashed">
          <p className="text-[10px] text-gray-500">Vui lòng đưa mã này cho nhân viên để quét và in vé</p>
        </div>
      </div>

      {/* Nút hành động */}
      <div className="max-w-md mx-auto mt-8 flex gap-4">
        <button 
          onClick={() => navigate('/')}
          className="flex-1 bg-gray-800 hover:bg-gray-700 text-white py-3 rounded-xl font-bold transition"
        >
          Trang chủ
        </button>
        <button 
          onClick={() => window.print()}
          className="flex-1 bg-red-600 hover:bg-red-700 text-white py-3 rounded-xl font-bold flex items-center justify-center transition"
        >
          <Download size={18} className="mr-2" /> Lưu vé
        </button>
      </div>
    </div>
  );
};

export default BookingSuccess;