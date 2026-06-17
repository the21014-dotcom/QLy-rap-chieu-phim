// src/pages/PaymentResult.tsx
import { useSearchParams } from "react-router-dom";

export default function PaymentResult() {
  const [searchParams] = useSearchParams();
  const isSuccess = searchParams.get("vnp_ResponseCode") === "00";

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-dark text-white p-6">
      <div className={`mb-8 flex h-24 w-24 items-center justify-center rounded-full text-5xl shadow-2xl 
        ${isSuccess ? "bg-green-500 shadow-green-500/20" : "bg-red-500 shadow-red-500/20"}`}>
        {isSuccess ? "✓" : "✕"}
      </div>

      <h2 className="mb-2 text-3xl font-black uppercase italic">
        {isSuccess ? "Thanh toán thành công" : "Giao dịch thất bại"}
      </h2>
      <p className="max-w-md text-center text-zinc-500">
        {isSuccess 
          ? "Vé điện tử đã được gửi vào email và lịch sử đặt vé của bạn. Hãy chuẩn bị sẵn sàng cho giờ phim!" 
          : "Có lỗi xảy ra trong quá trình thanh toán. Vui lòng kiểm tra lại số dư tài khoản hoặc thử lại sau."}
      </p>

      <div className="mt-10 flex gap-4">
        <button 
          onClick={() => window.location.href = '/'}
          className="rounded-full border border-zinc-700 px-8 py-3 font-bold hover:bg-white hover:text-black transition-all"
        >
          QUAY LẠI TRANG CHỦ
        </button>
        {isSuccess && (
          <button className="rounded-full bg-primary px-8 py-3 font-bold shadow-lg shadow-red-900/40 hover:scale-105 transition-transform">
            XEM VÉ CỦA TÔI
          </button>
        )}
      </div>
    </div>
  );
}