import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axiosClient';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { message, Skeleton } from 'antd';
import { formatTime, formatDateWithDay } from '../utils/format';

/* eslint-disable @typescript-eslint/no-explicit-any */
// ========================
// TYPES & INTERFACES
// ========================
type MovieRating = 'P' | 'C13' | 'C16' | 'C18';

interface ShowtimeSlot {
  id: number;
  start_time: string;
  end_time: string;
  availableSeats: number;
}

interface FormatGroup {
  label: string;
  showtimes: ShowtimeSlot[];
}

// Cấu hình URL Backend tập trung
const BASE_API_URL = 'http://localhost:8080/api/v1';

// ========================
// SHARED UI COMPONENTS
// ========================

const RatingBadge: React.FC<{ rating: MovieRating }> = React.memo(({ rating }) => {
  const styles: Record<MovieRating, string> = {
    P: 'bg-green-600',
    C13: 'bg-yellow-500',
    C16: 'bg-orange-500',
    C18: 'bg-red-600',
  };
  return (
    <span className={`${styles[rating] || 'bg-zinc-500'} text-white flex items-center justify-center w-9 h-9 rounded-md text-xs font-black shadow-sm shrink-0`}>
      {rating === 'P' ? 'P' : rating?.replace('C', '') || 'N/A'}
    </span>
  );
});

const ShowtimeButton: React.FC<{ slot: ShowtimeSlot; onClick: (id: number) => void }> = React.memo(({ slot, onClick }) => {
  const startTime = new Date(slot.start_time);
  const isPast = new Date() > startTime;
  const isSoldOut = slot.availableSeats === 0;

  return (
    <button
      disabled={isPast || isSoldOut}
      onClick={() => onClick(slot.id)}
      className={`relative border rounded-lg py-3 px-6 transition-all duration-200 min-w-[110px] text-center group
        ${isPast || isSoldOut 
          ? 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed' 
          : 'border-gray-300 text-gray-800 hover:border-red-600 hover:text-red-600 hover:shadow-lg active:scale-95'
        }`}
    >
      <span className="block text-base font-black tracking-tight">{formatTime(slot.start_time)}</span>
      <span className="block text-[10px] font-bold opacity-60 mt-1">{slot.availableSeats} ghế trống</span>
    </button>
  );
});

const FormatRow: React.FC<{ group: FormatGroup; onSelect: (id: number) => void }> = React.memo(({ group, onSelect }) => (
  <div className="mb-8 last:mb-0">
    <div className="flex items-center gap-2 mb-4">
      <span className="text-[11px] font-black text-white bg-zinc-800 px-3 py-1 rounded uppercase tracking-widest">
        {group.label}
      </span>
      <div className="h-[1px] flex-1 bg-gray-100"></div>
    </div>
    <div className="flex flex-wrap gap-4">
      {group.showtimes.map(slot => (
        <ShowtimeButton key={slot.id} slot={slot} onClick={onSelect} />
      ))}
    </div>
  </div>
));

const DatePicker: React.FC<{ selectedDate: string; onSelect: (date: string) => void }> = React.memo(({ selectedDate, onSelect }) => {
  const dates = useMemo(() => 
    Array.from({ length: 14 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() + i);
      return {
        dateStr: format(date, 'yyyy-MM-dd'),
        dayNumber: format(date, 'dd'),
        dayName: format(date, 'EEE', { locale: vi }),
        isWeekend: date.getDay() === 0 || date.getDay() === 6
      };
    }), []);

  return (
    <div className="bg-[#fdfcf0] border-b border-gray-200 overflow-x-auto no-scrollbar py-6 sticky top-[72px] z-40 shadow-sm">
      <div className="flex px-4 max-w-5xl mx-auto gap-8 min-w-max">
        {dates.map((d) => (
          <button
            key={d.dateStr}
            onClick={() => onSelect(d.dateStr)}
            className={`flex flex-col items-center transition-all transform px-2 ${
              selectedDate === d.dateStr ? 'text-red-600 scale-110' : 'text-gray-400 hover:text-zinc-800'
            }`}
          >
            <span className="text-[10px] uppercase font-black mb-1">{d.dayName}</span>
            <span className={`text-2xl font-black ${d.isWeekend && selectedDate !== d.dateStr ? 'text-red-400' : ''}`}>
              {d.dayNumber}
            </span>
            {selectedDate === d.dateStr && <div className="w-6 h-1 bg-red-600 mt-1 rounded-full shadow-lg animate-pulse" />}
          </button>
        ))}
      </div>
    </div>
  );
});

// ========================
// VIEW LOGIC
// ========================

const ByMovieView: React.FC<{ movieId: string; selectedDate: string; selectedCity: string; onSelect: (id: number) => void }> = ({ movieId, selectedDate, selectedCity, onSelect }) => {
  const [cinemas, setCinemas] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        // Sử dụng URL tuyệt đối để tránh gọi nhầm sang cổng 5173 của React
        const res: any = await api.get(`${BASE_API_URL}/showtimes/movie/${movieId}`, {
          params: { date: selectedDate, city: selectedCity }
        });
        
        // Kiểm tra cấu hình bóc tách dữ liệu của Interceptor
        const finalData = res?.data?.data || (Array.isArray(res?.data) ? res.data : []);
        setCinemas(finalData);
      } catch (error) {
        console.error("Lỗi API Movie:", error);
        message.error("Lỗi tải lịch chiếu theo phim");
      } finally { setLoading(false); }
    };
    fetch();
  }, [movieId, selectedDate, selectedCity]);

  if (loading) return <div className="p-10"><Skeleton active avatar paragraph={{ rows: 4 }} /></div>;
  if (cinemas.length === 0) return (
    <div className="p-20 text-center opacity-50">
      <div className="text-5xl mb-4">🎥</div>
      <p className="font-black uppercase tracking-widest text-xs">Không có suất chiếu tại khu vực này</p>
    </div>
  );

  return (
    <div className="divide-y divide-gray-100">
      {cinemas.map(cinema => (
        <div key={cinema.id} className="p-8 hover:bg-gray-50/50 transition-colors">
          <div className="mb-6">
            <h3 className="font-black text-xl text-zinc-900 uppercase tracking-tighter">
              <span className="text-red-600">CGV</span> {cinema.name?.replace(/CGV/i, '')}
            </h3>
            <p className="text-[11px] text-gray-400 font-bold uppercase mt-1 italic">{cinema.address}</p>
          </div>
          {cinema.formats?.map((group: any, idx: number) => (
            <FormatRow key={idx} group={group} onSelect={onSelect} />
          ))}
        </div>
      ))}
    </div>
  );
};

const ByCinemaView: React.FC<{ cinemaId: string; selectedDate: string; onSelect: (id: number) => void }> = ({ cinemaId, selectedDate, onSelect }) => {
  const [movies, setMovies] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const res: any = await api.get(`${BASE_API_URL}/showtimes/cinema/${cinemaId}`, {
          params: { date: selectedDate } 
        });
        const finalData = res?.data?.data || (Array.isArray(res?.data) ? res.data : []);
        setMovies(finalData);
      } catch (error) {
        console.error("Lỗi API Cinema:", error);
        message.error("Lỗi tải danh sách phim tại rạp");
      } finally { setLoading(false); }
    };
    fetch();
  }, [cinemaId, selectedDate]);

  if (loading) return <div className="p-10"><Skeleton active /></div>;
  if (movies.length === 0) return (
    <div className="p-20 text-center opacity-50">
      <div className="text-5xl mb-4">🎟️</div>
      <p className="font-black uppercase tracking-widest text-xs">Rạp hiện chưa có lịch cho ngày này</p>
    </div>
  );

  return (
    <div className="flex flex-col">
      {movies.map(movie => (
        <div key={movie.id} className="bg-white p-8 flex flex-col md:flex-row gap-10 border-b border-gray-100 last:border-0">
          <div className="md:w-44 shrink-0">
            <img 
              src={movie.poster_url || 'https://via.placeholder.com/200x300'} 
              alt={movie.title} 
              className="w-full rounded-xl shadow-xl aspect-[2/3] object-cover border border-gray-100 transform hover:rotate-1 transition-transform" 
            />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-4">
               <RatingBadge rating={movie.rating} />
               <h3 className="font-black text-2xl uppercase tracking-tighter text-zinc-900">{movie.title}</h3>
            </div>
            <div className="flex gap-4 text-[11px] font-black text-gray-400 mb-8 tracking-widest uppercase">
               <span>{movie.duration} PHÚT</span>
               <span className="text-red-600">● {movie.formats?.[0]?.label || '2D'}</span>
            </div>
            <div className="space-y-8">
              {movie.formats?.map((group: any, idx: number) => (
                <FormatRow key={idx} group={group} onSelect={onSelect} />
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

// ========================
// MAIN COMPONENT
// ========================

const Showtimes: React.FC = () => {
  const { movieId, cinemaId } = useParams();
  const navigate = useNavigate();
  
  // State mặc định
  const [selectedCity, setSelectedCity] = useState('Hải Phòng');
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [headerInfo, setHeaderInfo] = useState({ title: 'Lịch chiếu', sub: '' });

  const viewMode = cinemaId ? 'by-cinema' : 'by-movie';

  useEffect(() => {
    const fetchHeader = async () => {
      try {
        const endpoint = viewMode === 'by-movie' 
          ? `${BASE_API_URL}/movies/${movieId}` 
          : `${BASE_API_URL}/cinemas/${cinemaId}`;
        
        const res: any = await api.get(endpoint);
        const data = res.data || res;
        
        setHeaderInfo({
          title: data?.title || data?.name || 'Lịch chiếu',
          sub: data?.address || (viewMode === 'by-movie' ? 'Thông tin suất chiếu' : '')
        });
      } catch (e) {
        console.error("Lỗi fetch header:", e);
      }
    };
    if (movieId || cinemaId) fetchHeader();
  }, [movieId, cinemaId, viewMode]);

  const handleSelectSlot = useCallback((id: number) => {
    navigate(`/seat-selection/${id}`);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-[#f4f4f4] pb-32">
      {/* Header Sticky */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 h-[72px] flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate(-1)} 
              title="quay lại"
              className="p-2 hover:bg-gray-100 rounded-full transition-all active:scale-90"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <div>
              <h1 className="font-black text-xl uppercase tracking-tighter text-zinc-900 leading-tight">
                {headerInfo.title}
              </h1>
              <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">
                 {formatDateWithDay(selectedDate)}
              </p>
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-2">
             <span className="text-red-600 font-black italic text-2xl tracking-tighter">CGV</span>
             <span className="text-zinc-800 font-black text-2xl tracking-tighter">CINEMAS</span>
          </div>
        </div>
      </header>

      <DatePicker selectedDate={selectedDate} onSelect={setSelectedDate} />

      <main className="max-w-5xl mx-auto px-4 mt-8">
        {/* City Filter (Chỉ hiện khi xem theo phim) */}
        {viewMode === 'by-movie' && (
          <div className="flex gap-2 overflow-x-auto no-scrollbar mb-8 pb-2">
            {['Hồ Chí Minh', 'Hà Nội', 'Đà Nẵng', 'Hải Phòng', 'Cần Thơ'].map(city => (
              <button
                key={city}
                onClick={() => setSelectedCity(city)}
                className={`px-8 py-2.5 rounded-full text-[11px] font-black uppercase tracking-widest border transition-all whitespace-nowrap
                  ${selectedCity === city 
                    ? 'bg-red-600 border-red-600 text-white shadow-xl shadow-red-100 scale-105' 
                    : 'bg-white border-gray-200 text-gray-500 hover:border-zinc-400'
                  }`}
              >
                {city}
              </button>
            ))}
          </div>
        )}

        <div className="bg-white shadow-2xl rounded-2xl overflow-hidden border border-gray-200">
          <div className="bg-zinc-900 text-white px-8 py-4 text-[9px] font-black flex justify-between items-center tracking-[0.2em] uppercase">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-red-600 rounded-full animate-pulse"></span>
              <span>Lưu ý: Vé đã mua không thể đổi trả</span>
            </div>
            <span className="text-red-500 hidden sm:block">CGV Cinemas Vietnam</span>
          </div>

          <div className="min-h-[400px]">
            {viewMode === 'by-movie' && movieId ? (
              <ByMovieView 
                movieId={movieId} 
                selectedDate={selectedDate} 
                selectedCity={selectedCity} 
                onSelect={handleSelectSlot} 
              />
            ) : (
              cinemaId && (
                <ByCinemaView 
                  cinemaId={cinemaId} 
                  selectedDate={selectedDate} 
                  onSelect={handleSelectSlot} 
                />
              )
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Showtimes;