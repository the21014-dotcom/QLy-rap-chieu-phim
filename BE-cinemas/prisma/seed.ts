import * as dotenv from 'dotenv';
import { PrismaClient, SeatType, RoomType, DiscountType } from '@prisma/client';
import * as bcrypt from 'bcrypt';

dotenv.config();
const prisma = new PrismaClient();

async function main() {
  console.log("🚀 Bắt đầu dọn dẹp và nạp dữ liệu toàn diện cho Cinema System...");

  // 1. DỌN DẸP DỮ LIỆU (Thứ tự quan trọng để tránh lỗi khóa ngoại)
  await prisma.payment.deleteMany();
  await prisma.showtimeSeat.deleteMany();
  await prisma.ticket.deleteMany();
  await prisma.bookingFood.deleteMany();
  await prisma.booking.deleteMany();
  await prisma.showtime.deleteMany();
  await prisma.seat.deleteMany();
  await prisma.room.deleteMany();
  await prisma.cinema.deleteMany();
  await prisma.movieGenre.deleteMany();
  await prisma.movie.deleteMany();
  await prisma.genre.deleteMany();
  await prisma.food.deleteMany();
  await prisma.promotion.deleteMany();
  await prisma.user.deleteMany();
  await prisma.role.deleteMany();

  console.log("🔑 Khởi tạo Roles...");
  const adminRole = await prisma.role.create({
    data: { name: 'ADMIN', description: 'Quản trị viên hệ thống' }
  });
  const userRole = await prisma.role.create({
    data: { name: 'USER', description: 'Khách hàng xem phim' }
  });

  console.log('🎭 Khởi tạo Thể loại...');
  const genres = await Promise.all([
    prisma.genre.create({ data: { name: 'Hoạt hình' } }),
    prisma.genre.create({ data: { name: 'Hành động' } }),
    prisma.genre.create({ data: { name: 'Kinh dị' } }),
  ]);

  console.log("🎬 Tạo danh sách phim...");
  const movieDoraemon = await prisma.movie.create({
    data: {
      title: "DORAEMON: NOBITA VÀ LÂU ĐÀI DƯỚI ĐÁY BIỂN",
      duration: 120,
      rating: "C13",
      description: "Cuộc phiêu lưu dưới đáy biển của nhóm bạn Nobita.",
      poster_url: "https://example.com/poster.jpg",
      release_date: new Date("2026-05-22"),
      end_date: new Date("2026-07-01"),
      is_active: true,
      genres: { create: [{ genre_id: genres[0].id }] }
    }
  });

  // 4. TẠO CỤM RẠP & PHÒNG CHIẾU (Sử dụng Enum RoomType)
  console.log("🏢 Tạo cụm rạp và phòng chiếu...");
  const cgvHaiPhong = await prisma.cinema.create({
    data: {
      name: "CGV Vincom Hải Phòng",
      address: "Thượng Lý, Hồng Bàng, Hải Phòng",
      city: "Hải Phòng",
      hotline: "1900 83860404",
      rooms: {
        create: [
          { name: "Phòng 01", room_type: RoomType.STANDARD_2D, total_rows: 11, cols_per_row: 10, total_seats: 110 },
          { name: "Phòng 02", room_type: RoomType.STANDARD_2D, total_rows: 11, cols_per_row: 10, total_seats: 110 },
          { name: "Phòng 03", room_type: RoomType.STANDARD_2D, total_rows: 11, cols_per_row: 10, total_seats: 110 },
          { name: "Phòng 04", room_type: RoomType.STANDARD_2D, total_rows: 11, cols_per_row: 10, total_seats: 110 },
          { name: "Phòng 05 (VIP)", room_type: RoomType.GOLD_CLASS, total_rows: 5, cols_per_row: 10, total_seats: 50 },
        ]
      }
    },
    include: { rooms: true }
  });

  // 5. TẠO GHẾ CHI TIẾT (Có phụ phí price_extra cho ghế VIP/Sweetbox)
console.log("🪑 Đang tạo ghế và cấu hình giá theo sơ đồ mới...");

for (const room of cgvHaiPhong.rooms) {
  const seatData = [];
  // Mảng ký tự hàng ghế từ A đến K
  const rowChars = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K'];
  
  for (let i = 0; i < room.total_rows; i++) {
    const row = rowChars[i];
    
    for (let col = 1; col <= room.cols_per_row; col++) {
      let type: SeatType = SeatType.NORMAL;
      let extra = 0;

      // TRƯỜNG HỢP 1: Phòng GOLD_CLASS
      if (room.room_type === RoomType.GOLD_CLASS) {
        type = SeatType.VIP;
        extra = 50000;
      } 
      // TRƯỜNG HỢP 2: Phòng STANDARD_2D
      else {
        // Hàng D, E, F, G, H, I, J là VIP
        if (['D', 'E', 'F', 'G', 'H', 'I', 'J'].includes(row)) {
          type = SeatType.VIP;
          extra = 20000;
        } 
        // Hàng K là SWEETBOX (Ghế đôi)
        else if (row === 'K') {
          type = SeatType.SWEETBOX;
          extra = 40000;
        }
        // Các hàng A, B, C mặc định là NORMAL và extra = 0 (đã khởi tạo ở trên)
      }

      seatData.push({
        row,
        number: col,
        type,
        price_extra: extra,
        room_id: room.id
      });
    }
  }
  
  // Sử dụng createMany để tối ưu tốc độ nạp dữ liệu
  await prisma.seat.createMany({ data: seatData });
}

  // 6. TẠO SUẤT CHIẾU (Sử dụng Giờ Việt Nam GMT+7)
console.log("🕒 Tạo suất chiếu theo giờ Việt Nam...");

const standardRoom = cgvHaiPhong.rooms[0];

// Cách tạo Date khớp với giờ địa phương Việt Nam
const startTime = new Date('2026-05-25T19:00:00'); 
const endTime = new Date('2026-05-25T21:00:00');

const showtime = await prisma.showtime.create({
  data: {
    movie_id: movieDoraemon.id,
    room_id: standardRoom.id,
    start_time: startTime,
    end_time: endTime,
    price_base: 90000, // Đã đồng bộ kiểu Int (VND)
  }
});

  // 7. KHỞI TẠO TRẠNG THÁI GHẾ CHO SUẤT CHIẾU
console.log("🎟️ Đang đồng bộ giá và trạng thái ghế...");

const seats = await prisma.seat.findMany({ 
  where: { room_id: standardRoom.id } 
});

await prisma.showtimeSeat.createMany({
  data: seats.map(s => ({
    showtime_id: showtime.id,
    seat_id: s.id,
    status: 'AVAILABLE',
    // Giá thực tế = Giá suất chiếu + Phụ phí loại ghế
    price_base: Number(showtime.price_base) + Number(s.price_extra),
    seat_type: s.type
  }))
});

  // 8. ĐỒ ĂN (Thêm Category và Description)
  console.log("🍟 Khởi tạo Food & Combo...");
  await prisma.food.createMany({
    data: [
      { 
        name: "My Combo", 
        description: "1 Bắp lớn + 1 Nước ngọt", 
        price: 139000, 
        category: "COMBO" 
      },
      { 
        name: "Poca Snack", 
        description: "Khoai tây chiên giòn", 
        price: 25000, 
        category: "SNACK" 
      }
    ]
  });

  // 9. ADMIN USER
  const hashedPassword = await bcrypt.hash('admin123', 10);
  await prisma.user.create({
    data: {
      email: "admin@cgv.vn",
      password: hashedPassword,
      full_name: "Admin Hải Phòng",
      role_id: adminRole.id,
      is_verified: true
    }
  });

  // 10. PROMOTION (Bổ sung min_order_value)
  await prisma.promotion.create({
    data: {
      code: "CGV2026",
      discount_type: DiscountType.PERCENT,
      discount_value: 20,
      max_discount: 50000,
      min_order_value: 200000,
      start_date: new Date('2026-01-01'),
      end_date: new Date('2026-12-31'),
    }
  });

  console.log("✅ Seed dữ liệu hoàn tất!");
  // 11. VALIDATE SEATS SAU KHI TẠO
   console.log("✅ Validate ghế đã tạo...");
  const totalSeats = await prisma.seat.count();
console.log(`📊 Tổng số ghế: ${totalSeats}`);
const seatTypes = await prisma.seat.groupBy({
  by: ['type'],
  _count: { id: true }
});
console.log('📈 Phân loại ghế:', seatTypes);
}

main()

  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
  