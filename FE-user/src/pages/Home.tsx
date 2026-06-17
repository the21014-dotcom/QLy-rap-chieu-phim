import { useState, useEffect, useRef } from "react";
import { movieApi } from "../api/movieApi";
import { bannerApi } from "../api/bannerApi";
import type { Movie } from "../types/movie";
import {
  Loader2,
  Star,
  ChevronLeft,
  ChevronRight,
  Play,
  X,
  Gift,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import MovieTrailerModal from "../components/MovieTrailerModal";
import { motion, AnimatePresence } from "framer-motion"; // Thêm thư viện này để pop-up mượt hơn
import AIChatBot from '../components/AIChatBot';
/* eslint-disable @typescript-eslint/no-explicit-any */

export interface Banner {
  id: number;
  title: string | null;
  image_url: string;
  movie_id: number | null;
  is_active: boolean;
  movie?: {
    id: number;
    title: string;
    rating: string;
    priority?: number;
    type?: string;
  };
}

const TRAILERS = [
  {
    id: 1,
    title: " Shin - Cậu Bé Bút Chì: Chuyện chuyển nhà! Cuộc tấn công của đội quân xương rồng!",
    thumbnail: "https://st.download.com.vn/data/image/2022/12/21/shin-cau-be-but-chi-700.jpg",
    videoUrl: "https://youtu.be/nfPjUm8hj4g",
  },
  {
    id: 2,
    title: "Phim Điện Ảnh Doraemon: Nobita và Lâu Đài Dưới Đáy Biển🎈",
    thumbnail: "https://iguov8nhvyobj.vcdn.cloud/media/banner/cache/1/b58515f018eb873dafa430b6f9ae0c1e/9/8/980x448__1_.png",
    videoUrl: "https://youtu.be/u3JgYkmuK78",
  },
  {
    id: 3,
    title: "HÀNH TINH KHỈ: VƯƠNG QUỐC MỚI",
    thumbnail: "https://wallpaperaccess.com/full/1704223.jpg",
    videoUrl: "https://youtu.be/mYz6jAL7wzE",
  },
  {
    id: 4,
    title: "BỐ GIÀ[FULL]",
    thumbnail: "https://images.fptplay53.net/media/OTT/VOD/2024/04/27/bo-gia-fpt-play-1714183180140_Landscape.jpg",
    videoUrl: "https://youtu.be/oA-BhGNK7qw",
  },
  {
    id: 5,
    title: "TẠM BIỆT GOHAN",
    thumbnail: "https://iguov8nhvyobj.vcdn.cloud/media/banner/cache/1/b58515f018eb873dafa430b6f9ae0c1e/9/8/980x448_53__8.jpg",
    videoUrl: "https://youtu.be/PaGtIdi8ONk",
  },
];

// Dữ liệu ưu đãi mới nhất
const PROMOTIONS = [
  { id: 1, title: 'ĐỒNG GIÁ 79.000Đ CHO THÀNH VIÊN CGV', image: 'https://iguov8nhvyobj.vcdn.cloud/media/wysiwyg/2025/102025/350x495_13_.jpg' },
   { id: 2, title: 'THỨ TƯ VUI VẺ - GIÁ VÉ CHỈ TỪ 60.000Đ', image: 'https://iguov8nhvyobj.vcdn.cloud/media/wysiwyg/2025/122025/ONL_Rolling_980x448.png' },
  { id: 3, title: 'MOMO DAY', image: 'https://iguov8nhvyobj.vcdn.cloud/media/banner/cache/1/b58515f018eb873dafa430b6f9ae0c1e/9/8/980x448_55__6.jpg' },
   { id: 4, title: 'QUÀ TẶNG SINH NHẬT THÀNH VIÊN CGV TRONG THÁNG 5', image: 'https://iguov8nhvyobj.vcdn.cloud/media/wysiwyg/2026/042026/350x495_54_.jpg' },
];

const BACKEND_URL = "http://localhost:8080/api/v1";

export default function Home() {
  const navigate = useNavigate();
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [movieTab, setMovieTab] = useState<"now_showing" | "coming_soon">("now_showing");
  const [banners, setBanners] = useState<Banner[]>([]);
  const [currentBanner, setCurrentBanner] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState("");
  
  // State mới cho Pop-up quảng cáo
  const [showPromoModal, setShowPromoModal] = useState(false);

  const sliderRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLDivElement>(null);
  const promoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [moviesRes, bannersRes] = await Promise.all([
          movieApi.getAll({ status: movieTab }),
          bannerApi.getActive(),
        ]);

        const movieData = Array.isArray(moviesRes) ? moviesRes : (moviesRes as any)?.data;
        setMovies(Array.isArray(movieData) ? movieData : []);

        const bannerData = Array.isArray(bannersRes) ? bannersRes : (bannersRes as any)?.data;
        setBanners(Array.isArray(bannerData) ? bannerData.slice(0, 5) : []);
      } catch (err) {
        console.error("Lỗi lấy dữ liệu:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [movieTab]);

  
  useEffect(() => {
  // Mỗi khi Linh load lại trang hoặc chuyển từ trang khác về Home, 
  // pop-up sẽ hiện sau một khoảng trễ ngắn để tạo cảm giác mượt mà.
  const timer = setTimeout(() => {
    setShowPromoModal(true);
  }, 800); // 0.8 giây sau khi load trang sẽ hiện

  return () => clearTimeout(timer);
}, []);

  useEffect(() => {
    if (banners.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentBanner((prev) => (prev === banners.length - 1 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(timer);
  }, [banners.length]);

  const scrollHorizontally = (ref: React.RefObject<HTMLDivElement | null>, direction: "left" | "right") => {
    if (ref.current) {
      const scrollAmount = direction === "left" ? -400 : 400;
      ref.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  const handleOpenTrailer = (url: string) => {
    setSelectedVideo(url);
    setIsModalOpen(true);
  };

  return (
    <>
      {/* --- PROMOTION POP-UP MODAL --- */}
<AnimatePresence>
  {showPromoModal && (
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        exit={{ opacity: 0 }}
        onClick={() => setShowPromoModal(false)}
        className="absolute inset-0 bg-black/85 backdrop-blur-md"
      />
      
      <motion.div 
        initial={{ scale: 0.5, opacity: 0 }} 
        animate={{ scale: 1, opacity: 1 }} 
        exit={{ scale: 0.5, opacity: 0 }}
        className="relative z-10 max-w-[90vw] md:max-w-md w-full"
      >
        <button 
          onClick={() => setShowPromoModal(false)}
          className="absolute -top-4 -right-4 bg-white text-black p-1 rounded-full shadow-2xl hover:bg-zinc-200 transition-colors z-20"
        >
          <X size={24} />
        </button>

        {/* Bọc ảnh bằng onClick để dẫn sang trang chi tiết */}
        <div 
          className="rounded-2xl overflow-hidden border border-white/10 shadow-2xl cursor-pointer group relative"
          onClick={() => {
            setShowPromoModal(false); // Đóng modal trước
            navigate(`/movie/28`);    // Điều hướng sang chi tiết phim ID 5
          }}
        >
          <img 
            src="https://iguov8nhvyobj.vcdn.cloud/media/wysiwyg/2026/052026/Popup_Banner.png" 
            alt="Doraemon Movie 2026 Promo" 
            className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-105"
          />
          {/* Thêm hiệu ứng hover nhẹ để người dùng biết là click được */}
          <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-all" />
        </div>
      </motion.div>
    </div>
  )}
</AnimatePresence>

      <div className="bg-black min-h-screen text-white pb-20 overflow-x-hidden">
        <div className="pt-20 bg-black"></div>

      {/* --- BANNER SECTION --- */}
<section className="relative w-full min-h-[50vh] md:min-h-[70vh] bg-[#000] overflow-hidden border-b border-zinc-800">
  {banners.length > 0 ? (
    banners.map((banner, index) => (
      <div
        key={banner.id}
        className={`absolute inset-0 transition-all duration-700 ease-in-out ${
          index === currentBanner ? "opacity-100 z-10" : "opacity-0 z-0"
        }`}
      >
        {/* Background blur lớn hơn */}
        <div
          className="absolute inset-0 bg-cover bg-center blur-3xl scale-110"
          style={{
            backgroundImage: `url(${banner.image_url.startsWith("http") ? banner.image_url : `${BACKEND_URL}${banner.image_url}`})`,
          }}
        />
        {/* Ảnh chính */}
        <img
          src={banner.image_url.startsWith("http") ? banner.image_url : `${BACKEND_URL}${banner.image_url}`}
          alt={banner.title || "Cinema Banner"}
          className="relative w-full h-full object-contain z-10"
        />
        {/* Gradient overlay */}
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black via-black/60 to-transparent z-20" />
      </div>
    ))
  ) : (
    <div className="w-full h-full bg-zinc-900 animate-pulse" />
  )}

  {/* Dots điều hướng */}
  <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-40 flex gap-3">
    {banners.map((_, idx) => (
      <button
        key={idx}
        onClick={() => setCurrentBanner(idx)}
        className={`transition-all duration-300 rounded-full ${
          idx === currentBanner ? "bg-red-600 w-12 h-1" : "bg-white/30 w-3 h-1 hover:bg-white/50"
        }`}
      />
    ))}
  </div>
</section>

        {/* --- MOVIE LIST SECTION --- */}
        <section className="mx-auto max-w-7xl px-6 pt-20">
          <div className="mb-10 flex items-center justify-between border-b border-zinc-800">
            <div className="flex gap-10">
              {["now_showing", "coming_soon"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setMovieTab(tab as any)}
                  className={`pb-4 text-2xl font-black uppercase transition-all relative ${
                    movieTab === tab ? "text-red-600" : "text-zinc-500 hover:text-zinc-300"
                  }`}
                >
                  {tab === "now_showing" ? "Phim đang chiếu" : "Phim sắp chiếu"}
                  {movieTab === tab && (
                    <div className="absolute bottom-0 left-0 w-full h-1 bg-red-600 shadow-[0_0_15px_rgba(220,38,38,0.8)]" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="flex h-96 items-center justify-center">
              <Loader2 className="animate-spin text-red-600" size={60} />
            </div>
          ) : (
            <div className="relative group/slider">
              <div
                ref={sliderRef}
                className="flex gap-6 overflow-x-auto scroll-smooth no-scrollbar snap-x snap-mandatory pb-10"
              >
                {movies.map((movie) => (
                  <div key={movie.id} className="min-w-70 md:min-w-80 snap-start group cursor-pointer">
                    <div className="relative aspect-2/3 overflow-hidden rounded-2xl shadow-2xl bg-zinc-900 border border-zinc-800">
                      <img
                        src={movie.poster_url || ""}
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                        alt={movie.title}
                      />
                      <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-black/80 opacity-0 transition-all duration-300 group-hover:opacity-100 backdrop-blur-[2px]">
                        <Link to={`/movie/${movie.id}`} className="w-3/4 py-3 rounded-xl bg-white text-black font-black text-center hover:bg-zinc-200">CHI TIẾT</Link>
                        <button onClick={() => navigate(`/showtimes/movie/${movie.id}`)} className="w-3/4 py-3 rounded-xl bg-red-600 text-white font-black text-center hover:bg-red-700">MUA VÉ</button>
                      </div>
                    </div>
                    <div className="mt-5 text-center">
                      <h3 className="line-clamp-1 font-black text-xl uppercase tracking-tighter group-hover:text-red-600">
                        {movie.title}
                      </h3>
                      <div className="flex items-center justify-center gap-3 mt-2">
                        <div className="flex items-center gap-1.5 text-yellow-500 font-bold bg-yellow-500/10 px-2 py-1 rounded">
                          <Star size={16} fill="currentColor" />
                          {movie.avg_score || "8.0"}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <button onClick={() => scrollHorizontally(sliderRef, "left")} className="absolute -left-6 top-[40%] bg-red-600 p-4 rounded-full opacity-0 group-hover/slider:opacity-100 transition-all z-30 hidden lg:block"><ChevronLeft size={30} /></button>
              <button onClick={() => scrollHorizontally(sliderRef, "right")} className="absolute -right-6 top-[40%] bg-red-600 p-4 rounded-full opacity-0 group-hover/slider:opacity-100 transition-all z-30 hidden lg:block"><ChevronRight size={30} /></button>
            </div>
          )}
        </section>

        {/* --- NEW: ƯU ĐÃI MỚI NHẤT (Kéo ngang chuyên nghiệp) --- */}
        <section className="mx-auto max-w-7xl px-6 pt-16">
          <div className="flex items-center gap-3 mb-8">
            <Gift className="text-red-600" size={32} />
            <h2 className="text-3xl font-black uppercase">EVENT</h2>
          </div>
          <div className="relative group/promo">
            <div ref={promoRef} className="flex gap-6 overflow-x-auto scroll-smooth no-scrollbar pb-6">
              {PROMOTIONS.map((promo) => (
                <div key={promo.id} className="min-w-[300px] md:min-w-[450px] aspect-[21/9] relative rounded-2xl overflow-hidden border border-white/10 group/item cursor-pointer">
                  <img src={promo.image} className="w-full h-full object-cover transition-transform duration-500 group-hover/item:scale-105" alt={promo.title} />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  <div className="absolute bottom-4 left-6">
                    <p className="font-black text-xl text-white uppercase tracking-tighter">{promo.title}</p>
                  </div>
                </div>
              ))}
            </div>
            <button onClick={() => scrollHorizontally(promoRef, "left")} className="absolute -left-4 top-1/2 -translate-y-1/2 bg-white/10 backdrop-blur-md p-3 rounded-full hover:bg-red-600 transition-all z-20"><ChevronLeft /></button>
            <button onClick={() => scrollHorizontally(promoRef, "right")} className="absolute -right-4 top-1/2 -translate-y-1/2 bg-white/10 backdrop-blur-md p-3 rounded-full hover:bg-red-600 transition-all z-20"><ChevronRight /></button>
          </div>
        </section>

        {/* --- TRAILER VIDEO SECTION --- */}
        <section className="mx-auto max-w-7xl px-6 pt-20 pb-10">
          <h2 className="text-3xl font-black uppercase mb-8 flex items-center gap-3 text-white">
            <Play fill="currentColor" className="text-red-600" />
            Trailer Phim Mới
          </h2>
          <div className="relative group/video">
            <div ref={videoRef} className="flex gap-6 overflow-x-auto scroll-smooth no-scrollbar pb-6">
              {TRAILERS.map((video) => (
                <div key={video.id} onClick={() => handleOpenTrailer(video.videoUrl)} className="min-w-75 md:min-w-100 aspect-video relative rounded-2xl overflow-hidden border border-white/10 group/item cursor-pointer">
                  <img src={video.thumbnail} className="w-full h-full object-cover transition-transform duration-500 group-hover/item:scale-105" alt={video.title} />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center group-hover/item:bg-black/20 transition-all">
                    <div className="w-14 h-14 bg-red-600 rounded-full flex items-center justify-center shadow-2xl transform group-hover/item:scale-125 transition-transform">
                      <Play fill="white" size={24} />
                    </div>
                  </div>
                  <div className="absolute bottom-0 left-0 w-full p-4 bg-gradient-to-t from-black to-transparent">
                    <p className="font-bold text-lg text-white line-clamp-1">{video.title}</p>
                  </div>
                </div>
              ))}
            </div>
            <button onClick={() => scrollHorizontally(videoRef, "left")} className="absolute -left-4 top-1/2 -translate-y-1/2 bg-white/10 backdrop-blur-md p-3 rounded-full hover:bg-red-600 transition-all z-20"><ChevronLeft /></button>
            <button onClick={() => scrollHorizontally(videoRef, "right")} className="absolute -right-4 top-1/2 -translate-y-1/2 bg-white/10 backdrop-blur-md p-3 rounded-full hover:bg-red-600 transition-all z-20"><ChevronRight /></button>
          </div>
        </section>
        <AIChatBot />
      </div>

      <MovieTrailerModal isOpen={isModalOpen} videoUrl={selectedVideo} onClose={() => setIsModalOpen(false)} />
    </>
  );
}