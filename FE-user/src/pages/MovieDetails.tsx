import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { movieApi } from "../api/movieApi";
import type { Movie, MovieGenre, Showtime } from "../types/movie";
import { 
  Loader2, Clock, Star, Play, Globe, User, Users, 
  Calendar, MessageSquare, Send, UserCircle, ShieldCheck
} from "lucide-react";
import MovieTrailerModal from "../components/MovieTrailerModal";
import { notification, Rate, Avatar, Empty, Tag } from "antd";
import AIChatBot from '../components/AIChatBot';
/* eslint-disable @typescript-eslint/no-explicit-any */

export default function MovieDetails() {
  const { id } = useParams<{ id: string }>();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [feedbacks, setFeedbacks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [isTrailerOpen, setIsTrailerOpen] = useState(false);
  
  const [content, setContent] = useState("");
  const [rating, setRating] = useState(5);

  const navigate = useNavigate();

  const fetchData = async () => {
    if (!id) return;
    setLoading(true);
    try {
      const [movieRes, feedbackRes] = await Promise.all([
        movieApi.getDetail(id),
        movieApi.getFeedbacks(id)
      ]);
      setMovie(movieRes.data || movieRes);
      setFeedbacks(feedbackRes.data || feedbackRes);
    } catch (err) {
      console.error("Lỗi lấy dữ liệu:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  const handleSubmitFeedback = async () => {
    if (content.length < 10) {
      return notification.error({ message: "Nội dung phải từ 10 ký tự trở lên!" });
    }
    setSubmitting(true);
    try {
      await movieApi.postFeedback({ movie_id: Number(id), content, rating });
      notification.success({ message: "Đánh giá của bạn đã được ghi lại!" });
      setContent("");
      const res = await movieApi.getFeedbacks(id!);
      setFeedbacks(res.data || res);
    } catch (err: any) {
      notification.error({ 
        message: err.response?.data?.message || "Lỗi hệ thống, vui lòng thử lại sau!" 
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return (
    <div className="flex min-h-screen items-center justify-center bg-[#0a0a0a]">
      <Loader2 className="animate-spin text-primary" size={48} />
    </div>
  );

  if (!movie) return <div className="text-center text-white pt-20 font-bold">Phim hiện không tồn tại!</div>;

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white pb-20 selection:bg-primary/30">
      
      {/* 1. Hero Header & Banner Section */}
      <div className="relative h-[75vh] w-full overflow-hidden">
        <img 
          src={movie.landscape_url || movie.poster_url}
          className="h-full w-full object-cover opacity-40 scale-105 blur-[2px]"
          alt="backdrop" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/50 to-transparent" />
        
        <div className="absolute inset-0 flex items-center justify-center pt-24">
          <div className="mx-auto flex max-w-7xl flex-col items-center gap-12 px-6 md:flex-row md:items-end">
            
            {/* Poster với hiệu ứng Shine */}
            <div className="group relative w-72 shrink-0 shadow-[0_0_50px_rgba(229,9,20,0.3)] animate-in fade-in slide-in-from-bottom duration-1000">
              <img 
                src={movie.poster_url} 
                className="rounded-2xl border border-white/10 transition-transform duration-500 group-hover:scale-[1.02]" 
                alt={movie.title} 
              />
              <div 
                onClick={() => setIsTrailerOpen(true)}
                className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 rounded-2xl cursor-pointer transition-all duration-300"
              >
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/90 shadow-2xl scale-75 group-hover:scale-100 transition-transform">
                  <Play className="fill-white ml-1" size={36} />
                </div>
              </div>
            </div>
            
            {/* Title & Metadata Header */}
            <div className="flex flex-col gap-6 text-center md:text-left animate-in fade-in slide-in-from-left duration-1000">
              <div className="space-y-3">
                <div className="flex flex-wrap justify-center gap-2 md:justify-start">
                  {movie.genres?.map((g: MovieGenre) => (
                    <Tag color="red" key={g.genre_id} className="rounded-md border-none font-bold uppercase tracking-widest px-3 py-1 bg-primary/20 text-primary">
                      {g.genre?.name}
                    </Tag>
                  ))}
                </div>
                <h1 className="text-5xl font-black uppercase italic tracking-tighter md:text-7xl leading-none">
                  {movie.title}
                </h1>
              </div>

              <div className="flex flex-wrap justify-center gap-6 text-sm font-black uppercase tracking-widest text-zinc-300 md:justify-start">
                <span className="flex items-center gap-2 bg-white/5 px-3 py-1 rounded-lg border border-white/10"><Clock size={18} className="text-primary" /> {movie.duration} Phút</span>
                <span className="flex items-center gap-2 bg-primary px-3 py-1 rounded-lg text-white"><ShieldCheck size={18} /> {movie.rating}</span>
                <span className="flex items-center gap-1 text-yellow-500 text-lg bg-yellow-500/10 px-3 py-1 rounded-lg border border-yellow-500/20">
                  <Star size={20} fill="currentColor" /> 
                  {feedbacks.length > 0 ? (feedbacks.reduce((a, b) => a + b.rating, 0) / feedbacks.length).toFixed(1) : "8.5"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Main Content */}
      <section className="mx-auto mt-16 max-w-7xl px-6 grid grid-cols-1 lg:grid-cols-3 gap-16">
        
        <div className="lg:col-span-2 space-y-20">
          
          {/* Card Thông số chi tiết */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 rounded-[40px] bg-white/5 p-10 border border-white/10 backdrop-blur-md">
            <div className="space-y-8">
              <div className="flex items-start gap-5">
                <div className="p-4 rounded-2xl bg-primary/10 text-primary"><User size={24} /></div>
                <div>
                  <p className="text-xs font-black uppercase text-zinc-500 tracking-widest mb-1">Đạo diễn</p>
                  <p className="text-xl font-bold text-white">{movie.director || 'Chưa cập nhật'}</p>
                </div>
              </div>
              <div className="flex items-start gap-5">
                <div className="p-4 rounded-2xl bg-primary/10 text-primary"><Globe size={24} /></div>
                <div>
                  <p className="text-xs font-black uppercase text-zinc-500 tracking-widest mb-1">Ngôn ngữ</p>
                  <p className="text-xl font-bold text-white">{movie.language || 'Tiếng Việt - Phụ đề Tiếng Anh'}</p>
                </div>
              </div>
            </div>
            <div className="space-y-8">
              <div className="flex items-start gap-5">
                <div className="p-4 rounded-2xl bg-primary/10 text-primary"><Users size={24} /></div>
                <div>
                  <p className="text-xs font-black uppercase text-zinc-500 tracking-widest mb-1">Diễn viên</p>
                  <p className="text-lg font-bold text-white leading-tight">{movie.actors || 'Thông tin đang cập nhật'}</p>
                </div>
              </div>
              <div className="flex items-start gap-5">
                <div className="p-4 rounded-2xl bg-primary/10 text-primary"><Calendar size={24} /></div>
                <div>
                  <p className="text-xs font-black uppercase text-zinc-500 tracking-widest mb-1">Ngày khởi chiếu</p>
                  <p className="text-xl font-bold text-white">
                    {movie.release_date ? new Date(movie.release_date).toLocaleDateString('vi-VN', { day: '2-digit', month: 'long', year: 'numeric' }) : 'Sắp ra mắt'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Tóm tắt nội dung */}
          <div className="animate-in fade-in duration-1000 delay-300">
            <h2 className="mb-8 text-3xl font-black uppercase italic border-l-8 border-primary pl-6 tracking-tight">Nội dung phim</h2>
            <p className="text-xl leading-[1.8] text-zinc-400 text-justify font-medium">
              {movie.description || "Phim hiện chưa có tóm tắt nội dung chính thức từ nhà phát hành."}
            </p>
          </div>

          {/* Lịch chiếu Section */}
<div className="animate-in fade-in duration-1000 delay-500">
  <h2 className="mb-10 text-3xl font-black uppercase italic border-l-8 border-primary pl-6 tracking-tight">
    Lịch chiếu trực tuyến
  </h2>
  
  <Link
    to="/cinemas"
    state={{ targetMovieId: movie.id }} // Truyền ID phim sang trang Cinemas để tự scroll/lọc
    className="group relative block overflow-hidden rounded-[40px] border border-white/10 bg-gradient-to-br from-white/10 via-zinc-900/40 to-black p-10 shadow-2xl transition-all duration-500 hover:border-primary/40 hover:shadow-primary/5 hover:-translate-y-1"
  >
    {/* Hiệu ứng Glow nền khi hover */}
    <div className="absolute -inset-px bg-gradient-to-r from-primary/20 to-transparent opacity-0 blur-xl transition-opacity duration-500 group-hover:opacity-100" />

    <div className="relative flex flex-col md:flex-row items-center justify-between gap-8 z-10">
      <div className="flex items-center gap-6 text-center md:text-left flex-col md:flex-row">
        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary border border-primary/20 transition-transform duration-500 group-hover:scale-110 group-hover:bg-primary group-hover:text-white">
          <Calendar size={32} />
        </div>
        <div>
          <h3 className="text-2xl font-black uppercase text-white tracking-tight mb-2 group-hover:text-primary transition-colors">
            Xem lịch chiếu & Đặt vé ngay
          </h3>
          <p className="text-zinc-400 text-lg font-medium leading-relaxed max-w-xl">
            Nhấn vào đây để kiểm tra tất cả các suất chiếu trực tuyến đang có sẵn tại các cụm rạp CGV dành riêng cho bộ phim <span className="text-white font-bold italic">"{movie.title}"</span>.
          </p>
        </div>
      </div>

      {/* Nút hành động giả lập bên phải card */}
      <div className="shrink-0">
        <span className="inline-flex items-center gap-3 rounded-2xl bg-white/5 border border-white/10 px-8 py-5 font-black uppercase text-sm tracking-wider text-white transition-all duration-300 group-hover:bg-primary group-hover:border-primary group-hover:text-white group-hover:shadow-lg group-hover:shadow-primary/20">
          <Play className="fill-currentColor" size={16} />
          Tìm suất chiếu ngay
        </span>
      </div>
    </div>
  </Link>
</div>

          {/* Feedback Section (Phần bạn yêu cầu) */}
          <div id="reviews" className="pt-10">
            <h2 className="mb-10 text-3xl font-black uppercase italic border-l-8 border-primary pl-6 tracking-tight flex items-center gap-4">
              <MessageSquare size={32} className="text-primary" /> Review từ khán giả
            </h2>

            {/* Form viết đánh giá */}
            <div className="mb-12 rounded-[40px] bg-linear-to-br from-white/10 to-transparent p-10 border border-white/10 shadow-inner">
              <div className="flex items-center gap-6 mb-8">
                 <p className="font-black text-xl text-zinc-200 uppercase tracking-tighter">Bạn đánh giá phim thế nào?</p>
                 <Rate allowHalf defaultValue={5} onChange={setRating} value={rating} className="text-primary text-4xl" />
              </div>
              <div className="relative group">
                <textarea 
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Review phim thật tâm sẽ giúp ích cho mọi người rất nhiều..."
                  className="w-full rounded-3xl bg-black/50 p-8 text-white border-2 border-white/5 focus:border-primary outline-none min-h-[150px] transition-all text-lg placeholder:text-zinc-600"
                />
                <button 
                  onClick={handleSubmitFeedback}
                  disabled={submitting}
                  className="absolute bottom-6 right-6 flex items-center gap-3 rounded-2xl bg-primary px-8 py-4 font-black uppercase text-sm hover:bg-red-700 transition-all disabled:opacity-50 shadow-2xl shadow-primary/20"
                >
                  {submitting ? <Loader2 className="animate-spin" size={20} /> : <Send size={20} />}
                  Đăng đánh giá
                </button>
              </div>
            </div>

            {/* Danh sách Feedback đã đánh giá */}
            <div className="space-y-8">
              {feedbacks.length > 0 ? (
                feedbacks.map((fb) => (
                  <div key={fb.id} className="flex gap-6 rounded-[35px] bg-white/5 p-8 border border-white/5 hover:bg-white/10 transition-colors">
                    <Avatar size={64} src={fb.user?.avatar} icon={<UserCircle />} className="border-2 border-primary/40 shrink-0" />
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="text-xl font-black text-primary uppercase italic tracking-tighter leading-none">
                          {fb.user?.full_name || "Thành viên CGV"}
                        </h4>
                        <span className="text-xs text-zinc-500 font-bold uppercase tracking-widest bg-white/5 px-3 py-1 rounded-full">
                          {new Date(fb.created_at).toLocaleDateString('vi-VN')}
                        </span>
                      </div>
                      <Rate disabled defaultValue={fb.rating} className="text-xs mb-4 block opacity-80" />
                      <p className="text-zinc-300 text-lg leading-relaxed font-medium">"{fb.content}"</p>
                    </div>
                  </div>
                ))
              ) : (
                <Empty 
                  image={Empty.PRESENTED_IMAGE_SIMPLE} 
                  description={<span className="text-zinc-500 text-lg italic">Chưa có đánh giá nào cho phim này.</span>} 
                />
              )}
            </div>
          </div>
        </div>

        {/* Sidebar Rights */}
        <div className="space-y-10">
          <div className="sticky top-28 space-y-10">
            <div className="overflow-hidden rounded-[40px] bg-gradient-to-b from-primary/30 to-black border border-primary/30 p-10 text-center relative">
               <div className="relative z-10">
                  <h3 className="text-white font-black uppercase text-2xl mb-4 italic tracking-tighter">Ưu đãi độc quyền</h3>
                  <p className="text-zinc-400 text-sm mb-8 font-bold uppercase tracking-wider">Giảm 50% cho vé thứ 2 vào thứ 4 hàng tuần!</p>
                  <button onClick={() => navigate('/promotions')} className="w-full rounded-2xl bg-primary py-5 font-black uppercase text-lg shadow-2xl shadow-primary/40 hover:scale-[1.05] active:scale-95 transition-all">
                    Xem Chương Trình
                  </button>
               </div>
            </div>
          </div>
        </div>

      </section>

      <MovieTrailerModal 
        videoUrl={movie?.trailer_url || ""} 
        isOpen={isTrailerOpen} 
        onClose={() => setIsTrailerOpen(false)} 
      />
      <AIChatBot />
    </div>
  );
}