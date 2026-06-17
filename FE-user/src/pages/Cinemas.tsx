import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { MapPin, Clock, Monitor, Play, Calendar, Users, Film, DoorOpen } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';
import { formatTime } from '../utils/format';
import AIChatBot from '../components/AIChatBot';

// --- Interfaces ---
interface Cinema {
  id: number;
  name: string;
  address: string;
  city?: string;
}

interface ShowtimeSlot {
  id: number;
  start_time: string;
  roomName: string;
  availableSeats: number;
}

interface FormatGroup {
  label: string;
  roomType: string;
  isGoldClass: boolean;
  showtimes: ShowtimeSlot[];
}

interface MovieShowtime {
  id: number;
  title: string;
  rating: string;
  duration: number;
  poster_url: string;
  formats: FormatGroup[];
}

const BACKEND_URL = 'http://localhost:8080/api/v1';

// Helper loại phòng
const getRoomTypeLabel = (roomType: string) => {
  const labels: Record<string, string> = {
    'STANDARD_2D': '2D',
    'PREMIUM_3D': '3D',
    'IMAX': 'IMAX',
    'GOLD_CLASS': 'GOLD CLASS',
  };
  return labels[roomType] || '2D';
};

const getRoomTypeColor = (roomType: string) => {
  const colors: Record<string, string> = {
    'STANDARD_2D': 'bg-blue-100 text-blue-700 border-blue-300',
    'PREMIUM_3D': 'bg-purple-100 text-purple-700 border-purple-300',
    'IMAX': 'bg-orange-100 text-orange-700 border-orange-300',
    'GOLD_CLASS': 'bg-yellow-100 text-yellow-700 border-yellow-400',
  };
  return colors[roomType] || 'bg-gray-100 text-gray-700 border-gray-300';
};

const CinemasPage: React.FC = () => {
  const navigate = useNavigate();
  const [cinemas, setCinemas] = useState<Cinema[]>([]);
  const [selectedCinema, setSelectedCinema] = useState<Cinema | null>(null);
  const [movieSchedules, setMovieSchedules] = useState<MovieShowtime[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>(moment().format('YYYY-MM-DD'));
  const [loading, setLoading] = useState(true);
  const [fetchingSchedule, setFetchingSchedule] = useState(false);

  const dates = Array.from({ length: 10 }, (_, i) => moment().add(i, 'days'));

  useEffect(() => {
    const fetchCinemas = async () => {
      try {
        const res = await axios.get(`${BACKEND_URL}/cinemas`);
        const data = res.data.data;
        setCinemas(data);
        if (data.length > 0) setSelectedCinema(data[0]);
      } catch (err) {
        console.error("Lỗi lấy rạp", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCinemas();
  }, []);

  const fetchSchedules = useCallback(async () => {
    if (!selectedCinema) return;
    setFetchingSchedule(true);
    try {
      const res = await axios.get(`${BACKEND_URL}/showtimes/cinema/${selectedCinema.id}`, {
        params: { date: selectedDate }
      });
      const data = res.data.data || [];
      
      const now = new Date();
      const filteredData = data.map((movie: MovieShowtime) => ({
        ...movie,
        formats: movie.formats.map((format: FormatGroup) => ({
          ...format,
          showtimes: format.showtimes.filter((slot: ShowtimeSlot) => 
            new Date(slot.start_time) > now
          ),
        })).filter((format: FormatGroup) => format.showtimes.length > 0),
      })).filter((movie: MovieShowtime) => movie.formats.length > 0);
      
      setMovieSchedules(filteredData);
    } catch (err) {
      console.error("Lỗi lịch chiếu", err);
      setMovieSchedules([]);
    } finally {
      setFetchingSchedule(false);
    }
  }, [selectedCinema, selectedDate]);

  useEffect(() => {
    fetchSchedules();
  }, [fetchSchedules]);

  const formatDay = (date: moment.Moment) => {
    const days = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
    return days[date.day()];
  };

  if (loading) return (
    <div className="h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="text-center">
        <Film className="w-16 h-16 text-red-500 mx-auto mb-4 animate-pulse" />
        <div className="animate-bounce font-black text-4xl text-red-600 tracking-widest">CGV</div>
        <div className="text-red-400 text-sm mt-2 tracking-[0.5em]">MOVIE THEATER</div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-100 pt-24 pb-20 font-sans">
      <div className="max-w-7xl mx-auto px-4">
        
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3">
            <Film className="w-10 h-10 text-red-600" />
            <h1 className="text-5xl font-black uppercase italic tracking-widest text-gray-800">
              Lịch <span className="text-red-600">Chiếu</span>
            </h1>
          </div>
          <div className="flex justify-center items-center mt-4 gap-4">
            <div className="h-[2px] w-20 bg-red-500"></div>
            <span className="text-red-500 text-2xl">★ ★ ★</span>
            <div className="h-[2px] w-20 bg-red-500"></div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* SIDEBAR: Rạp */}
          <div className="lg:w-1/4">
            <div className="bg-gradient-to-r from-red-600 to-red-500 text-white p-5 font-bold uppercase rounded-t-2xl flex items-center gap-3 shadow-lg">
              <MapPin size={20} /> Chọn rạp
            </div>
            <div className="bg-white rounded-b-2xl shadow-xl max-h-[65vh] overflow-y-auto border border-gray-100">
              {cinemas.map((cinema) => (
                <div
                  key={cinema.id}
                  onClick={() => setSelectedCinema(cinema)}
                  className={`p-5 cursor-pointer border-b border-gray-100 transition-all hover:bg-gray-50 hover:pl-6 ${
                    selectedCinema?.id === cinema.id ? "bg-red-50 border-l-4 border-l-red-500 pl-6" : ""
                  }`}
                >
                  <h3 className={`font-bold uppercase text-sm ${selectedCinema?.id === cinema.id ? "text-red-600" : "text-gray-800"}`}>
                    {cinema.name}
                  </h3>
                  <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                    <span className="w-2 h-2 bg-gray-300 rounded-full"></span>
                    {cinema.city}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* MAIN: Lịch chiếu */}
          <div className="lg:w-3/4 space-y-6">
            {selectedCinema && (
              <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100">
                
                {/* Cinema Header & Date Picker */}
                <div className="p-8 border-b bg-gradient-to-r from-white to-gray-50">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 bg-red-600 rounded-xl flex items-center justify-center shadow-lg shadow-red-200">
                      <Play className="text-white" size={24} />
                    </div>
                    <div>
                      <h2 className="text-3xl font-black text-gray-800 uppercase tracking-wide">{selectedCinema.name}</h2>
                      <p className="text-gray-500 text-sm flex items-center gap-2 mt-1">
                        <MapPin size={14} /> {selectedCinema.city}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex gap-3 overflow-x-auto pb-2">
                    {dates.map((date, i) => {
                      const isSelected = selectedDate === date.format('YYYY-MM-DD');
                      const isToday = date.isSame(moment(), 'day');
                      const isPast = date.isBefore(moment(), 'day');
                      
                      return (
                        <button
                          key={i}
                          onClick={() => setSelectedDate(date.format('YYYY-MM-DD'))}
                          disabled={isPast}
                          className={`flex flex-col items-center min-w-[75px] py-4 px-5 rounded-2xl transition-all border-2 ${
                            isSelected 
                              ? "bg-red-600 border-red-600 text-white shadow-lg shadow-red-200 scale-105" 
                              : isPast
                                ? "bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed opacity-50"
                                : "bg-white border-gray-200 text-gray-600 hover:border-red-400 hover:text-red-600 hover:bg-red-50"
                          }`}
                        >
                          <span className="text-[11px] font-bold uppercase">{formatDay(date)}</span>
                          <span className="text-2xl font-black leading-none mt-1">{date.format('DD')}</span>
                          <span className="text-[11px] font-medium">{date.format('MMM')}</span>
                          {isToday && <span className="text-[9px] mt-2 bg-red-600 text-white px-2 py-0.5 rounded font-bold">TODAY</span>}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Movie List */}
                <div className="p-8">
                  {fetchingSchedule ? (
                    <div className="py-24 text-center">
                      <div className="animate-spin w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full mx-auto mb-6"></div>
                      <p className="text-gray-400 text-lg">Đang cập nhật suất chiếu...</p>
                    </div>
                  ) : movieSchedules.length > 0 ? (
                    <div className="space-y-10">
                      {movieSchedules.map((movie) => (
                        <div key={movie.id} className="flex flex-col md:flex-row gap-8 pb-10 border-b border-gray-100 last:border-0">
                          
                          {/* Poster */}
                          <div className="w-full md:w-48 flex-shrink-0">
                            <div className="relative group overflow-hidden rounded-2xl shadow-lg">
                              <div className="aspect-[2/3] bg-gray-100">
                                <img 
                                  src={movie.poster_url || `https://api.dicebear.com/7.x/initials/svg?seed=${movie.title}&backgroundColor=f3f4f6`} 
                                  alt={movie.title}
                                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                />
                              </div>
                              <div className="absolute top-3 left-3 bg-red-600 text-white text-sm font-black px-3 py-1 rounded shadow-lg">
                                {movie.rating}
                              </div>
                            </div>
                          </div>

                          {/* Info */}
                          <div className="flex-1">
                            {/* TÊN PHIM - SIÊU TO & IN ĐẬM */}
                            <h3 className="text-4xl font-black text-gray-900 uppercase leading-tight tracking-tight">
                              {movie.title}
                            </h3>
                            
                            {/* Thời lượng & Độ tuổi */}
                            <div className="flex items-center gap-4 mt-3 mb-8">
                              <span className="flex items-center gap-2 text-gray-500 font-medium">
                                <Clock size={16} className="text-red-500" /> 
                                <span className="text-gray-800 font-bold text-lg">{movie.duration}</span> 
                                <span className="text-gray-400">phút</span>
                              </span>
                              <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                              <span className="px-3 py-1 bg-gray-100 text-gray-600 text-sm font-bold rounded uppercase tracking-wider border border-gray-200">
                                {movie.rating}
                              </span>
                            </div>

                            {/* Formats & Showtimes */}
                            <div className="space-y-6">
                              {movie.formats.map((format, idx) => (
                                <div key={idx}>
                                  {/* Format Label - NỔI BẬT */}
                                  <div className="flex items-center gap-3 mb-4">
                                    <Monitor size={18} className="text-red-500" />
                                    <h4 className="text-sm font-bold text-red-600 uppercase tracking-widest">
                                      {format.label}
                                    </h4>
                                    <span className={`text-xs font-bold px-3 py-1 rounded-lg border ${getRoomTypeColor(format.roomType)}`}>
                                      {getRoomTypeLabel(format.roomType)}
                                    </span>
                                    {format.isGoldClass && (
                                      <span className="bg-yellow-400 text-yellow-900 text-xs font-bold px-3 py-1 rounded-lg">★ PREMIUM</span>
                                    )}
                                  </div>
                                  
                                  {/* SUẤT CHIẾU - TO HƠN & NỔI BẬT */}
                                  <div className="flex flex-wrap gap-3">
                                    {format.showtimes.map((slot) => (
                                      <button
                                        key={slot.id}
                                        onClick={() => navigate(`/booking/${slot.id}`)}
                                        className="group flex flex-col items-center justify-center min-w-[85px] h-24 px-3 py-3 bg-gradient-to-br from-white to-gray-50 border-2 border-gray-200 rounded-xl hover:border-red-500 hover:bg-red-50 hover:shadow-xl transition-all hover:scale-105"
                                      >
                                        {/* GIỜ CHIẾU - SIÊU TO & MÀU ĐỎ */}
                                        <span className="text-2xl font-black text-red-600 group-hover:text-red-600">
                                          {formatTime(slot.start_time)}
                                        </span>
                                        
                                        {/* TÊN PHÒNG & GHẾ TRỐNG - NỔI BẬT */}
                                        <div className="flex items-center gap-2 mt-2 bg-gray-100 px-3 py-1.5 rounded-lg group-hover:bg-white">
                                          <DoorOpen size={12} className="text-gray-500 group-hover:text-red-500" />
                                          <span className="text-xs font-bold text-gray-700 group-hover:text-red-600">
                                            {slot.roomName}
                                          </span>
                                          <span className="text-gray-400">•</span>
                                          <Users size={12} className="text-red-500 group-hover:text-red-500" />
                                          <span className="text-xs font-bold text-red-500 group-hover:text-red-600">
                                            {slot.availableSeats}
                                          </span>
                                        </div>
                                      </button>
                                    ))}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="py-24 text-center">
                      <Calendar size={56} className="mx-auto text-gray-300 mb-6" />
                      <p className="text-gray-500 text-lg mb-2">Không có suất chiếu cho ngày này</p>
                      <p className="text-gray-400 text-sm mb-6">Vui lòng chọn ngày khác</p>
                      <button 
                        onClick={() => setSelectedDate(moment().format('YYYY-MM-DD'))}
                        className="mt-2 px-6 py-3 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 transition-colors shadow-lg shadow-red-200"
                      >
                        Xem lịch hôm nay
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <AIChatBot />
    </div>
  );
};

export default CinemasPage;