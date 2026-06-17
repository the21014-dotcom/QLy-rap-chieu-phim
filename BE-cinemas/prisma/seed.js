import * as dotenv from 'dotenv';
import { PrismaClient, SeatType, MovieRating, Role, DiscountType } from '@prisma/client';
// 1. Ép nạp dotenv thủ công lần nữa cho chắc
dotenv.config();
// 2. Lấy URL ra một biến riêng để kiểm tra
const dbUrl = process.env.DATABASE_URL;
if (!dbUrl) {
    console.error("❌ KHÔNG TÌM THẤY DATABASE_URL! Hãy kiểm tra file .env hoặc đường dẫn lệnh.");
    process.exit(1);
}
// 3. Khởi tạo Prisma với cấu hình "cổ điển" nhưng bao sân mọi phiên bản
const prisma = new PrismaClient();
async function main() {
    console.log("🚀 Bắt đầu quá trình nạp dữ liệu mẫu...");
    // Kiểm tra kết nối trước khi làm việc
    try {
        await prisma.$connect();
        console.log("✅ Kết nối Database thành công!");
    }
    catch (error) {
        console.error("❌ Không thể kết nối Database. Kiểm tra file .env!");
        process.exit(1);
    }
    // Kiểm tra biến môi trường
    if (!process.env.DATABASE_URL) {
        throw new Error("❌ Lỗi: DATABASE_URL không tồn tại trong file .env!");
    }
    // 3. DỌN DẸP DỮ LIỆU CŨ (Tránh lỗi trùng lặp/Unique constraint)
    // Xóa theo thứ tự từ bảng con (nhiều quan hệ) đến bảng cha
    console.log("🧹 Đang dọn dẹp dữ liệu cũ...");
    await prisma.ticket.deleteMany();
    await prisma.bookingFood.deleteMany();
    await prisma.booking.deleteMany();
    await prisma.showtime.deleteMany();
    await prisma.seat.deleteMany();
    await prisma.room.deleteMany();
    await prisma.cinema.deleteMany();
    await prisma.movie.deleteMany();
    await prisma.food.deleteMany();
    await prisma.promotion.deleteMany();
    await prisma.user.deleteMany();
    // 4. TẠO PHIM
    const movieEndgame = await prisma.movie.create({
        data: {
            title: "Avengers: Endgame",
            duration: 181,
            rating: MovieRating.C13,
            description: "Trận chiến cuối cùng chống lại Thanos để cứu lấy vũ trụ.",
        }
    });
    const movieLatMat = await prisma.movie.create({
        data: {
            title: "Lật Mặt 7: Một Điều Ước",
            duration: 138,
            rating: MovieRating.P,
            description: "Câu chuyện gia đình bà Hai với những cung bậc cảm xúc sâu sắc.",
        }
    });
    // 5. TẠO CỤM RẠP & PHÒNG
    const cinemaHanoi = await prisma.cinema.create({
        data: {
            name: "CGV Cinemas - Vincom Bà Triệu",
            address: "191 Bà Triệu, Hai Bà Trưng",
            city: "Hà Nội",
            rooms: {
                create: [
                    { name: "Phòng 01 (P01)" },
                    { name: "Phòng 02 (IMAX)" }
                ]
            }
        },
        include: { rooms: true }
    });
    const room_id = cinemaHanoi.rooms[0].id;
    // 6. TỰ ĐỘNG TẠO GHẾ (10 hàng x 10 ghế = 100 ghế)
    const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
    const seatData = [];
    for (const row of rows) {
        for (let i = 1; i <= 10; i++) {
            seatData.push({
                row: row,
                number: i,
                // Phân loại: J là Sweetbox, từ G-I là VIP, còn lại Normal
                type: row === 'J' ? SeatType.SWEETBOX : (['G', 'H', 'I'].includes(row) ? SeatType.VIP : SeatType.NORMAL),
                room_id: room_id
            });
        }
    }
    await prisma.seat.createMany({ data: seatData });
    // 7. TẠO SUẤT CHIẾU
    await prisma.showtime.createMany({
        data: [
            {
                start_time: new Date('2026-04-20T18:00:00Z'),
                price_base: 90000,
                movie_id: movieEndgame.id,
                room_id: room_id
            },
            {
                start_time: new Date('2026-04-20T21:30:00Z'),
                price_base: 110000,
                movie_id: movieLatMat.id,
                room_id: room_id
            }
        ]
    });
    // 8. TẠO ĐỒ ĂN
    await prisma.food.createMany({
        data: [
            { name: "Bắp rang bơ (Vị Caramel)", price: 45000, is_available: true },
            { name: "Pepsi (L)", price: 30000, is_available: true },
            { name: "Combo Solo (1 Bắp + 1 Nước)", price: 69000, is_available: true },
            { name: "Combo Couple (1 Bắp L + 2 Nước L)", price: 99000, is_available: true }
        ]
    });
    // 9. TẠO KHUYẾN MÃI
    await prisma.promotion.create({
        data: {
            code: "DATN2026",
            //description: "Giảm 20% cho sinh viên",
            discount_type: DiscountType.PERCENT,
            discount_value: 20,
            start_date: new Date(),
            end_date: new Date('2026-12-31'),
            usage_limit: 500
        }
    });
    // 10. TẠO USER ADMIN
    await prisma.user.create({
        data: {
            email: "admin@tacinemas.com",
            password: "admin123",
            full_name: "Nguyễn Văn Admin",
            role: Role.ADMIN,
            is_verified: true
        }
    });
    console.log("✅ Đã hoàn tất nạp dữ liệu sịn!");
}
main()
    .catch((e) => {
    console.error("❌ Lỗi khi seed dữ liệu:", e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=seed.js.map