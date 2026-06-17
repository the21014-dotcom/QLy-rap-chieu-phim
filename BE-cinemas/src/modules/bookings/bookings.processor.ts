import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '../../prisma/prisma.service';
import { BookingStatus, TicketStatus } from '@prisma/client'; // Import Enum ở đây
import moment from 'moment';

@Injectable()
export class BookingsProcessor {
  private readonly logger = new Logger(BookingsProcessor.name);

  constructor(private prisma: PrismaService) {}

  @Cron(CronExpression.EVERY_MINUTE)
  async handleAutoCancelBookings() {
    // Ngưỡng thời gian: Quá 10 phút không thanh toán
    const expirationTime = moment().subtract(10, 'minutes').toDate();

    // 1. Tìm các booking PENDING đã quá hạn
    const expiredBookings = await this.prisma.booking.findMany({
      where: {
        status: BookingStatus.PENDING,
        created_at: { lt: expirationTime },
      },
      include: { tickets: true },
    });

    if (expiredBookings.length === 0) return;

    this.logger.log(`Phát hiện ${expiredBookings.length} đơn hàng quá hạn. Đang xử lý...`);

    for (const booking of expiredBookings) {
      try {
        await this.prisma.$transaction(async (tx) => {
          // 2. Cập nhật Booking -> CANCELLED
          await tx.booking.update({
            where: { id: booking.id },
            data: { status: BookingStatus.CANCELLED },
          });

          // 3. Cập nhật Tickets -> FAILED
          await tx.ticket.updateMany({
            where: { booking_id: booking.id },
            data: { status: TicketStatus.FAILED },
          });

          // 4. Giải phóng ghế -> AVAILABLE
          const ssIds = booking.tickets.map((t) => t.showtime_seat_id);
          await tx.showtimeSeat.updateMany({
            where: { id: { in: ssIds } },
            // Vì status trong model ShowtimeSeat là String nên để "AVAILABLE" là đúng
            data: { status: 'AVAILABLE', held_at: null }, 
          });
        });
        this.logger.warn(`Đã hủy thành công đơn hàng #${booking.id}`);
      } catch (error) {
        this.logger.error(`Lỗi khi hủy đơn hàng #${booking.id}:`, error);
      }
    }
  }
}