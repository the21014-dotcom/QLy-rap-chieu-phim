import  { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { XCircle, RefreshCcw, Home, AlertCircle, PhoneCall } from 'lucide-react';
/* eslint-disable @typescript-eslint/no-explicit-any */

const BookingFailed = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const bookingId = searchParams.get('bookingId');
  const [loading, setLoading] = useState(false);
  const [booking, setBooking] = useState<any>(null);

  useEffect(() => {
    // Lấy thông tin sơ bộ của đơn hàng lỗi để hiển thị lại số tiền/thông tin phim
    const fetchMinimalInfo = async () => {
      try {
        const res = await axios.get(`http://localhost:8080/api/v1/payments/booking-detail/${bookingId}`);
        setBooking(res.data);
      } catch {
     console.error("Không thể lấy thông tin đơn hàng");
}
    };
    if (bookingId) fetchMinimalInfo();
  }, [bookingId]);

  const handleRetryPayment = async () => {
    if (!booking) return;
    setLoading(true);
    try {
      // Gọi lại API tạo URL VNPay cho chính đơn hàng này
      const response = await axios.post(`http://localhost:8080/api/v1/payments/create-vnpay`, {
        bookingId: booking.id,
        amount: Number(booking.total_amount),
        language: 'vn'
      });

      if (response.data.url) {
        // Redirect sang VNPay lần nữa
        window.location.href = response.data.url;
      }
    } catch {

      alert("Không thể khởi tạo lại thanh toán. Vui lòng thử lại sau!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8 text-center border border-red-100">
        
        {/* Icon cảnh báo lỗi */}
        <div className="flex justify-center mb-6">
          <div className="bg-red-100 p-4 rounded-full animate-pulse">
            <XCircle size={60} className="text-red-500" />
          </div>
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-2">Thanh toán thất bại</h1>
        <p className="text-gray-500 mb-6 px-4">
          Giao dịch cho đơn hàng <span className="font-bold text-gray-700">#{bookingId}</span> đã bị từ chối hoặc bị hủy bởi người dùng.
        </p>

        {/* Box thông tin tóm tắt đơn hàng (Nếu có) */}
        {booking && (
          <div className="bg-gray-50 rounded-2xl p-4 mb-6 text-left border border-gray-100">
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-500 text-sm">Phim:</span>
              <span className="font-semibold text-sm  truncate max-w-50">{booking.showtime.movie.title}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-500 text-sm">Tổng cộng:</span>
              <span className="font-bold text-red-600">{Number(booking.total_amount).toLocaleString()}đ</span>
            </div>
          </div>
        )}

        {/* Thông báo nhắc nhở */}
        <div className="flex items-start bg-amber-50 p-4 rounded-xl mb-8 text-left">
          <AlertCircle size={20} className="text-amber-600 mr-2 shrink-0 mt-0.5" />
          <p className="text-xs text-amber-700 leading-relaxed">
            Lưu ý: Ghế của bạn sẽ được giữ trong vòng 10 phút kể từ lúc đặt. Hãy hoàn tất thanh toán sớm để không bị mất ghế.
          </p>
        </div>

        {/* Các nút hành động */}
        <div className="space-y-3">
          <button
            onClick={handleRetryPayment}
            disabled={loading}
            className="w-full bg-red-600 hover:bg-red-700 text-white py-4 rounded-2xl font-bold flex items-center justify-center transition-all shadow-lg shadow-red-200 active:scale-95"
          >
            {loading ? (
              <RefreshCcw className="animate-spin mr-2" size={20} />
            ) : (
              <RefreshCcw className="mr-2" size={20} />
            )}
            {loading ? "Đang xử lý..." : "Thử thanh toán lại"}
          </button>

          <button
            onClick={() => navigate('/')}
            className="w-full bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 py-4 rounded-2xl font-bold flex items-center justify-center transition-all"
          >
            <Home className="mr-2" size={20} /> Quay về trang chủ
          </button>
        </div>

        {/* Hỗ trợ */}
        <div className="mt-8 pt-6 border-t border-gray-100">
          <p className="text-xs text-gray-400 mb-2">Nếu bạn gặp vấn đề về trừ tiền nhưng chưa có vé?</p>
          <button className="flex items-center justify-center mx-auto text-blue-600 font-bold text-sm">
            <PhoneCall size={16} className="mr-1" /> Liên hệ hỗ trợ: 1900 xxxx
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingFailed;