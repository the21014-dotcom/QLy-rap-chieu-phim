
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  ChevronLeft,
  Loader2,
  Timer,
  ChevronRight,
  ShieldCheck,
} from "lucide-react";

import { formatCurrency } from "../utils/format";
import { message, Checkbox } from "antd";
import api from "../api/axiosClient";

export default function Checkout() {
  const location = useLocation();
  const navigate = useNavigate();

  const {
    showtime,
    selectedSeats,
    selectedFoods,
    totals,
    bookingId,
  } = location.state || {};

  const [paymentMethod, setPaymentMethod] = useState<string>("VNPAY");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isAgreed, setIsAgreed] = useState(false);
  const [timeLeft, setTimeLeft] = useState(600);

  useEffect(() => {
    if (!showtime || !bookingId) {
      message.warning("Phiên làm việc đã hết hạn.");
      navigate("/");
    }

    window.scrollTo(0, 0);
  }, [showtime, bookingId, navigate]);

  useEffect(() => {
    if (timeLeft <= 0) {
      message.error("Hết thời gian giữ ghế!");
      navigate(-1);
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, navigate]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;

    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const handleConfirmPayment = async () => {
    if (!isAgreed) {
      message.warning("Vui lòng đồng ý điều khoản!");
      return;
    }

    try {
      setIsProcessing(true);

      const res: any = await api.post("/payments/process-manual", {
        bookingId: Number(bookingId),
        amount: totals?.finalTotal,
        paymentMethod,
      });

      const finalBookingId = res.data?.bookingId || bookingId;

      message.success("Thanh toán thành công!");

      setTimeout(() => {
        navigate(`/ticket/${finalBookingId}`, {
          state: { fromCheckout: true },
          replace: true,
        });
      }, 500);

    } catch (error: any) {
      console.error(error);

      const errorMsg =
        error.response?.data?.message || "Lỗi xử lý thanh toán";

      message.error(errorMsg);

    } finally {
      setIsProcessing(false);
    }
  };

  if (!showtime || !bookingId) return null;

  const paymentMethods = [
    {
      id: "VNPAY",
      title: "Thanh toán VNPAY QR",
      desc: "Quét QR bằng app ngân hàng",
      img: "https://vinadesign.vn/uploads/images/2023/05/vnpay-logo-vinadesign-25-12-57-55.jpg",
      qr: "https://api.qrserver.com/v1/create-qr-code/?size=260x260&data=VNPAY_2026",
    },

    {
      id: "MOMO",
      title: "Ví điện tử MoMo",
      desc: "Thanh toán siêu tốc",
      img: "https://cdn.haitrieu.com/wp-content/uploads/2022/10/Logo-MoMo-Square.png",
      qr: "https://sf-static.upanhlaylink.com/img/image_20260521fc42c85658d367664bc85973142465fc.jpg",
    },

    {
      id: "BANKING",
      title: "Chuyển khoản ngân hàng",
      desc: "Internet Banking / Mobile Banking",
      img: "https://png.pngtree.com/png-vector/20220730/ourlarge/pngtree-bank-transfer-icon-from-business-bicolor-set-savings-company-chat-vector-png-image_19327828.jpg",
      qr: "https://api.qrserver.com/v1/create-qr-code/?size=260x260&data=VCB_2026",
    },

    {
      id: "MANUAL",
      title: "Thẻ VISA / MASTER",
      desc: "Thanh toán quốc tế",
      img: "https://www.vhv.rs/dpng/d/402-4021109_logo-visa-master-visa-mastercard-logo-png-transparent.png",
    },
  ];

  return (
    <div className="min-h-screen bg-[#F5F5F5] text-zinc-900">

      {/* HEADER */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-xl border-b border-zinc-200 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">

          <button
            onClick={() => navigate(-1)}
            title="Quay lại"
            className="p-3 rounded-2xl hover:bg-zinc-100 transition"
          >
            <ChevronLeft size={24} />
          </button>

          <h1 className="text-2xl font-black uppercase tracking-tight">
            Thanh toán
          </h1>

          <div className="bg-red-50 text-red-600 px-4 py-2 rounded-2xl font-black text-lg flex items-center gap-2">
            <Timer size={20} />
            {formatTime(timeLeft)}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto pt-8 px-6 pb-10">

        <div className="grid lg:grid-cols-[1.25fr_0.75fr] gap-8 items-start">

          {/* LEFT */}
          <div className="space-y-8">

            {/* MOVIE INFO */}
            <div className="bg-white rounded-[30px] overflow-hidden shadow-xl border border-zinc-100">

              <div className="flex gap-6 p-6">

                <img
                  src={showtime?.movie?.poster_url}
                  alt={showtime?.movie?.title}
                  className="w-40 h-56 rounded-3xl object-cover shadow-xl"
                />

                <div className="flex-1">

                  <h2 className="text-3xl font-black uppercase leading-tight">
                    {showtime?.movie?.title}
                  </h2>

                  <p className="text-sm text-red-600 font-bold italic mt-2">
                    {showtime?.movie?.rating === "C18"
                      ? "T18 - KHÔNG DÀNH CHO KHÁN GIẢ DƯỚI 18 TUỔI"
                      : "P - PHIM DÀNH CHO MỌI ĐỘ TUỔI"}
                  </p>

                  <div className="mt-5 space-y-3 text-base text-zinc-600">

                    <p>
                      📅{" "}
                      {new Date(showtime?.start_time).toLocaleDateString(
                        "vi-VN"
                      )}
                    </p>

                    <p>
                      🕒{" "}
                      {new Date(showtime?.start_time).toLocaleTimeString(
                        "vi-VN",
                        {
                          hour: "2-digit",
                          minute: "2-digit",
                        }
                      )}
                    </p>

                    <p>
                      🎬 {showtime?.room?.cinema?.name}
                    </p>

                    <p>
                      🏛 {showtime?.room?.name}
                    </p>

                    <p className="font-bold text-zinc-900">
                      💺{" "}
                      {selectedSeats
                        .map(
                          (s: any) =>
                            `${s.rowLabel}${s.seatNumber}`
                        )
                        .join(", ")}
                    </p>
                  </div>
                </div>
              </div>

              {/* FOOD */}
              {selectedFoods?.length > 0 && (
                <div className="border-t border-dashed border-zinc-200 p-6">

                  <p className="text-sm uppercase font-black text-zinc-400 mb-4 tracking-widest">
                    Combo bắp nước
                  </p>

                  <div className="space-y-3">

                    {selectedFoods.map((f: any) => (
                      <div
                        key={f.food_id}
                        className="flex justify-between text-base"
                      >
                        <span className="text-zinc-600">
                          {f.name} x{f.quantity}
                        </span>

                        <span className="font-bold">
                          {formatCurrency(
                            f.price * f.quantity
                          )}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* PAYMENT */}
            <div className="bg-white rounded-[30px] overflow-hidden shadow-xl border border-zinc-100">

              <div className="bg-gradient-to-r from-red-600 to-red-500 px-6 py-4">
                <h2 className="text-white text-xl font-black uppercase">
                  Phương thức thanh toán
                </h2>
              </div>

              {paymentMethods.map((method) => (
                <div
                  key={method.id}
                  className={`border-b border-zinc-100 transition-all ${
                    paymentMethod === method.id
                      ? "bg-red-50"
                      : "bg-white"
                  }`}
                >
                  <label className="flex items-center gap-5 p-6 cursor-pointer">

                    <input
                      type="radio"
                      className="hidden"
                      checked={paymentMethod === method.id}
                      onChange={() =>
                        setPaymentMethod(method.id)
                      }
                    />

                    <div className="w-20 h-20 rounded-3xl bg-white border border-zinc-200 flex items-center justify-center overflow-hidden shadow-md">
                      <img
                        src={method.img}
                        alt={method.title}
                        className="max-h-10 object-contain"
                      />
                    </div>

                    <div className="flex-1">

                      <h3 className="font-black uppercase text-lg">
                        {method.title}
                      </h3>

                      <p className="text-sm text-zinc-500 mt-1">
                        {method.desc}
                      </p>
                    </div>

                    <div
                      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                        paymentMethod === method.id
                          ? "bg-red-600 border-red-600"
                          : "border-zinc-300"
                      }`}
                    >
                      {paymentMethod === method.id && (
                        <div className="w-2.5 h-2.5 bg-white rounded-full" />
                      )}
                    </div>
                  </label>

                  {paymentMethod === method.id &&
                    method.qr && (
                      <div className="px-6 pb-6">

                        <div className="bg-gradient-to-b from-white to-red-50 border border-red-100 rounded-[30px] p-8">

                          <div className="flex flex-col items-center">

                            <img
                              src={method.qr}
                              alt="QR"
                              className="w-72 h-72 rounded-3xl border-8 border-white shadow-2xl"
                            />

                            <h3 className="text-2xl font-black uppercase mt-6">
                              Quét mã để thanh toán
                            </h3>

                            <p className="text-base text-zinc-500 mt-2">
                              Hệ thống xác nhận tự động
                            </p>
                          </div>

                          <div className="mt-6 bg-white rounded-3xl border border-zinc-100 p-6 space-y-4 shadow-md">

                            <div className="flex justify-between text-base">
                              <span className="text-zinc-500">
                                Ngân hàng
                              </span>

                              <span className="font-bold">
                                Vietcombank
                              </span>
                            </div>

                            <div className="flex justify-between text-base">
                              <span className="text-zinc-500">
                                Số tài khoản
                              </span>

                              <span className="font-black text-red-600">
                                0866455816
                              </span>
                            </div>

                            <div className="flex justify-between text-base">
                              <span className="text-zinc-500">
                                Chủ tài khoản
                              </span>

                              <span className="font-bold">
                                CGV CINEMAS
                              </span>
                            </div>

                            <div className="flex justify-between text-base">
                              <span className="text-zinc-500">
                                Nội dung CK
                              </span>

                              <span className="font-black">
                                BOOKING{bookingId}
                              </span>
                            </div>
                          </div>

                          <div className="mt-5 flex items-center justify-center gap-2 text-green-600 font-bold">
                            <ShieldCheck size={18} />
                            Bảo mật SSL 256-bit
                          </div>
                        </div>
                      </div>
                    )}
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT */}
          <div className="sticky top-28">

            <div className="bg-white rounded-[30px] shadow-2xl border border-zinc-100 overflow-hidden">

              <div className="bg-gradient-to-r from-red-600 to-red-500 text-white p-6">

                <p className="text-sm opacity-80">
                  Tổng thanh toán
                </p>

                <h2 className="text-4xl font-black mt-2">
                  {formatCurrency(totals?.finalTotal)}
                </h2>
              </div>

              <div className="p-6 border-b border-zinc-100">

                <div className="flex justify-between text-base mb-4">
                  <span className="text-zinc-500">
                    Ghế
                  </span>

                  <span className="font-bold text-right">
                    {selectedSeats
                      .map(
                        (s: any) =>
                          `${s.rowLabel}${s.seatNumber}`
                      )
                      .join(", ")}
                  </span>
                </div>

                <div className="flex justify-between text-base">
                  <span className="text-zinc-500">
                    Rạp chiếu
                  </span>

                  <span className="font-bold text-right">
                    {showtime?.room?.cinema?.name}
                  </span>
                </div>
              </div>

              <div className="p-6 border-b border-zinc-100">

                <div className="flex gap-3">
                  <Checkbox
                    checked={isAgreed}
                    onChange={(e) =>
                      setIsAgreed(e.target.checked)
                    }
                  />

                  <p className="text-sm leading-relaxed text-zinc-500">
                    Tôi đồng ý với điều khoản sử dụng và xác nhận đủ tuổi xem phim.
                  </p>
                </div>
              </div>

              <div className="p-6">

                <button
                  onClick={handleConfirmPayment}
                  disabled={!isAgreed || isProcessing}
                  className={`w-full py-5 rounded-3xl font-black uppercase text-white text-xl transition-all flex items-center justify-center gap-2 ${
                    isAgreed && !isProcessing
                      ? "bg-[#B32025] hover:bg-red-700 shadow-2xl shadow-red-200"
                      : "bg-zinc-300"
                  }`}
                >
                  {isProcessing ? (
                    <>
                      <Loader2
                        className="animate-spin"
                        size={24}
                      />
                      Đang xử lý...
                    </>
                  ) : (
                    <>
                      Xác nhận thanh toán
                      <ChevronRight size={24} />
                    </>
                  )}
                </button>

                <p className="text-center text-xs text-zinc-400 mt-5">
                  Vé đã mua không thể đổi hoặc hoàn tiền
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
