/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authApi } from "../api/authApi";
import { useAuth } from "../store/AuthContext"; 
import { Loader2, ArrowRight, ShieldCheck, ArrowLeft } from "lucide-react";

type AuthStep = "login" | "register" | "otp" | "forgot";

export default function Auth() {
  const [step, setStep] = useState<AuthStep>("login");
  const [loading, setLoading] = useState(false);
  
  // States cho form
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");

  const { login: saveAuthSession } = useAuth();
  const navigate = useNavigate();

  // 1. Xử lý Đăng nhập
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await authApi.login({ email, password });
      saveAuthSession(res.data.user, res.data.access_token);
      navigate("/");
    } catch (err: any) {
      alert(err.response?.data?.message || "Sai tài khoản hoặc mật khẩu!");
    } finally {
      setLoading(false);
    }
  };

  // 2. Xử lý Đăng ký
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await authApi.register({ email, password, full_name: fullName, phone });
      setStep("otp"); 
    } catch (err: any) {
      alert(err.response?.data?.message || "Đăng ký thất bại, vui lòng thử lại!");
    } finally {
      setLoading(false);
    }
  };

  // 3. Xử lý Quên mật khẩu
  const handleForgot = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await authApi.forgotPassword(email);
      alert("Mật khẩu mới đã được gửi vào Email của bạn!");
      setStep("login");
    } catch (err: any) {
      alert(err.response?.data?.message || "Email không tồn tại!");
    } finally {
      setLoading(false);
    }
  };

  // 4. Xác thực OTP (Tự động gọi khi đủ 6 số)
  const handleVerifyOtp = async (otpValue: string) => {
    if (otpValue.length !== 6) return; 
    setLoading(true);
    try {
      await authApi.verifyOtp({ email, otp: otpValue });
      alert("Kích hoạt tài khoản thành công! Mời bạn đăng nhập.");
      setStep("login");
    } catch (err: any) {
      alert(err.response?.data?.message || "Mã OTP không chính xác.");
    } finally {
      setLoading(false);
    }
  };

  // Hàm helper để render tiêu đề nút bấm
  const getSubmitText = () => {
    if (step === "login") return "Vào rạp ngay";
    if (step === "register") return "Gửi mã xác thực";
    if (step === "forgot") return "Lấy lại mật khẩu";
    return "";
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-dark p-4 font-main">
      <div className="w-full max-w-md rounded-3xl border border-zinc-800 bg-card p-8 shadow-2xl relative overflow-hidden">
        
        {/* Logo Section */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-black italic tracking-tighter text-primary">CGV CINEMAS</h1>
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">Trải nghiệm điện ảnh chuẩn quốc tế</p>
        </div>

        {step !== "otp" ? (
          <>
            {/* Tab Switcher - Chỉ hiện khi không ở mode Forgot */}
            {step !== "forgot" && (
              <div className="mb-8 flex rounded-xl bg-zinc-900 p-1">
                <button 
                  onClick={() => setStep("login")} 
                  className={`flex-1 rounded-lg py-2.5 text-[10px] font-black tracking-widest transition-all ${step === "login" ? "bg-primary text-white shadow-lg" : "text-zinc-500"}`}
                >
                  ĐĂNG NHẬP
                </button>
                <button 
                  onClick={() => setStep("register")} 
                  className={`flex-1 rounded-lg py-2.5 text-[10px] font-black tracking-widest transition-all ${step === "register" ? "bg-primary text-white shadow-lg" : "text-zinc-500"}`}
                >
                  ĐĂNG KÝ
                </button>
              </div>
            )}

            {/* Form Title cho chế độ Forgot */}
            {step === "forgot" && (
              <button 
                onClick={() => setStep("login")}
                className="mb-6 flex items-center gap-2 text-[10px] font-black uppercase text-zinc-500 hover:text-primary transition-colors"
              >
                <ArrowLeft size={14} /> Quay lại đăng nhập
              </button>
            )}

            <form 
              onSubmit={step === "login" ? handleLogin : step === "register" ? handleRegister : handleForgot} 
              className="space-y-4"
            >
              {/* Fields cho Register */}
              {step === "register" && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="ml-1 text-[9px] font-black uppercase text-zinc-500 tracking-widest">Họ và tên</label>
                    <input type="text" placeholder="Văn A" className="w-full rounded-xl bg-zinc-800 p-4 text-sm font-bold text-white outline-none focus:ring-2 focus:ring-primary" onChange={(e) => setFullName(e.target.value)} required />
                  </div>
                  <div className="space-y-1">
                    <label className="ml-1 text-[9px] font-black uppercase text-zinc-500 tracking-widest">SĐT</label>
                    <input type="text" placeholder="09xxx" className="w-full rounded-xl bg-zinc-800 p-4 text-sm font-bold text-white outline-none focus:ring-2 focus:ring-primary" onChange={(e) => setPhone(e.target.value)} required />
                  </div>
                </div>
              )}

              {/* Email - Luôn hiện */}
              <div className="space-y-1">
                <label className="ml-1 text-[9px] font-black uppercase text-zinc-500 tracking-widest">Email</label>
                <input type="email" value={email} placeholder="example@gmail.com" className="w-full rounded-xl bg-zinc-800 p-4 text-sm font-bold text-white outline-none focus:ring-2 focus:ring-primary" onChange={(e) => setEmail(e.target.value)} required />
              </div>

              {/* Password - Ẩn khi ở chế độ Forgot */}
              {step !== "forgot" && (
                <div className="space-y-1">
                  <label className="ml-1 text-[9px] font-black uppercase text-zinc-500 tracking-widest">Mật khẩu</label>
                  <input type="password" placeholder="••••••••" className="w-full rounded-xl bg-zinc-800 p-4 text-sm font-bold text-white outline-none focus:ring-2 focus:ring-primary" onChange={(e) => setPassword(e.target.value)} required />
                </div>
              )}

              {/* Link Quên mật khẩu */}
              {step === "login" && (
                <div className="flex justify-end">
                  <button type="button" onClick={() => setStep("forgot")} className="text-[10px] font-bold text-zinc-500 hover:text-primary transition-colors">
                    Quên mật khẩu?
                  </button>
                </div>
              )}

              {/* Submit Button */}
              <button disabled={loading} className="group relative mt-4 w-full overflow-hidden rounded-xl bg-primary py-4 font-black text-white transition-all active:scale-95 disabled:opacity-50 shadow-xl shadow-primary/20">
                {loading ? <Loader2 className="mx-auto animate-spin" /> : (
                  <span className="flex items-center justify-center gap-2 text-xs uppercase tracking-widest">
                    {getSubmitText()} <ArrowRight size={16} />
                  </span>
                )}
              </button>
            </form>
          </>
        ) : (
          /* OTP VIEW */
          <div className="text-center animate-in fade-in zoom-in duration-300">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
              <ShieldCheck size={32} />
            </div>
            <h2 className="text-xl font-black uppercase tracking-tight text-white">Xác thực tài khoản</h2>
            <p className="mt-2 text-xs font-medium text-zinc-500 uppercase tracking-wide leading-relaxed">
                Mã OTP đã được gửi tới <br/>
                <span className="text-primary font-bold">{email}</span>
            </p>
            
            <input 
              type="text" maxLength={6} placeholder="000000"
              className="mt-8 w-full bg-transparent text-center text-5xl font-black tracking-[0.3em] text-primary outline-none placeholder:text-zinc-800"
              onChange={(e) => handleVerifyOtp(e.target.value)}
              disabled={loading}
              autoFocus
            />
            
            <button 
              type="button"
              onClick={() => setStep("register")}
              className="mt-10 text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:text-white transition-colors underline underline-offset-4"
            >
              ← Thay đổi email khác
            </button>
          </div>
        )}
      </div>
    </div>
  );
}