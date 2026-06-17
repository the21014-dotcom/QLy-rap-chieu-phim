/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useMemo, useCallback } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { CreditCard, Plus, Minus, Loader2, ChevronLeft, Ticket, MapPin, Monitor, Coffee } from "lucide-react";
import { formatCurrency } from "../utils/format";
import bookingApi from "../api/bookingApi";
import foodApi from "../api/foodApi";
import { message,  } from "antd";

export default function Booking() {
  const { showtimeId: idFromParams } = useParams<{ showtimeId: string }>();
  const showtimeId = Number(idFromParams);
  const location = useLocation();
  const navigate = useNavigate();

  // 1. Lấy dữ liệu từ state một cách an toàn
  const { selectedSeats = [], showtimeData: initialShowtime } = location.state || {};

  const [showtime, setShowtime] = useState<any>(initialShowtime || null);
  const [foods, setFoods] = useState<any[]>([]);
  const [selectedFoods, setSelectedFoods] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);

  const fetchInitialData = useCallback(async () => {
  if (isNaN(showtimeId)) return;
  try {
    setLoading(true);
    const [showtimeRes, foodRes]: any = await Promise.all([
      bookingApi.getShowtimeDetails(showtimeId),
      foodApi.getAllfoods(),
    ]);

    // SỬA TẠI ĐÂY: Truy cập vào .data.data do Interceptor đã bọc lại
    const showtimeData = showtimeRes?.data?.data || showtimeRes?.data || showtimeRes;
    const foodData = foodRes?.data?.data || foodRes?.data || foodRes;

    setShowtime(showtimeData);
    
    // Đảm bảo foodData là một mảng trước khi filter
    const finalFoods = Array.isArray(foodData) 
      ? foodData.filter((f: any) => f.is_available !== false)
      : [];
    setFoods(finalFoods);

  } catch (error: any) {
    console.error("Lỗi tải dữ liệu:", error);
    message.error("Không thể tải thông tin bắp nước");
  } finally {
    setLoading(false);
  }
}, [showtimeId]);

  useEffect(() => {
    // Nếu quay lại mà không có ghế, bắt chọn lại
    if (selectedSeats.length === 0) {
      navigate(`/seat-selection/${showtimeId}`);
      return;
    }
    fetchInitialData();
  }, [fetchInitialData, selectedSeats.length, navigate, showtimeId]);

  // 2. TÍNH TOÁN TỔNG TIỀN (Fix lỗi property price_base)
  const totals = useMemo(() => {
    const seatTotal = selectedSeats.reduce((sum: number, s: any) => 
        sum + Number(s.price_base || s.price || showtime?.price_base || 0), 0);
    const foodTotal = selectedFoods.reduce((sum, f) => 
        sum + Number(f.price) * f.quantity, 0);
    return { seatTotal, foodTotal, finalTotal: seatTotal + foodTotal };
  }, [selectedSeats, selectedFoods, showtime]);

  const updateFood = (food: any, delta: number) => {
    setSelectedFoods((prev) => {
      const existing = prev.find((f) => f.food_id === food.id);
      if (existing) {
        const newQty = existing.quantity + delta;
        if (newQty <= 0) return prev.filter((f) => f.food_id !== food.id);
        return prev.map((f) => (f.food_id === food.id ? { ...f, quantity: newQty } : f));
      }
      return delta > 0 ? [...prev, { food_id: food.id, name: food.name, price: food.price, quantity: 1 }] : prev;
    });
  };

  const handleCheckout = async () => {
    if (isProcessing) return;
    setIsProcessing(true);
    try {
      const payload = {
        showtime_id: showtimeId,
        showtime_seat_ids: selectedSeats.map((s: any) => s.id), 
        foods: selectedFoods.map(f => ({ food_id: f.food_id, quantity: f.quantity }))
      };

      const res: any = await bookingApi.create(payload);

      const bId = res?.data?.bookingId || res?.data?.data?.id;
      
      if (bId) {
      message.success("Đang thiết lập thanh toán...");
      navigate("/checkout", {
        state: {
          showtime: showtime,
          selectedSeats,
          selectedFoods,
          totals,
          bookingId: bId // Chỉ cần truyền ID để sang trang sau tạo link thanh toán theo phương thức chọn
        }
      });
    } else {
      throw new Error("Không khởi tạo được đơn hàng");
    }
  } catch (error: any) {
    console.error("Chi tiết lỗi đặt vé:", error);
    message.error(error.response?.data?.message || error.message || "Đặt vé thất bại");
  } finally { 
    setIsProcessing(false); 
  }
};

  if (loading) return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#0b0b0b] gap-4">
      <Loader2 className="animate-spin text-red-600" size={48} />
      <p className="text-zinc-500 animate-pulse uppercase tracking-[0.3em] text-[10px]">Đang chuẩn bị menu bắp nước...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#080808] text-white pb-20 font-sans">
      <header className="sticky top-0 z-50 bg-[#080808]/80 backdrop-blur-xl border-b border-white/5 px-6 py-5">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <button onClick={() => navigate(-1)}
           aria-label="Quay lại"
           title="Quay lại"
           className="p-2 bg-zinc-900 rounded-xl hover:bg-red-600 transition-all">
            <ChevronLeft size={20} />
          </button>
          <div className="text-center">
            <h1 className="text-sm font-black uppercase tracking-[0.2em] text-red-600">Combo & Drinks</h1>
            <p className="text-[9px] text-zinc-500 uppercase mt-1">Năng lượng cho siêu phẩm điện ảnh</p>
          </div>
          <div className="w-10" />
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* DANH SÁCH MÓN ĂN */}
        <div className="lg:col-span-7 space-y-6">
          <div className="flex items-center gap-3 mb-4">
            <Coffee className="text-red-600" size={20} />
            <h2 className="text-lg font-black uppercase italic">Thực đơn rạp chiếu</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
            {foods.map((food) => {
              const qty = selectedFoods.find(f => f.food_id === food.id)?.quantity || 0;
              return (
                <div key={food.id} className="bg-zinc-900/30 p-5 rounded-4xl flex items-center gap-6 border border-white/5 hover:border-red-600/30 transition-all group">
                  <div className="w-28 h-28 shrink-0 relative">
                    <img src={food.image_url} className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500" alt={food.name} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-black text-sm uppercase tracking-tight">{food.name}</h3>
                    <p className="text-zinc-500 text-[11px] mt-1 leading-snug line-clamp-2">{food.description}</p>
                    <p className="text-red-500 font-black mt-3 text-lg">{formatCurrency(food.price)}</p>
                  </div>
                  <div className="flex items-center gap-3 bg-black/40 p-2 rounded-2xl border border-white/5">
                    {qty > 0 && (
                      <button onClick={() => updateFood(food, -1)}
                       aria-label={`Giảm số lượng ${food.name}`}
                               title="Giảm"
                       className="w-8 h-8 flex items-center justify-center bg-zinc-800 hover:bg-zinc-700 rounded-lg transition-colors"><Minus size={14}/></button>
                    )}
                    <span className="w-4 text-center font-black text-sm">{qty}</span>
                    <button onClick={() => updateFood(food, 1)}
                     aria-label={`Tăng số lượng ${food.name}`}
                     title="Tăng"
                     className="w-8 h-8 flex items-center justify-center bg-red-600 hover:bg-red-500 rounded-lg transition-colors"><Plus size={14}/></button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* SIDEBAR TỔNG KẾT - STYLE HIỆN ĐẠI */}
        <aside className="lg:col-span-5">
          <div className="sticky top-28 bg-zinc-900/50 rounded-[2.5rem] overflow-hidden border border-white/10">
            <div className="p-8 space-y-6">
              <div className="flex gap-5">
                <img src={showtime?.movie?.poster_url} className="w-20 h-28 object-cover rounded-xl shadow-2xl shadow-black" alt="" />
                <div className="flex-1 py-1">
                   <h2 className="font-black text-base uppercase leading-tight italic">{showtime?.movie?.title}</h2>
                   <div className="mt-3 space-y-1.5">
                      <p className="text-zinc-500 text-[10px] uppercase font-bold flex items-center gap-2"><MapPin size={12} className="text-red-600"/> {showtime?.room?.cinema?.name}</p>
                      <p className="text-zinc-500 text-[10px] uppercase font-bold flex items-center gap-2"><Monitor size={12} className="text-red-600"/> {showtime?.room?.name} • {showtime?.room?.room_type}</p>
                   </div>
                </div>
              </div>

              <div className="space-y-4 pt-6 border-t border-white/5">
                {/* FIX LỖI HIỂN THỊ GHẾ TẠI ĐÂY */}
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2 text-zinc-500 text-[10px] uppercase font-black tracking-widest"><Ticket size={14}/> Ghế đã chọn</div>
                  <div className="flex flex-wrap justify-end gap-1 max-w-37.5">
                    {selectedSeats.map((s: any) => (
                      <span key={s.id} className="text-white font-black text-xs bg-red-600/20 px-2 py-0.5 rounded border border-red-600/30">
                        {s.rowLabel}{s.seatNumber}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex justify-between text-[11px] uppercase font-bold text-zinc-500">
                  <span>Tiền vé</span>
                  <span className="text-white">{formatCurrency(totals.seatTotal)}</span>
                </div>

                {selectedFoods.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-zinc-500 text-[10px] uppercase font-black tracking-widest">Bắp nước</p>
                    {selectedFoods.map(f => (
                      <div key={f.food_id} className="flex justify-between text-[11px] text-zinc-400">
                        <span>{f.name} (x{f.quantity})</span>
                        <span>{formatCurrency(f.price * f.quantity)}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="pt-6 mt-6 border-t border-dashed border-zinc-700">
                <div className="flex justify-between items-end">
                  <span className="text-[10px] font-black uppercase text-zinc-500 mb-1">Tổng cộng</span>
                  <span className="text-3xl font-black italic text-red-600 tracking-tighter leading-none">
                    {formatCurrency(totals.finalTotal)}
                  </span>
                </div>
              </div>

              <button 
                onClick={handleCheckout}
                disabled={isProcessing}
                className="w-full h-16 bg-red-600 hover:bg-red-700 disabled:bg-zinc-800 rounded-2xl font-black uppercase text-xs tracking-[0.2em] shadow-xl shadow-red-900/20 transition-all active:scale-95 flex items-center justify-center gap-3"
              >
                {isProcessing ? <Loader2 className="animate-spin" /> : <>Thanh toán ngay <CreditCard size={18}/></>}
              </button>
            </div>
          </div>
        </aside>
      </main>
    </div>
  );
}