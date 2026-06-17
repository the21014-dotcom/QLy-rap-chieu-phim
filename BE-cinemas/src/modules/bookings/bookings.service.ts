import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { Cron, CronExpression } from '@nestjs/schedule';
import { TicketStatus, BookingStatus } from '@prisma/client';

@Injectable()
export class BookingsService {
  constructor(private prisma: PrismaService) {}

  async createBooking(userId: number, dto: CreateBookingDto) {
    return await this.prisma.$transaction(async (tx) => {
      // 1. Kiểm tra số lượng ghế hợp lệ
      if (!dto.showtime_seat_ids?.length || dto.showtime_seat_ids.length > 8) {
        throw new BadRequestException('Số lượng ghế không hợp lệ (1-8 ghế)');
      }

      // 2. Lấy thông tin suất chiếu và các ghế cụ thể trong suất chiếu đó
      // Bao gồm cả thông tin 'seat' để lấy 'price_extra'
      const [showtime, targetSeats] = await Promise.all([
        tx.showtime.findUnique({ where: { id: dto.showtime_id } }),
        tx.showtimeSeat.findMany({
          where: { id: { in: dto.showtime_seat_ids }, showtime_id: dto.showtime_id },
          include: { seat: true }
          
        }),
        
      ]);

      if (!showtime) throw new NotFoundException('Suất chiếu không tồn tại');
      if (targetSeats.length !== dto.showtime_seat_ids.length) {
        throw new BadRequestException('Một số ghế chọn không thuộc suất chiếu này');
      }
      const existingTickets = await tx.ticket.findMany({
  where: { showtime_seat_id: { in: dto.showtime_seat_ids } }
});

if (existingTickets.length > 0) {
  throw new BadRequestException('Một số ghế bạn chọn đã được xuất vé rồi, vui lòng chọn ghế khác');
}

      // 3. CHIẾN THUẬT CHỐNG TRÙNG GHẾ: Update trạng thái ngay lập tức
      const updateResult = await tx.showtimeSeat.updateMany({
        where: {
          id: { in: dto.showtime_seat_ids },
          status: 'AVAILABLE',
        },
        data: { status: 'BOOKED' },
      });

      if (updateResult.count !== dto.showtime_seat_ids.length) {
        throw new BadRequestException('Một hoặc nhiều ghế đã có người khác đặt nhanh hơn');
      }

      // 4. Tính toán tổng tiền vé dựa trên price_base + price_extra (Khớp logic Seed.ts)
      let totalAmount = 0;
      const ticketsToCreate = targetSeats.map((ss) => {
        const finalPrice = Number(ss.price_base);
        totalAmount += finalPrice;
        return {
          showtime_id: dto.showtime_id,
          seat_id: ss.seat_id,
          showtime_seat_id: ss.id, // Khóa ngoại quan hệ 1-1
          price: finalPrice,
          status: TicketStatus.BOOKING,
        };
      });

      // 5. Tính tiền đồ ăn
      const foodData = [];
      if (dto.foods?.length) {
        const dbFoods = await tx.food.findMany({
          where: { id: { in: dto.foods.map(f => f.food_id) }, is_available: true },
        });

        for (const item of dto.foods) {
    const f = dbFoods.find(df => df.id === item.food_id);
    if (!f) throw new BadRequestException(`Món ăn ID ${item.food_id} không khả dụng`);
    
    const itemPrice = Number(f.price);
    const itemQuantity = Number(item.quantity);
    const itemTotalPrice = itemPrice * itemQuantity;

    // CỘNG DỒN VÀO TỔNG TIỀN CHUNG
        totalAmount += itemTotalPrice;

         foodData.push({
      food_id: f.id,
      quantity: itemQuantity,
      price: itemPrice,
      total_price: itemTotalPrice, // BỔ SUNG DÒNG NÀY ĐỂ HẾT LỖI
    });
  }
}

      // 6. Áp dụng Khuyến mãi
   // 6. Áp dụng Khuyến mãi (Bổ sung kiểm tra min_order_value)
let promotionId = null;
if (dto.promotion_code) {
  const promo = await tx.promotion.findUnique({ where: { code: dto.promotion_code } });
  const now = new Date();

  // Kiểm tra đầy đủ: Active, Thời hạn, Lượt dùng, và Giá trị đơn hàng tối thiểu
  if (
    promo?.is_active && 
    promo.start_date <= now && 
    promo.end_date >= now && 
    promo.used_count < (promo.usage_limit || Infinity) &&
    totalAmount >= Number(promo.min_order_value) // Kiểm tra điều kiện đơn tối thiểu
  ) {
    let discount = promo.discount_type === 'PERCENT' 
      ? totalAmount * (Number(promo.discount_value) / 100) 
      : Number(promo.discount_value);
    
    // Kiểm tra max_discount nếu là giảm theo %
    if (promo.discount_type === 'PERCENT' && promo.max_discount) {
      discount = Math.min(discount, Number(promo.max_discount));
    }

    totalAmount = Math.max(0, totalAmount - discount);
    promotionId = promo.id;
    
    await tx.promotion.update({ 
      where: { id: promo.id }, 
      data: { used_count: { increment: 1 } } 
    });
  }
}

      // 7. Tạo Booking và Tickets (Kết nối 1-1)
      return await tx.booking.create({
        data: {
          user_id: userId,
          showtime_id: dto.showtime_id,
          promotion_id: promotionId,
          total_amount: totalAmount,
          status: BookingStatus.PENDING,
          tickets: { create: ticketsToCreate },
          booking_foods: { create: foodData },
        },
        include: { tickets: true }
      });
    }, { isolationLevel: 'Serializable' }); // Tránh tối đa xung đột dữ liệu
  }

  
  /**
   * 2. LẤY LỊCH SỬ CHO USER (Đầy đủ thông tin Phim, Rạp, Ghế, Đồ ăn)
   */
  async getHistoryByUserId(userId: number) {
    return await this.prisma.booking.findMany({
      where: { user_id: userId },
      include: {
        showtime: {
          include: {
            movie: true,
            room: { include: { cinema: true } },
          },
        },
        tickets: { include: { seat: true } },
        booking_foods: { include: { food: true } },
      },
      orderBy: { created_at: 'desc' },
    });
  }

  /**
   * 3. LẤY DANH SÁCH CHO ADMIN (Cải tiến Search & Phân trang)
   */
  async findAllForAdmin(query: { status?: any; search?: string; page: number; limit: number }) {
  const { status, search, page, limit } = query;
  const skip = (page - 1) * limit;

  const where: any = {};
  if (status) where.status = status;
  if (search) {
    where.OR = [
      { id: !isNaN(Number(search)) ? Number(search) : undefined },
      { user: { full_name: { contains: search } } },
      { user: { email: { contains: search } } },
    ];
  }

 const [items, total] = await Promise.all([
    this.prisma.booking.findMany({
      where,
      skip,
      take: limit,
      include: {
        user: { select: { id: true, full_name: true, email: true } },
        showtime: { include: { movie: { select: { title: true } }, room: { include: { cinema: true } } } },
        tickets: { include: { seat: true } },
        booking_foods: { include: { food: true } }, // BỔ SUNG DÒNG NÀY
      },
      orderBy: { created_at: 'desc' },
    }),
    this.prisma.booking.count({ where }),
  ]);
  return { items, total, page, lastPage: Math.ceil(total / limit) };
}
    
async deleteBooking(id: number) {
  // Lưu ý: Do có onDelete: Cascade trong Prisma nên sẽ xóa được các bảng liên quan
  return await this.prisma.booking.delete({ where: { id } });
}

// THÊM HÀM CẬP NHẬT TRẠNG THÁI
async updateStatus(id: number, status: any) {
  return await this.prisma.$transaction(async (tx) => {
    // 1. Cập nhật trạng thái Booking (Để trang Hóa đơn hiện SUCCESS)
    const updatedBooking = await tx.booking.update({
      where: { id },
      data: { status: status } // status truyền vào là 'SUCCESS'
    });

    // 2. Cập nhật trạng thái toàn bộ Ticket của Booking đó (Để trang TicketList hiện SUCCESS)
    await tx.ticket.updateMany({
      where: { booking_id: id },
      data: { status: status === 'SUCCESS' ? 'SUCCESS' : 'FAILED' } 
    });

    // 3. Cập nhật trạng thái ghế sang SOLD nếu thành công
    if (status === 'SUCCESS') {
       const tickets = await tx.ticket.findMany({ where: { booking_id: id } });
       const seatIds = tickets.map(t => t.showtime_seat_id);
       
       await tx.showtimeSeat.updateMany({
         where: { id: { in: seatIds } },
         data: { status: 'SOLD' }
       });
    }

    return updatedBooking;
  });
}
  /**
   * 4. CHI TIẾT ĐƠN HÀNG
   */
  async getBookingDetail(id: number) {
    const booking = await this.prisma.booking.findUnique({
      where: { id },
      include: {
        user: { select: { id: true, full_name: true, email: true, phone: true } },
        showtime: { 
          include: { 
            movie: true, 
            room: { include: { cinema: true } } 
          } 
        },
        tickets: { include: { seat: true } },
        booking_foods: { include: { food: true } },
        promotion: true,
      },
    });
    if (!booking) throw new NotFoundException('Không tìm thấy đơn hàng');
    return booking;
  }


  // Các hàm findAllForAdmin, getBookingDetail, getHistoryByUserId giữ nguyên logic cũ
}