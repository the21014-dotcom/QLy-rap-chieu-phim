import React, { useState } from 'react';

// --- ĐỊNH NGHĨA KIỂU DỮ LIỆU (TYPES) ---
interface RewardTier {
  category: string;
  basic: string;
  vip: string;
  vvip: string;
  note: string;
}

type TabType = 'POINTS' | 'BIRTHDAY' | 'LEVELS' | 'ACCOUNT' | 'SUPPORT';

const rewardData: RewardTier[] = [
  { category: 'Tại Quầy Vé', basic: '5%', vip: '7%', vvip: '10%', note: '100.000 VND = 5/7/10 Điểm' },
  { category: 'Quầy Bắp Nước', basic: '3%', vip: '4%', vvip: '5%', note: '100.000 VND = 3/4/5 Điểm' },
];

// --- 1. CÁC SUB-COMPONENTS (Đưa ra ngoài để tránh lỗi "Cannot create components during render") ---

const PointsTab = () => (
  <>
    <h2 className="text-2xl font-bold uppercase mb-6 border-b-2 border-red-600 inline-block pb-1">Chương Trình Điểm Thưởng</h2>
    <p className="mb-6 leading-relaxed">
      Chương trình bao gồm 5 đối tượng thành viên <span className="font-bold">U22 | Thân thiết | Elite | CGV VIP và CGV VVIP</span>.
    </p>
    <div className="overflow-x-auto mb-8 border border-gray-300 rounded-lg">
      <table className="w-full text-sm text-left">
        <thead className="bg-[#eeeae3] font-bold">
          <tr>
            <th className="p-4 border-b border-r border-gray-300">Điểm thưởng</th>
            <th className="p-4 border-b border-r border-gray-300">U22 | Thân thiết | Elite</th>
            <th className="p-4 border-b border-r border-gray-300">VIP</th>
            <th className="p-4 border-b border-gray-300">VVIP</th>
          </tr>
        </thead>
        <tbody>
          {rewardData.map((item, idx) => (
            <React.Fragment key={idx}>
              <tr className="font-bold text-red-600">
                <td className="p-4 border-b border-r border-gray-300 text-black">{item.category}</td>
                <td className="p-4 border-b border-r border-gray-300">{item.basic}</td>
                <td className="p-4 border-b border-r border-gray-300">{item.vip}</td>
                <td className="p-4 border-b border-gray-300">{item.vvip}</td>
              </tr>
              <tr className="text-xs text-gray-500 italic bg-gray-50">
                <td colSpan={4} className="p-2 px-4 border-b border-gray-300">VD: {item.note}</td>
              </tr>
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
    <div className="bg-red-50 p-4 border-l-4 border-red-600 mb-6 font-medium">1 điểm = 1.000 VND. Tích lũy từ 0.5 đến 0.9 được làm tròn lên.</div>
  </>
);

const BirthdayTab = () => (
  <div className="space-y-6 text-[15px] leading-relaxed text-justify">
    <h2 className="text-2xl font-bold uppercase mb-2 border-b-2 border-red-600 inline-block pb-1">Quà Tặng Sinh Nhật</h2>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
      <div className="border p-4 rounded bg-gray-50 text-center">
        <p className="font-bold text-red-600">U22 & Thân Thiết & ELITE</p>
        <p>01 CGV Birthday Combo</p>
      </div>
      <div className="border p-4 rounded bg-gray-50 text-center">
        <p className="font-bold text-red-600">VIP</p>
        <p>01 Birthday Combo + 01 Vé 2D/3D</p>
      </div>
      <div className="border p-4 rounded bg-gray-50 text-center">
        <p className="font-bold text-red-600">VVIP</p>
        <p>01 Birthday Combo + 02 Vé 2D/3D</p>
      </div>
    </div>
    <p className="italic text-sm text-gray-600">(*) CGV Birthday Combo = 1 Bắp Ngọt size 44oz + 2 Nước size 22oz.</p>
    
    <div className="space-y-4">
      <h3 className="font-bold uppercase text-red-700">Điều kiện và Cách thức đổi quà:</h3>
      <ul className="list-disc pl-5 space-y-2 text-sm">
        <li>Vào sinh nhật lần thứ 23, thành viên U22 nhận thêm 01 vé xem phim 2D/3D.</li>
        <li>Phải có phát sinh giao dịch trong vòng 24 tháng gần nhất (không tính tháng sinh nhật 2 năm trước).</li>
        <li>Thành viên mới/không hoạt động 24 tháng: Phải phát sinh 01 giao dịch trong tháng sinh nhật để nhận quà ngay.</li>
        <li><strong>Xác thực chính chủ:</strong> Xuất trình CCCD/VNeID bản gốc và ứng dụng CGV để đối soát.</li>
        <li>Thời hạn: Coupon chỉ có giá trị sử dụng trong tháng sinh nhật.</li>
      </ul>
    </div>
  </div>
);

const LevelsTab = () => (
  <div className="space-y-4 text-[15px]">
    <h2 className="text-2xl font-bold uppercase mb-4 border-b-2 border-red-600 inline-block pb-1">Cấp Độ Thành Viên</h2>
    <div className="bg-gray-100 p-6 rounded-lg">
      <h4 className="font-bold text-red-600 mb-2 uppercase text-lg">Đặc quyền Thành viên U22:</h4>
      <p className="mb-4">Dành cho khách hàng từ 12 đến dưới 23 tuổi. Năm 2026 áp dụng cho năm sinh từ 2004 trở về sau.</p>
      <ul className="list-decimal pl-5 space-y-3">
        <li>Tích lũy điểm: 5% quầy vé và 3% quầy bắp nước.</li>
        <li>Quà sinh nhật: 01 Birthday Combo (và 01 vé phim khi tròn 23 tuổi).</li>
        <li><strong>Hoàn vé chủ động:</strong> 02 lượt/tháng.</li>
        <li>Bảo mật tài khoản: Phải xuất trình giấy tờ tùy thân khi đổi các coupon quà độc quyền tại rạp.</li>
      </ul>
    </div>
  </div>
);

const AccountTab = () => (
  <div className="space-y-4 text-[15px]">
    <h2 className="text-2xl font-bold uppercase mb-4 border-b-2 border-red-600 inline-block pb-1">Quản Lý Tài Khoản</h2>
    <p>Khi đăng nhập, bạn có thể dễ dàng quản lý các thông tin sau:</p>
    <ul className="list-disc pl-5 space-y-2">
      <li>Kiểm tra và chỉnh sửa thông tin cá nhân.</li>
      <li>Tra cứu điểm thưởng, tổng chi tiêu và lịch sử giao dịch.</li>
      <li>Kiểm tra thẻ quà tặng, voucher hoặc coupon hiện có.</li>
      <li>Cập nhật email/số điện thoại để nhận bản tin điện ảnh hàng tuần.</li>
    </ul>
    <p className="bg-blue-50 p-3 border-l-4 border-blue-500 italic">
      Để thay đổi ngày sinh hoặc email, vui lòng mang CCCD đến rạp gần nhất để làm phiếu yêu cầu thay đổi.
    </p>
  </div>
);

const SupportTab = () => (
  <div className="space-y-6 text-center py-6">
    <h2 className="text-2xl font-bold uppercase mb-4 border-b-2 border-red-600 inline-block pb-1">Bạn Cần Hỗ Trợ?</h2>
    <p className="max-w-xl mx-auto italic">
      "Với những ưu đãi hấp dẫn từ chương trình thành viên, CGV hy vọng sẽ mang đến cho bạn những trải nghiệm vượt xa điện ảnh."
    </p>
    <div className="space-y-2">
      <p className="text-xl font-bold">Email: <span className="text-red-600">hoidap@cgv.vn</span></p>
      <p className="text-xl font-bold">Hotline: <span className="text-red-600">1900 6017</span></p>
      <p className="text-gray-500">(8:00 – 22:00, từ Thứ Hai đến Chủ Nhật - bao gồm Lễ, Tết)</p>
    </div>
    <p className="pt-4 font-medium">Cảm ơn bạn đã luôn đồng hành cùng CGV!</p>
  </div>
);

// --- 2. COMPONENT CHÍNH ---

const MembershipRules: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('POINTS');

  return (
    // Sửa lỗi che khuất bằng pt-32 (padding top lớn hơn chiều cao header của bạn)
    <div className="min-h-screen bg-[#fdfcf0] pt-32 pb-10 px-4 font-sans text-[#333]">
      <div className="max-w-6xl mx-auto">
        
        {/* Header Section */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold uppercase tracking-tighter text-[#111]">Chương Trình Thành Viên</h1>
          <div className="flex justify-center items-center mt-2">
            <div className="h-[1px] bg-gray-300 w-20"></div>
            <span className="mx-3 text-red-600 text-xl">★★★</span>
            <div className="h-[1px] bg-gray-300 w-20"></div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Column: Sidebar Banner */}
          <div className="lg:w-1/3">
            <div className="sticky top-32">
              <img 
                src="https://iguov8nhvyobj.vcdn.cloud/media/wysiwyg/2020/membership_cgv.jpg" 
                alt="CGV Membership" 
                className="w-full rounded shadow-md border border-gray-200"
              />
            </div>
          </div>

          {/* Right Column: Main Content */}
          <div className="lg:w-2/3">
            {/* Tabs Navigation */}
            <div className="flex flex-wrap gap-[2px] mb-8">
              {( [
                { id: 'POINTS', label: 'Điểm thưởng' },
                { id: 'BIRTHDAY', label: 'Quà sinh nhật' },
                { id: 'LEVELS', label: 'Cấp độ thành viên' },
                { id: 'ACCOUNT', label: 'Quản lý tài khoản' },
                { id: 'SUPPORT', label: 'Bạn cần hỗ trợ' }
              ] as const).map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-3 px-2 text-[10px] sm:text-[11px] font-bold uppercase flex-1 min-w-[120px] transition-all border-b-4 ${
                    activeTab === tab.id 
                    ? 'bg-[#e71a0f] text-white border-red-800' 
                    : 'bg-[#d4d3c9] text-[#333] border-transparent hover:bg-gray-300'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Rules Content Card */}
            <div className="bg-white border border-[#d4d3c9] rounded-t-[15px] p-6 md:p-10 shadow-sm min-h-[600px]">
              {activeTab === 'POINTS' && <PointsTab />}
              {activeTab === 'BIRTHDAY' && <BirthdayTab />}
              {activeTab === 'LEVELS' && <LevelsTab />}
              {activeTab === 'ACCOUNT' && <AccountTab />}
              {activeTab === 'SUPPORT' && <SupportTab />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MembershipRules;