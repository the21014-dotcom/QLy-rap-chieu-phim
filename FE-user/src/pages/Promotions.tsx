import { Gift, ArrowRight } from "lucide-react";
import AIChatBot from '../components/AIChatBot';

const promotions = [
  {
    id: 1,
    image:
      "https://stc.shopiness.vn/deal/2018/06/25/5/2/b/f/1529903533585_540.png",
    title: "SIÊU HỘI THÀNH VIÊN - ĐỒNG GIÁ VÉ 45K CHO SINH VIÊN",
    description:
      "Áp dụng cho mọi suất chiếu 2D vào các ngày trong tuần tại tất cả các cụm rạp CGV Cinemas trên toàn quốc...",
    link: "https://www.cgv.vn/",
  },
  {
    id: 2,
    image:
      "https://tse4.mm.bing.net/th/id/OIP.0XXtyU1XsVf1VdzcpJInwAHaHa?rs=1&pid=ImgDetMain&o=7&rm=3",
    title: "COMBO 1 BẮP 2 NƯỚC SIÊU TIẾT KIỆM",
    description:
      "Mua ngay combo bắp nước tiết kiệm khi đặt vé online qua ứng dụng CGV vào cuối tuần...",
    link: "https://vnpay.vn/ve-xem-phim/blog/gia-bap-nuoc-rap-cgv",
  },
  {
    id: 3,
    image:
      "https://tse4.mm.bing.net/th/id/OIP.u6aLs7seAG-Aunr5xqiUuwHaHa?rs=1&pid=ImgDetMain&o=7&rm=3",
    title: "THỨ 4 VUI VẺ - GIẢM GIÁ TOÀN BỘ VÉ XEM PHIM",
    description:
      "Ưu đãi đặc biệt dành cho khách hàng thành viên khi xem phim vào ngày thứ 4 hàng tuần...",
    link: "https://vincom.com.vn/promotion/thu-4-vui-ve-tai-cgv",
  },
  {
    id: 4,
    image:
      "https://vnpay.vn/s1/statics.vnpay.vn/2022/10/0vbqm4mn1051666694822818.jpg",
    title: "ƯU ĐÃI THANH TOÁN QUA VNPAY",
    description:
      "Giảm ngay 20K cho hóa đơn từ 100K khi thanh toán qua ví điện tử VNPay...",
    link: "https://vnpay.vn/ve-xem-phim/uu-dai/ve-cgv-chi-tu-84k-tren-VNPAY",
  },
  {
    id: 5,
    image:
      "https://flowerimages.vnpay.vn/flowerimages/a656ae0de888457b9a97058848153030.jpg",
    title: "Mua 1 tặng 1 vé CGV” trên app ngân hàng & VNPAY: “Mọt phim” sẵn sàng săn bom tấn chưa?",
    description:
      "nhận hàng loạt deal “sốc”: mua 1 tặng 1, vé đồng giá chỉ từ 75.000 đồng, ưu đãi combo bỏng - nước chỉ 64.000 đồng…",
    link: "https://vnpay.vn/ve-xem-phim/uu-dai/mua-ve-cgv-mua-1-tang-1",
  },
  {
    id: 6,
    image:
      "https://th.bing.com/th/id/OIP.w2sERhBSxL1OdYtJMEgjgwHaHZ?o=7rm=3&rs=1&pid=ImgDetMain&o=7&rm=3",
    title: "THẺ THÀNH VIÊN VIP NHẬN QUÀ KHỦNG",
    description:
      "Tích điểm đổi quà và nhận hàng loạt đặc quyền hấp dẫn dành riêng cho thành viên VIP...",
    link: "https://www.cgv.vn/en/cinox/site/",
  },
];

export default function Promotions() {
  return (
    <div className="min-h-screen bg-dark pt-24 text-white">
      <div className="mx-auto max-w-7xl px-6 pb-20">

        {/* TITLE */}
        <div className="mb-16 text-center">
          <h1 className="text-5xl font-black italic uppercase tracking-tighter text-primary">
            Ưu đãi độc quyền
          </h1>

          <p className="mt-4 text-zinc-500 font-medium">
            Khám phá các chương trình khuyến mãi và quà tặng hấp dẫn từ CGV Cinemas
          </p>
        </div>

        {/* GRID */}
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">

          {promotions.map((item) => (
            <div
              key={item.id}
              className="group relative overflow-hidden rounded-3xl border border-zinc-800 bg-card transition-all hover:-translate-y-2 hover:border-primary/50 shadow-2xl"
            >
              {/* IMAGE */}
              <div className="aspect-video w-full overflow-hidden">
                <img
                  src={item.image}
                  alt={item.title}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </div>

              {/* CONTENT */}
              <div className="p-8">

                <div className="mb-4 flex items-center gap-2 text-primary">
                  <Gift size={20} />

                  <span className="text-xs font-black uppercase tracking-widest">
                    Tin mới nhất
                  </span>
                </div>

                <h3 className="mb-4 text-xl font-bold leading-tight group-hover:text-primary transition-colors">
                  {item.title}
                </h3>

                <p className="mb-6 text-sm text-zinc-500 line-clamp-2">
                  {item.description}
                </p>

                {/* LINK */}
                <a
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 font-black text-sm uppercase tracking-tighter text-white hover:text-primary transition-colors"
                >
                  Chi tiết <ArrowRight size={16} />
                </a>
              </div>

              {/* HOT BADGE */}
              <div className="absolute top-4 right-4 rounded-full bg-primary px-3 py-1 text-[10px] font-black uppercase tracking-widest text-white shadow-lg">
                Hot
              </div>
            </div>
          ))}
        </div>
      </div>
      <AIChatBot />
    </div>
  );
}