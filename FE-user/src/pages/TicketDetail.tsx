
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import {
  ChevronLeft,
  Calendar,
  Clock,
  Monitor,
  CheckCircle2,
  Ticket as TicketIcon,
  Download,
  Share2,
  MapPin,
  Coffee,
  Info,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

import { QRCodeSVG } from "qrcode.react";
import { formatCurrency } from "../utils/format";
import { message, Result, Button } from "antd";
import api from "../api/axiosClient";
import moment from "moment";

export default function TicketDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [booking, setBooking] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (location.state?.fromCheckout) {
      message.success({
        content: "Đặt vé thành công! Chúc bạn xem phim vui vẻ.",
        icon: <CheckCircle2 className="text-green-500" />,
        duration: 5,
      });

      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  useEffect(() => {
    const fetchTicket = async () => {
      try {
        const response: any = await api.get(
          `/payments/booking-detail/${id}`
        );

        const actualData = response?.data || response;

        if (actualData) {
          setBooking(actualData);
        }
      } catch (error: any) {
        console.error("Lỗi fetch vé:", error);
        message.error("Không thể tải thông tin vé");
      } finally {
        setLoading(false);
      }
    };

    fetchTicket();
  }, [id]);

  if (loading)
    return (
      <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center">
        <div className="relative">
          <div className="absolute inset-0 bg-red-600 blur-3xl opacity-30 rounded-full" />

          <div className="relative w-20 h-20 rounded-full border-4 border-red-600/20 border-t-red-600 animate-spin" />
        </div>

        <p className="mt-8 text-zinc-400 text-lg font-semibold animate-pulse">
          Đang tải thông tin vé...
        </p>
      </div>
    );

  if (!booking)
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <Result
          status="404"
          title={<span className="text-white">Không tìm thấy vé</span>}
          extra={
            <Button
              type="primary"
              danger
              onClick={() => navigate("/")}
            >
              Quay lại trang chủ
            </Button>
          }
        />
      </div>
    );

  return (
    <div className="min-h-screen bg-[#050505] text-white overflow-hidden">

      {/* BACKGROUND EFFECT */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-200px] left-[-100px] w-[500px] h-[500px] bg-red-700/20 blur-[140px] rounded-full" />
        <div className="absolute bottom-[-250px] right-[-100px] w-[500px] h-[500px] bg-red-500/10 blur-[160px] rounded-full" />
      </div>

      {/* HEADER */}
      <header className="sticky top-0 z-50 backdrop-blur-2xl bg-black/40 border-b border-white/10">
        <div className="max-w-6xl mx-auto px-6 py-5 flex items-center justify-between">

          <button
            onClick={() => navigate("/")}
            title="Quay lại"
            className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-all"
          >
            <ChevronLeft size={28} />
          </button>

          <div className="text-center">
            <h1 className="text-2xl md:text-3xl font-black uppercase italic tracking-tight">
              Vé xem phim điện tử
            </h1>

            <p className="text-sm text-zinc-500 mt-1">
              CGV CINEMAS PREMIUM EXPERIENCE
            </p>
          </div>

          <div className="w-14 h-14 rounded-2xl bg-red-600/10 border border-red-600/20 flex items-center justify-center">
            <Sparkles className="text-red-500" size={24} />
          </div>
        </div>
      </header>

      {/* MAIN */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 py-10">

        <div className="grid lg:grid-cols-[1.3fr_0.7fr] gap-8">

          {/* LEFT */}
          <div>

            {/* TICKET */}
            <div className="relative overflow-hidden rounded-[40px] border border-white/10 bg-gradient-to-b from-zinc-900 to-black shadow-[0_0_60px_rgba(0,0,0,0.6)]">

              {/* TOP POSTER */}
              <div className="relative h-[300px] overflow-hidden">

                <img
                  src={booking.showtime?.movie?.poster_url}
                  alt={booking.showtime?.movie?.title}
                  className="w-full h-full object-cover scale-110 blur-[2px] opacity-40"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-black/10" />

                <div className="absolute bottom-0 left-0 right-0 p-8">

                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-600 text-sm font-black uppercase tracking-widest shadow-xl">
                    <TicketIcon size={16} />
                    Vé đã thanh toán
                  </div>

                  <h2 className="mt-5 text-4xl md:text-5xl font-black uppercase italic leading-tight drop-shadow-2xl">
                    {booking.showtime?.movie?.title}
                  </h2>

                  <div className="mt-4 flex items-center gap-2 text-red-400 font-bold text-base">
                    <MapPin size={18} />
                    {booking.showtime?.room?.cinema?.name}
                  </div>
                </div>
              </div>

              {/* INFO */}
              <div className="p-8 md:p-10">

                <div className="grid md:grid-cols-2 gap-y-10 gap-x-8">

                  <div>
                    <p className="text-zinc-500 text-sm uppercase font-black tracking-[0.2em] flex items-center gap-2">
                      <Calendar size={16} />
                      Ngày chiếu
                    </p>

                    <h3 className="mt-3 text-3xl font-black italic">
                      {moment(booking.showtime?.start_time).format(
                        "DD/MM/YYYY"
                      )}
                    </h3>
                  </div>

                  <div className="md:text-right">
                    <p className="text-zinc-500 text-sm uppercase font-black tracking-[0.2em] flex items-center md:justify-end gap-2">
                      <Clock size={16} />
                      Giờ chiếu
                    </p>

                    <h3 className="mt-3 text-4xl font-black italic text-red-500">
                      {moment(booking.showtime?.start_time).format(
                        "HH:mm"
                      )}
                    </h3>
                  </div>

                  <div>
                    <p className="text-zinc-500 text-sm uppercase font-black tracking-[0.2em] flex items-center gap-2">
                      <Monitor size={16} />
                      Phòng chiếu
                    </p>

                    <h3 className="mt-3 text-3xl font-black italic">
                      {booking.showtime?.room?.name}
                    </h3>
                  </div>

                  <div className="md:text-right">
                    <p className="text-zinc-500 text-sm uppercase font-black tracking-[0.2em] flex items-center md:justify-end gap-2">
                      <TicketIcon size={16} />
                      Ghế ngồi
                    </p>

                    <h3 className="mt-3 text-4xl font-black italic text-white">
                      {booking.tickets
                        ?.map(
                          (t: any) =>
                            `${t.seat?.row}${t.seat?.number}`
                        )
                        .join(", ")}
                    </h3>
                  </div>
                </div>

                {/* DASH */}
                <div className="relative my-10">

                  <div className="absolute left-[-52px] top-[-18px] w-10 h-10 bg-[#050505] rounded-full border border-white/10" />

                  <div className="absolute right-[-52px] top-[-18px] w-10 h-10 bg-[#050505] rounded-full border border-white/10" />

                  <div className="border-t-2 border-dashed border-zinc-700" />
                </div>

                {/* COMBO */}
                {booking.booking_foods &&
                  booking.booking_foods.length > 0 && (
                    <div className="rounded-3xl bg-white/[0.03] border border-white/10 p-6">

                      <div className="flex items-center gap-3 mb-5">
                        <Coffee
                          size={22}
                          className="text-red-500"
                        />

                        <h3 className="text-xl font-black uppercase">
                          Combo bắp nước
                        </h3>
                      </div>

                      <div className="space-y-4">
                        {booking.booking_foods.map(
                          (bf: any, idx: number) => (
                            <div
                              key={idx}
                              className="flex items-center justify-between text-lg"
                            >
                              <span className="text-zinc-300 font-semibold">
                                {bf.food?.name} x{bf.quantity}
                              </span>

                              <span className="font-black">
                                {formatCurrency(
                                  bf.price * bf.quantity
                                )}
                              </span>
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  )}

                {/* TOTAL */}
                <div className="mt-8 rounded-[30px] bg-gradient-to-r from-red-700 to-red-600 p-8 shadow-2xl">

                  <p className="text-sm uppercase tracking-[0.3em] font-black text-red-100">
                    Tổng thanh toán
                  </p>

                  <div className="mt-3 flex items-end justify-between">

                    <h2 className="text-5xl font-black italic">
                      {formatCurrency(booking.total_amount)}
                    </h2>

                    <ShieldCheck
                      size={42}
                      className="text-white/90"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT */}
          <div className="space-y-6">

            {/* QR */}
            <div className="rounded-[35px] border border-white/10 bg-gradient-to-b from-zinc-900 to-black p-8 shadow-2xl sticky top-28">

              <div className="text-center">

                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 font-bold text-sm uppercase">
                  <CheckCircle2 size={16} />
                  Thanh toán thành công
                </div>

                <h3 className="mt-6 text-3xl font-black uppercase">
                  Mã QR Check-in
                </h3>

                <p className="text-zinc-500 mt-2 text-base">
                  Đưa mã này cho nhân viên CGV để quét vé
                </p>

                {/* QR BOX */}
                <div className="mt-8 bg-white p-6 rounded-[30px] shadow-[0_0_50px_rgba(255,255,255,0.08)] inline-block">
                  <QRCodeSVG
                    value={`TICKET_ID_${booking.id}`}
                    size={260}
                    level="H"
                    className="rounded-xl"
                  />
                </div>

                {/* CODE */}
                <div className="mt-8 rounded-2xl border border-dashed border-red-500/30 bg-red-500/5 p-5">

                  <p className="text-sm uppercase tracking-[0.25em] text-zinc-500 font-black">
                    Mã vé điện tử
                  </p>

                  <h2 className="mt-3 text-4xl font-black italic text-red-500">
                    #BK{booking.id}
                  </h2>
                </div>

                {/* WARNING */}
                <div className="mt-8 flex gap-3 text-left bg-yellow-500/5 border border-yellow-500/20 rounded-2xl p-5">

                  <Info
                    size={24}
                    className="text-yellow-400 shrink-0"
                  />

                  <p className="text-sm leading-relaxed text-zinc-400">
                    Vui lòng đến rạp trước giờ chiếu ít nhất
                    <span className="text-white font-bold">
                      {" "}15 phút
                    </span>
                    {" "}để đổi vé và ổn định chỗ ngồi.
                  </p>
                </div>

                {/* BUTTONS */}
                <div className="mt-8 grid grid-cols-2 gap-4">

                  <button className="h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center gap-2 font-black uppercase hover:bg-white/10 transition-all active:scale-95">
                    <Download size={20} />
                    Tải vé
                  </button>

                  <button className="h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center gap-2 font-black uppercase hover:bg-white/10 transition-all active:scale-95">
                    <Share2 size={20} />
                    Chia sẻ
                  </button>
                </div>

                {/* DONE */}
                <button
                  onClick={() => navigate("/")}
                  className="mt-6 w-full h-16 rounded-2xl bg-gradient-to-r from-red-700 to-red-600 hover:from-red-600 hover:to-red-500 transition-all text-xl font-black uppercase tracking-wide shadow-[0_10px_40px_rgba(220,38,38,0.4)] active:scale-[0.98]"
                >
                  Hoàn tất
                </button>

              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
