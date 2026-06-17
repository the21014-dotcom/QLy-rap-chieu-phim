
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {

  ArrowLeft,
  Calendar,
  MapPin,
  Monitor,
  Sparkles,
  Ticket,
  Crown,
  Heart,
} from "lucide-react";

import { message, Spin } from "antd";
import api from "../api/axiosClient";
import { formatCurrency } from "../utils/format";

export default function SeatSelection() {
  const { showtimeId } = useParams<{ showtimeId: string }>();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [showtimeData, setShowtimeData] = useState<any>(null);
  const [selectedSeats, setSelectedSeats] = useState<any[]>([]);

  const fetchSeatData = useCallback(async () => {
    try {
      setLoading(true);

      const res: any = await api.get(`/showtimes/${showtimeId}`);

      if (res) {
        setShowtimeData(res?.data || res);
      }

    } catch (error) {
      console.error(error);
      message.error("Không thể tải sơ đồ ghế");

    } finally {
      setLoading(false);
    }
  }, [showtimeId]);

  useEffect(() => {
    if (!showtimeId || showtimeId === "NaN") {
      message.error("Thông tin suất chiếu không hợp lệ!");
      navigate("/");
      return;
    }

    fetchSeatData();

  }, [showtimeId, fetchSeatData, navigate]);

  const toggleSeat = (seat: any, rowSeats: any[]) => {
    if (seat.status !== "AVAILABLE") return;

    const isSweetbox =
      seat.type === "SWEETBOX" || seat.rowLabel === "K";

    setSelectedSeats((prev) => {
      const isSelected = prev.find((s) => s.id === seat.id);

      if (isSelected) {
        if (isSweetbox) {
          const pairIndex =
            seat.seatNumber % 2 === 0
              ? seat.seatNumber - 2
              : seat.seatNumber;

          const pairSeat = rowSeats[pairIndex];

          return prev.filter(
            (s) =>
              s.id !== seat.id &&
              s.id !== pairSeat?.id
          );
        }

        return prev.filter((s) => s.id !== seat.id);
      }

      if (prev.length >= 8) {
        message.warning("Tối đa chọn 8 ghế");
        return prev;
      }

      if (isSweetbox) {
        const isEven = seat.seatNumber % 2 === 0;

        const pairIndex = isEven
          ? seat.seatNumber - 2
          : seat.seatNumber;

        const pairSeat = rowSeats[pairIndex];

        if (pairSeat && pairSeat.status === "AVAILABLE") {
          const pairWithLabel = {
            ...pairSeat,
            rowLabel: seat.rowLabel,
            seatNumber: isEven
              ? seat.seatNumber - 1
              : seat.seatNumber + 1,
          };

          return [...prev, seat, pairWithLabel];
        }

        message.error("Ghế đôi không khả dụng!");
        return prev;
      }

      return [...prev, seat];
    });
  };

  const renderSeats = () => {
    if (!showtimeData?.showtime_seats) return null;

    const seats = showtimeData.showtime_seats;

    const cols =
      showtimeData.room?.cols_per_row || 10;

    const rows: any[][] = [];

    for (let i = 0; i < seats.length; i += cols) {
      rows.push(seats.slice(i, i + cols));
    }

    return rows.map((rowSeats, rowIndex) => {
      const rowLabel = String.fromCharCode(65 + rowIndex);

      if (rowLabel === "D") return null;

      return (
        <div
          key={rowIndex}
          className="flex items-center justify-center gap-2 mb-4"
        >
          {/* LEFT LABEL */}
          <div className="w-8 flex justify-center">
            <div className="w-7 h-7 rounded-lg bg-zinc-900 border border-white/10 flex items-center justify-center text-xs font-black text-zinc-400">
              {rowLabel}
            </div>
          </div>

          {/* SEATS */}
          <div className="flex gap-2">
            {rowSeats.map((subSeat, colIndex) => {
              const seatNumber = colIndex + 1;

              const actualSeatInfo =
                subSeat.seat || {};

              const seatType =
                actualSeatInfo.type || subSeat.type;

              const isSelected = selectedSeats.find(
                (s) => s.id === subSeat.id
              );

              const isOccupied =
                subSeat.status !== "AVAILABLE";

              const isVIP = seatType === "VIP";

              const isSweetbox =
                seatType === "SWEETBOX";

              return (
                <button
                  key={subSeat.id}
                  disabled={isOccupied}
                  title={`${rowLabel}${seatNumber}`}
                  onClick={() =>
                    toggleSeat(
                      {
                        ...subSeat,
                        rowLabel,
                        seatNumber,
                        type: seatType,
                      },
                      rowSeats
                    )
                  }
                  className={`
                    relative
                    transition-all
                    duration-300
                    rounded-2xl
                    font-black
                    border
                    flex
                    items-center
                    justify-center
                    overflow-hidden

                    ${
                      isSweetbox
                        ? "w-16 md:w-20 h-11"
                        : "w-10 h-11 md:w-11 md:h-11"
                    }

                    ${
                      isOccupied
                        ? "bg-zinc-900 border-zinc-800 text-zinc-700 cursor-not-allowed opacity-40"
                        : isSelected
                        ? "bg-red-600 border-red-400 text-white scale-105 shadow-[0_0_20px_rgba(239,68,68,0.7)]"
                        : isSweetbox
                        ? "bg-pink-950/30 border-pink-500/50 text-pink-300 hover:bg-pink-600 hover:text-white"
                        : isVIP
                        ? "bg-yellow-950/30 border-yellow-500/50 text-yellow-300 hover:bg-yellow-500 hover:text-black"
                        : "bg-zinc-900/70 border-zinc-700 text-zinc-300 hover:border-white hover:text-white"
                    }
                  `}
                >
                  {isOccupied ? (
                    <span className="text-[9px]">
                      X
                    </span>
                  ) : isSweetbox ? (
                    <div className="flex items-center gap-1">
                      <Heart size={13} />
                      <span className="text-[10px]">
                        {seatNumber}
                      </span>
                    </div>
                  ) : isVIP ? (
                    <div className="flex flex-col items-center leading-none">
                      <Crown size={11} />
                      <span className="text-[9px] mt-1">
                        {seatNumber}
                      </span>
                    </div>
                  ) : (
                    <span className="text-xs">
                      {seatNumber}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* RIGHT LABEL */}
          <div className="w-8 flex justify-center">
            <div className="w-7 h-7 rounded-lg bg-zinc-900 border border-white/10 flex items-center justify-center text-xs font-black text-zinc-400">
              {rowLabel}
            </div>
          </div>
        </div>
      );
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#070707] flex items-center justify-center">
        <Spin
          size="large"
          tip="Đang tải sơ đồ ghế..."
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#070707] text-white overflow-hidden">

      {/* HEADER */}
      <header className="sticky top-0 z-50 bg-black/80 backdrop-blur-xl border-b border-white/5">

        <div className="max-w-[1700px] mx-auto px-5 md:px-10 py-5">

          <div className="flex flex-col xl:flex-row items-start xl:items-center justify-between gap-6">

            {/* LEFT */}
            <div className="flex items-center gap-5">

              <button
                title="quay lại"
                onClick={() => navigate(`/`)}
                className="w-12 h-12 rounded-2xl bg-zinc-900 border border-white/10 flex items-center justify-center hover:bg-zinc-800 transition-all"
              >
                <ArrowLeft size={20} />
              </button>

              <div>
                <span className="text-red-500 uppercase text-[11px] tracking-[0.35em] font-black block mb-1">
                  BƯỚC 02
                </span>

                 <h1 className="text-lg md:text-2xl font-extrabold uppercase tracking-[0.25em] text-white/80">
    Chọn ghế ngồi
  </h1>

  <p
    className="
      mt-3
      text-2xl md:text-4xl
      font-black
      uppercase
      italic
      leading-tight
      tracking-tight
      bg-gradient-to-r
      from-red-500
      via-white
      to-red-400
      bg-clip-text
      text-transparent
      drop-shadow-[0_0_18px_rgba(239,68,68,0.45)]
    "
  >
    {showtimeData?.movie?.title}
  </p>
              </div>
            </div>

            {/* RIGHT */}
            <div className="flex flex-wrap gap-3">

              <div className="flex items-center gap-2 bg-zinc-900 border border-white/5 px-5 py-3 rounded-2xl">
                <MapPin size={16} className="text-red-500" />
                <span className="text-sm font-bold text-zinc-300">
                  {showtimeData?.room?.cinema?.name}
                </span>
              </div>

              <div className="flex items-center gap-2 bg-zinc-900 border border-white/5 px-5 py-3 rounded-2xl">
                <Monitor size={16} className="text-yellow-400" />
                <span className="text-sm font-bold text-zinc-300">
                  {showtimeData?.room?.name}
                </span>
              </div>

              <div className="flex items-center gap-2 bg-zinc-900 border border-white/5 px-5 py-3 rounded-2xl">
                <Calendar size={16} className="text-blue-400" />
                <span className="text-sm font-bold text-zinc-300">
                  {new Date(
                    showtimeData?.start_time
                  ).toLocaleString("vi-VN", {
                    hour: "2-digit",
                    minute: "2-digit",
                    day: "2-digit",
                    month: "2-digit",
                  })}
                </span>
              </div>

            </div>
          </div>
        </div>
      </header>

      {/* MAIN */}
      <main className="pb-44">

        <div className="max-w-[1700px] mx-auto px-5 md:px-10 pt-10">

          {/* SCREEN */}
          <div className="relative w-full max-w-6xl mx-auto mb-16">

            {/* GLOW */}
            <div className="absolute inset-0 flex justify-center pointer-events-none">
              <div className="w-[85%] h-10 bg-red-600/20 blur-3xl rounded-full"></div>
            </div>

            {/* CURVE */}
            <div className="relative h-12 overflow-hidden">

              <div
                className="
                  absolute
                  inset-0
                  rounded-[100%]
                  border-t-[4px]
                  border-red-500
                  bg-gradient-to-b
                  from-red-500/15
                  via-red-500/5
                  to-transparent
                  shadow-[0_0_40px_rgba(239,68,68,0.7)]
                "
              />

              <div
                className="
                  absolute
                  left-1/2
                  -translate-x-1/2
                  top-0
                  w-[40%]
                  h-2
                  bg-red-400
                  blur-xl
                "
              />
            </div>

            <div className="text-center mt-2">
              <span className="uppercase tracking-[0.5em] text-[10px] text-zinc-600 font-black">
                MÀN HÌNH
              </span>
            </div>
          </div>

          {/* CONTENT */}
          <div className="grid grid-cols-1 xl:grid-cols-[260px_1fr_260px] gap-8 items-start">

            {/* LEGEND */}
            <div className="xl:w-72 w-full">

              <div className="bg-zinc-950 border border-white/10 rounded-3xl p-6">

                <div className="flex items-center gap-2 mb-6">
                  <Sparkles
                    size={18}
                    className="text-red-500"
                  />

                  <h3 className="font-black uppercase tracking-wide text-lg">
                    Chú thích
                  </h3>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-5 xl:grid-cols-1 gap-4">

                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-md bg-zinc-900 border border-zinc-700"></div>
                    <span className="text-sm font-bold text-zinc-300">
                      Ghế thường
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-md bg-yellow-950/40 border border-yellow-500"></div>
                    <span className="text-sm font-bold text-yellow-300">
                      VIP
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-10 h-5 rounded-md bg-pink-950/40 border border-pink-500"></div>
                    <span className="text-sm font-bold text-pink-300">
                      Sweetbox
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-md bg-red-600 border border-red-500"></div>
                    <span className="text-sm font-bold text-white">
                      Đang chọn
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-md bg-zinc-800 border border-zinc-700 flex items-center justify-center text-[8px]">
                      X
                    </div>

                    <span className="text-sm font-bold text-zinc-500">
                      Đã bán
                    </span>
                  </div>

                </div>
              </div>
            </div>

            {/* SEATS */}
            <div className="flex-1 w-full overflow-x-auto no-scrollbar pb-20">

              <div className="min-w-[820px] flex justify-center px-4">

                <div>
                  {renderSeats()}
                </div>

              </div>
            </div>
          </div>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="fixed bottom-0 left-0 right-0 bg-black/90 backdrop-blur-2xl border-t border-white/10 z-50">

        <div className="max-w-[1700px] mx-auto px-5 md:px-10 py-5">

          <div className="flex flex-col xl:flex-row items-center justify-between gap-6">

            {/* INFO */}
            <div className="flex flex-wrap gap-8 w-full xl:w-auto justify-between">

              <div>
                <p className="text-zinc-500 uppercase text-[10px] tracking-[0.3em] font-black mb-2">
                  Ghế đã chọn
                </p>

                <p className="text-2xl font-black italic text-red-500 min-h-[32px]">
                  {selectedSeats.length > 0
                    ? selectedSeats
                        .map(
                          (s) =>
                            `${s.rowLabel}${s.seatNumber}`
                        )
                        .sort()
                        .join(", ")
                    : "---"}
                </p>
              </div>

              <div className="xl:border-l border-white/10 xl:pl-8">

                <p className="text-zinc-500 uppercase text-[10px] tracking-[0.3em] font-black mb-2">
                  Tổng thanh toán
                </p>

                <p className="text-3xl font-black italic text-white">
                  {formatCurrency(
                    selectedSeats.reduce(
                      (total, s) =>
                        total +
                        (s.price_base ||
                          showtimeData?.price_base ||
                          0),
                      0
                    )
                  )}
                </p>
              </div>
            </div>

            {/* BUTTON */}
            <button
              disabled={selectedSeats.length === 0}
              onClick={() =>
                navigate(`/booking/${showtimeId}`, {
                  state: {
                    selectedSeats,
                    showtimeData,
                  },
                })
              }
              className="
                w-full
                xl:w-[360px]
                h-16
                rounded-2xl
                bg-red-600
                hover:bg-red-700
                disabled:bg-zinc-800
                disabled:text-zinc-600
                disabled:cursor-not-allowed
                font-black
                uppercase
                tracking-[0.2em]
                text-sm
                transition-all
                shadow-[0_0_40px_rgba(239,68,68,0.3)]
                flex
                items-center
                justify-center
                gap-3
              "
            >
              <Ticket size={18} />

              Tiếp tục thanh toán
              ({selectedSeats.length})
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}

