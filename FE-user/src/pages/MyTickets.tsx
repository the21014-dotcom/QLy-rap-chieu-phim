import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { QRCodeCanvas } from 'qrcode.react'; 
import AIChatBot from '../components/AIChatBot';

interface Booking {
  id: string;
  status: string;
  amount: number;
  movie: { title: string; posterUrl: string };
  showtime: { cinemaName: string; roomName: string; time: string; date: string };
  tickets: { seatName: string }[];
}

const MyTickets = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);

  useEffect(() => {
    // Gọi API lấy danh sách booking của User hiện tại
    const fetchBookings = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/v1/payments/my-tickets', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        setBookings(response.data);
      } catch (error) {
        console.error("Lỗi lấy lịch sử vé", error);
      }
    };
    fetchBookings();
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-4 pb-20">
      <h1 className="text-2xl font-bold mb-6 italic uppercase tracking-tighter">Vé của tôi</h1>
      
      <div className="space-y-6">
        {bookings.map((booking) => (
          <div key={booking.id} className="bg-white border-2 border-zinc-100 rounded-2xl overflow-hidden shadow-sm flex flex-col md:flex-row">
            {/* Poster Phim */}
            <div className="w-full md:w-40 bg-zinc-200">
               <img src={booking.movie.posterUrl} alt="poster" className="w-full h-full object-cover" />
            </div>

            {/* Thông tin vé */}
            <div className="p-5 flex-1 flex flex-col justify-between">
              <div className="flex flex-col md:flex-row justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h2 className="text-xl font-black uppercase italic leading-none">{booking.movie.title}</h2>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      booking.status === 'SUCCESS' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
                    }`}>
                      {booking.status === 'SUCCESS' ? 'ĐÃ XÁC NHẬN' : 'THẤT BẠI'}
                    </span>
                  </div>
                  <p className="text-sm text-zinc-500 font-medium">Rạp: {booking.showtime.cinemaName} | Phòng: {booking.showtime.roomName}</p>
                  <p className="text-sm text-zinc-500">Suất: <span className="text-black font-bold">{booking.showtime.time} - {booking.showtime.date}</span></p>
                  <p className="text-sm text-zinc-500">Ghế: <span className="text-primary font-bold">{booking.tickets.map(t => t.seatName).join(', ')}</span></p>
                </div>

                {/* 2. Sử dụng QRCodeCanvas để hết lỗi unused-vars */}
                {booking.status === 'SUCCESS' && (
                  <div className="bg-white p-2 border rounded-lg self-center md:self-start">
                    <QRCodeCanvas value={`TICKET-${booking.id}`} size={80} />
                  </div>
                )}
              </div>

              <div className="mt-4 flex justify-between items-end border-t border-dashed pt-4">
                <div>
                   <p className="text-[10px] text-zinc-400 uppercase font-bold">Tổng thanh toán</p>
                   <span className="text-xl font-black text-primary italic">{(booking.amount).toLocaleString()} VND</span>
                </div>
                
                {booking.status === 'SUCCESS' ? (
                   <button className="bg-black text-white text-xs px-6 py-2.5 rounded-full font-bold hover:bg-zinc-800 transition">
                      CHI TIẾT VÉ
                   </button>
                ) : (
                   <button className="border-2 border-primary text-primary text-xs px-6 py-2.5 rounded-full font-bold hover:bg-primary hover:text-white transition">
                      THỬ LẠI
                   </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
      <AIChatBot />
    </div>
  );
};

export default MyTickets;