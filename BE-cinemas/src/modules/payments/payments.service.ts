import { Injectable, NotFoundException,InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { PaymentMethod, PaymentStatus, BookingStatus, TicketStatus } from '@prisma/client';

@Injectable()
export class PaymentService {


  constructor(private prisma: PrismaService) {}

  /**
   * LẤY CHI TIẾT VÉ ĐỂ HIỂN THỊ
   * Kết hợp dữ liệu từ nhiều bảng theo Schema
   */
  async getBookingDetail(bookingId: number) {
    const booking = await this.prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        // Thông tin người dùng
        user: { select: { full_name: true, email: true, phone: true } },
        // Thông tin suất chiếu và phim
        showtime: {
          include: {
            movie: true,
            room: {
              include: { cinema: true }
            }
          }
        },
        // Thông tin danh sách ghế đã chọn
        tickets: {
          include: {
            seat: true
          }
        },
        // Thông tin đồ ăn đã đặt
        booking_foods: {
          include: {
            food: true
          }
        },
        // Thông tin thanh toán (nếu có)
        payment: true,
        // Thông tin khuyến mãi
        promotion: true
      }
    });

    if (!booking) {
      throw new NotFoundException(`Không tìm thấy đơn hàng #${bookingId}`);
    }

    return booking;
  }
 /* 
  * XỬ LÝ THANH TOÁN THỦ CÔNG
   * Luồng: Cập nhật Booking -> Tạo Payment (Hóa đơn) -> Cập nhật toàn bộ Ticket
   */
 // src/modules/payments/payments.service.ts

async processManualPayment(bookingId: number, orderInfo: string) {
  const booking = await this.prisma.booking.findUnique({
    where: { id: bookingId },
    include: { tickets: true }
  });

  if (!booking) throw new NotFoundException('Đơn hàng không tồn tại');

  try {
    return await this.prisma.$transaction(async (tx) => {
      
      // 1. Tạo bản ghi Thanh toán với trạng thái SUCCESS (Thành công luôn)
      const payment = await tx.payment.upsert({
        where: { booking_id: bookingId },
        update: {
          payment_method: PaymentMethod.CASH, 
          payment_status: PaymentStatus.SUCCESS, // ĐỔI TỪ PENDING -> SUCCESS
          order_info: orderInfo,
          amount: booking.total_amount,
        },
        create: {
          booking_id: bookingId,
          payment_method: PaymentMethod.CASH,
          payment_status: PaymentStatus.SUCCESS, // ĐỔI TỪ PENDING -> SUCCESS
          amount: booking.total_amount,
          order_info: orderInfo,
        },
      });

      // 2. Cập nhật trạng thái Booking thành SUCCESS
      await tx.booking.update({
        where: { id: bookingId },
        data: { status: BookingStatus.SUCCESS }, // ĐỔI TỪ PENDING -> SUCCESS (Lưu ý: Nếu enum của bạn là SUCCESS hoặc PAID)
      });

      // 3. Cập nhật trạng thái toàn bộ Vé thành SUCCESS
      // Điều này sẽ giúp hiển thị màu xanh ở bảng Admin của bạn
      await tx.ticket.updateMany({
        where: { booking_id: bookingId },
        data: { status: TicketStatus.SUCCESS }, // ĐỔI TỪ BOOKING -> SUCCESS
      });

      // 4. Đảm bảo trạng thái ghế trong suất chiếu là BOOKED để không ai đặt đè lên được
      const seatIds = booking.tickets.map(t => t.showtime_seat_id);
      await tx.showtimeSeat.updateMany({
        where: { id: { in: seatIds } },
        data: { status: 'SOLD' }
      });

      return {
        success: true,
        message: 'Thanh toán thành công!',
        paymentId: payment.id,
      };
    });
  } catch (error) {
    throw new InternalServerErrorException('Lỗi khi xử lý xác nhận thanh toán');
  }
}
  }

