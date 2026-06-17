/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { 

  History, 
  MapPin, 
  Calendar, 
  ChevronRight, 
  Loader2, 

  LogOut,
  User as UserIcon,
  Clock,

  Film,
  MonitorPlay
} from "lucide-react";
import { formatCurrency } from "../utils/format";
import bookingApi from "../api/bookingApi";
import { message, Tabs } from "antd";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../store/AuthContext";

export default function Profile() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    const fetchHistory = async () => {
      try {
        setLoading(true);
        const res: any = await bookingApi.getUserHistory();
        const data = res?.data || res || [];
        setBookings(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Lỗi lấy lịch sử:", error);
        message.error("Không thể tải lịch sử giao dịch");
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [user, navigate]);

  const handleLogout = () => {
    logout();
    message.success("Đã đăng xuất");
    navigate("/login");
  };

  // Lọc vé sắp chiếu (thời gian chiếu > hiện tại)
  const upcomingMovies = bookings.filter((b: any) => 
    b.status === 'SUCCESS' && 
    dayjs(b.showtime?.start_time).isAfter(dayjs())
  );

  // Lọc vé đã xem (thời gian chiếu < hiện tại)
  const pastMovies = bookings.filter((b: any) => 
    b.status === 'SUCCESS' && 
    dayjs(b.showtime?.start_time).isBefore(dayjs())
  );

  // Tính tổng chi tiêu
  const totalSpent = bookings.reduce((sum, b) => 
    sum + (b.status === 'SUCCESS' ? Number(b.total_amount) : 0), 0
  );

  const TicketCard = ({ booking, isPast = false }: { booking: any; isPast?: boolean }) => {
    const movie = booking.showtime?.movie;
    const cinema = booking.showtime?.room?.cinema;
    const room = booking.showtime?.room;
    const showtimeDate = dayjs(booking.showtime?.start_time);
    
    const seatNames = booking.tickets
      ?.map((t: any) => {
        const row = t.seat?.row || "";
        const col = t.seat?.column || t.seat?.number || ""; 
        return `${row}${col}`;
      })
      .filter((s: string) => s !== "")
      .join(", ") || "Chưa xác định";

    const statusConfig: any = {
      SUCCESS: { label: isPast ? "Đã xem" : "Đã đặt", color: "text-emerald-600", bg: "bg-emerald-50", icon: "✓" },
      PENDING: { label: "Chờ thanh toán", color: "text-amber-600", bg: "bg-amber-50", icon: "⏳" },
      FAILED: { label: "Thất bại", color: "text-rose-600", bg: "bg-rose-50", icon: "✗" },
    };

    const status = statusConfig[booking.status] || { label: booking.status, color: "text-zinc-600", bg: "bg-zinc-50", icon: "?" };

    return (
      <div className="group bg-white border border-zinc-200 rounded-3xl overflow-hidden hover:border-red-500/50 hover:shadow-2xl transition-all duration-300 mb-6">
        <div className="flex flex-col lg:flex-row">
          {/* Poster phim */}
          <div className="relative w-full lg:w-48 h-64 lg:h-auto shrink-0">
            <img
              src={movie?.poster_url || "/placeholder-poster.jpg"}
              alt={movie?.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
            
            {/* Rating badge */}
            {movie?.rating && (
              <div className={`absolute top-3 left-3 px-2 py-1 rounded-md font-black text-xs ${
                movie.rating === 'C18' ? 'bg-red-600 text-white' :
                movie.rating === 'C16' ? 'bg-orange-500 text-white' :
                movie.rating === 'C13' ? 'bg-yellow-500 text-black' :
                'bg-green-500 text-white'
              }`}>
                {movie.rating}
              </div>
            )}
            
            {/* Status badge */}
            <div className={`absolute top-3 right-3 px-3 py-1.5 rounded-full font-bold text-xs ${status.bg} ${status.color}`}>
              {status.icon} {status.label}
            </div>
          </div>

          {/* Thông tin chi tiết */}
          <div className="flex-1 p-6 lg:p-8 flex flex-col justify-between">
            <div>
              {/* Tiêu đề phim */}
              <h3 className="text-2xl font-black uppercase italic tracking-tight text-zinc-800 group-hover:text-red-600 transition-colors">
                {movie?.title || "Thông tin phim"}
              </h3>

              {/* Ngày giờ chiếu */}
              <div className="flex items-center gap-4 mt-4">
                <div className="flex items-center gap-2 text-zinc-600 font-medium">
                  <Calendar size={18} className="text-red-500" />
                  <span>{showtimeDate.format("DD/MM/YYYY")}</span>
                </div>
                <div className="flex items-center gap-2 text-zinc-600 font-medium">
                  <Clock size={18} className="text-red-500" />
                  <span>{showtimeDate.format("HH:mm")}</span>
                </div>
              </div>

              {/* Rạp & Phòng */}
              <div className="mt-4 flex items-center gap-2 text-zinc-600">
                <MapPin size={18} className="text-red-500" />
                <span className="font-medium">{cinema?.name}</span>
                <span className="text-zinc-400">•</span>
                <span>{room?.name}</span>
              </div>

              {/* Ghế */}
              <div className="mt-4 flex items-center gap-2">
                <div className="px-3 py-1.5 bg-zinc-100 rounded-lg">
                  <span className="text-xs font-bold text-zinc-500 uppercase">Ghế</span>
                </div>
                <span className="font-black text-zinc-800 text-lg">{seatNames}</span>
              </div>
            </div>

            {/* Footer: Giá tiền & CTA */}
            <div className="flex items-end justify-between mt-6 pt-6 border-t border-zinc-100">
              <div>
                <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Tổng thanh toán</p>
                <p className="text-3xl font-black text-red-600">{formatCurrency(booking.total_amount)}</p>
              </div>
              
              <button 
                onClick={() => navigate(`/ticket/${booking.id}`)}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-red-600 to-rose-600 rounded-xl text-white font-bold hover:shadow-lg hover:shadow-red-500/30 transition-all"
              >
                {isPast ? "Xem lại" : "Nhận vé"}
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-100 to-zinc-200 pb-16">
      
      {/* Header Profile */}
      <div className="bg-gradient-to-r from-red-700 to-red-900 pt-32 pb-16 px-6">
        <div className="max-w-5xl mx-auto flex flex-col lg:flex-row items-center gap-8">
          {/* Avatar */}
          <div className="relative">
            <div className="w-28 h-28 bg-white rounded-full flex items-center justify-center text-4xl font-black text-red-600 shadow-2xl">
               {user.full_name?.charAt(0).toUpperCase() || <UserIcon size={40} />}
            </div>
            <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center text-xl shadow-lg">
              ⭐
            </div>
          </div>
          
          {/* User Info */}
          <div className="flex-1 text-center lg:text-left">
            <h1 className="text-3xl font-black uppercase tracking-tighter text-white">
              {user.full_name || "Thành viên CGV"}
            </h1>
            <p className="text-white/70 mt-1">{user.email}</p>
            
            {/* Stats */}
            <div className="flex flex-wrap justify-center lg:justify-start gap-4 mt-6">
              <div className="bg-white/20 backdrop-blur-sm px-6 py-3 rounded-2xl">
                <p className="text-xs text-white/70 uppercase font-bold">Tổng chi tiêu</p>
                <p className="text-xl font-black text-white">{formatCurrency(totalSpent)}</p>
              </div>
              <div className="bg-white/20 backdrop-blur-sm px-6 py-3 rounded-2xl">
                <p className="text-xs text-white/70 uppercase font-bold">Vé đã đặt</p>
                <p className="text-xl font-black text-white">{bookings.length}</p>
              </div>
              <div className="bg-white/20 backdrop-blur-sm px-6 py-3 rounded-2xl">
                <p className="text-xs text-white/70 uppercase font-bold">Phim đã xem</p>
                <p className="text-xl font-black text-white">{pastMovies.length}</p>
              </div>
            </div>
          </div>

          {/* Logout Button */}
          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 px-6 py-3 bg-white/20 hover:bg-white text-white rounded-xl transition-all font-bold"
          >
            <LogOut size={18} /> Đăng xuất
          </button>
        </div>
      </div>

      {/* Tabs Container */}
      <main className="max-w-5xl mx-auto px-6 -mt-8">
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          <Tabs
            defaultActiveKey="upcoming"
            className="profile-tabs"
            items={[
              {
                key: "upcoming",
                label: (
                  <span className="flex items-center gap-2 px-4 py-3 uppercase font-black italic tracking-widest text-sm">
                    <MonitorPlay size={20} /> Phim sắp chiếu
                  </span>
                ),
                children: (
                  <div className="p-6 lg:p-8">
                    {loading ? (
                      <div className="flex justify-center py-20">
                        <Loader2 className="animate-spin text-red-600" size={48} />
                      </div>
                    ) : upcomingMovies.length > 0 ? (
                      upcomingMovies.map(b => <TicketCard key={b.id} booking={b} />)
                    ) : (
                      <div className="text-center py-16 bg-zinc-50 rounded-2xl border-2 border-dashed border-zinc-300">
                        <Film size={56} className="mx-auto text-zinc-300 mb-4" />
                        <p className="text-zinc-500 uppercase text-sm font-bold">Bạn chưa có phim sắp chiếu</p>
                        <button 
                          onClick={() => navigate('/')}
                          className="mt-4 px-6 py-2 bg-red-600 text-white rounded-lg font-bold hover:bg-red-700"
                        >
                          Đặt vé ngay
                        </button>
                      </div>
                    )}
                  </div>
                ),
              },
              {
                key: "past",
                label: (
                  <span className="flex items-center gap-2 px-4 py-3 uppercase font-black italic tracking-widest text-sm">
                    <History size={20} /> Phim đã xem
                  </span>
                ),
                children: (
                  <div className="p-6 lg:p-8">
                    {loading ? (
                      <div className="flex justify-center py-20">
                        <Loader2 className="animate-spin text-red-600" size={48} />
                      </div>
                    ) : pastMovies.length > 0 ? (
                      pastMovies.map(b => <TicketCard key={b.id} booking={b} isPast={true} />)
                    ) : (
                      <div className="text-center py-16 bg-zinc-50 rounded-2xl border-2 border-dashed border-zinc-300">
                        <History size={56} className="mx-auto text-zinc-300 mb-4" />
                        <p className="text-zinc-500 uppercase text-sm font-bold">Bạn chưa xem phim nào</p>
                        <button 
                          onClick={() => navigate('/')}
                          className="mt-4 px-6 py-2 bg-red-600 text-white rounded-lg font-bold hover:bg-red-700"
                        >
                          Đặt vé ngay
                        </button>
                      </div>
                    )}
                  </div>
                ),
              },
            ]}
          />
        </div>
      </main>

      {/* Custom CSS */}
      <style>{`
        .profile-tabs .ant-tabs-nav { margin-bottom: 0; padding: 0 24px; }
        .profile-tabs .ant-tabs-tab { color: #71717a !important; transition: all 0.3s; padding: 8px 0; }
        .profile-tabs .ant-tabs-tab-active { color: #dc2626 !important; }
        .profile-tabs .ant-tabs-ink-bar { background: #dc2626 !important; height: 3px !important; }
        .profile-tabs .ant-tabs-content-holder { border-top: 1px solid #f4f4f5; }
      `}</style>
    </div>
  );
}