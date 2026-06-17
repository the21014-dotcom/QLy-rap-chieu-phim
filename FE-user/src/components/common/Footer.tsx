const Footer = () => {
  return (
    <footer className="bg-[#fdfcf0] text-[#333] border-t-[6px] border-[#e71a0f] font-sans">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          
          {/* CỘT 1: GIỚI THIỆU */}
          <div>
            <h3 className="text-sm font-black uppercase tracking-widest border-b border-zinc-800 pb-2 mb-6">
              CGV Việt Nam
            </h3>
            <ul className="space-y-3">
              {['Giới Thiệu', 'Tiện Ích Online', 'Thẻ Quà Tặng', 'Tuyển Dụng'].map((item) => (
                <li key={item} className="group flex items-center">
                  <span className="text-[#e71a0f] mr-2 opacity-0 group-hover:opacity-100 transition-all">▶</span>
                  <a href="#" className="text-[13px] text-zinc-600 hover:text-[#e71a0f] transition-colors">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* CỘT 2: ĐIỀU KHOẢN */}
          <div>
            <h3 className="text-sm font-black uppercase tracking-widest border-b border-zinc-800 pb-2 mb-6">
              Chính sách
            </h3>
            <ul className="space-y-3">
              {['Điều Khoản Chung', 'Chính Sách Thanh Toán', 'Chính Sách Bảo Mật', 'Hỏi Đáp'].map((item) => (
                <li key={item} className="group flex items-center">
                  <span className="text-[#e71a0f] mr-2 opacity-0 group-hover:opacity-100 transition-all">▶</span>
                  <a href="#" className="text-[13px] text-zinc-600 hover:text-[#e71a0f] transition-colors">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* CỘT 3: KẾT NỐI (Dùng chữ thay cho Icon) */}
          <div>
            <h3 className="text-sm font-black uppercase tracking-widest border-b border-zinc-800 pb-2 mb-6">
              Theo dõi chúng tôi
            </h3>
            <div className="flex gap-2 mb-8">
              <a href="#" className="w-9 h-9 bg-[#3b5998] text-white rounded flex items-center justify-center font-bold hover:scale-110 transition-transform">f</a>
              <a href="#" className="w-9 h-9 bg-[#ff0000] text-white rounded flex items-center justify-center font-bold hover:scale-110 transition-transform">Y</a>
              <a href="#" className="w-9 h-9 bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-600 text-white rounded flex items-center justify-center font-bold hover:scale-110 transition-transform">i</a>
              <a href="#" className="w-9 h-9 bg-[#000] text-white rounded flex items-center justify-center font-bold hover:scale-110 transition-transform">t</a>
            </div>
            <div className="opacity-70 hover:opacity-100 transition-opacity">
              <div className="border border-zinc-300 inline-block p-1 rounded">
                 <span className="text-[10px] font-bold text-blue-700">ĐÃ THÔNG BÁO</span>
                 <div className="text-[8px] leading-tight text-red-600 font-bold border-t border-zinc-200 mt-1">BỘ CÔNG THƯƠNG</div>
              </div>
            </div>
          </div>

          {/* CỘT 4: BOX CSKH (Dùng Emoji 📞) */}
          <div className="bg-[#222] text-white p-6 rounded-sm shadow-2xl relative">
            <div className="absolute top-0 right-0 w-2 h-full bg-[#e71a0f]"></div>
            <h3 className="text-[10px] uppercase text-zinc-400 mb-2 tracking-tighter">Customer Service</h3>
            <div className="text-2xl font-black mb-1 flex items-center gap-2">
               <span className="text-xl">📞</span> 1900 8386
            </div>
            <p className="text-[10px] text-zinc-400 italic mb-4 leading-tight">
              8:00 - 22:00 (Tất cả các ngày)
            </p>
            <div className="text-[11px] font-bold text-zinc-300 border-t border-zinc-700 pt-3">
               📧 hoidap@cgv.vn
            </div>
          </div>
        </div>
      </div>

      {/* FOOTER ĐẾ (THÔNG TIN CÔNG TY) */}
      <div className="bg-[#222] py-8 text-center md:text-left">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-white text-2xl font-black tracking-tighter">
            CGV <span className="text-[#e71a0f]">CINEMAS</span>
          </div>
          <div className="text-[11px] text-zinc-500 max-w-2xl">
            <p className="font-bold text-zinc-300 mb-1">CÔNG TY TNHH CGV CINEMAS VIỆT NAM</p>
            <p>📍 Số 1 Thanh Niên, TP. Hải Phòng, Việt Nam</p>
            <p>Giấy CNĐKDN: 0101234567, đăng ký lần đầu ngày 15/04/2026</p>
            <p className="mt-2 opacity-50 uppercase">Copyright © 2026 CGV Vietnam. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;