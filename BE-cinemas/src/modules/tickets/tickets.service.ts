import { Injectable, NotFoundException, ConflictException, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { TicketStatus } from '@prisma/client';

@Injectable()
export class TicketsService {
  constructor(private prisma: PrismaService) {}

  /**
   * 1. Tạo vé mới (Dùng Transaction)
   * Đảm bảo tính nhất quán: Đặt vé xong thì ghế phải đổi trạng thái ngay
   */
  async create(createTicketDto: CreateTicketDto) {
    try {
      return await this.prisma.$transaction(async (tx) => {
        // Kiểm tra ghế trong suất chiếu
        const showtimeSeat = await tx.showtimeSeat.findUnique({
          where: { id: createTicketDto.showtime_seat_id },
        });

        if (!showtimeSeat || showtimeSeat.status !== 'AVAILABLE') {
          throw new ConflictException('Ghế này hiện không khả dụng (đã có người đặt hoặc đang chờ)');
        }

        // Tạo vé
        const ticket = await tx.ticket.create({
          data: {
            showtime_id: createTicketDto.showtime_id,
            booking_id: createTicketDto.booking_id,
            seat_id: createTicketDto.seat_id,
            showtime_seat_id: createTicketDto.showtime_seat_id,
            price: createTicketDto.price,
            status: createTicketDto.status || TicketStatus.BOOKING,
          },
          include: {
            seat: true,
            showtime: { 
              include: { 
                movie: { select: { title: true } },
                room: { select: { name: true } } 
              } 
            },
            showtime_seat: true
          }
        });

        // Cập nhật trạng thái ghế sang BOOKED
        await tx.showtimeSeat.update({
          where: { id: createTicketDto.showtime_seat_id },
          data: { status: 'BOOKED' }
        });

        return ticket;
      });
    } catch (error) {
      if (error instanceof ConflictException) throw error;
      throw new InternalServerErrorException('Lỗi hệ thống khi tạo vé');
    }
  }

  /**
   * 2. Lấy tất cả vé (Dành cho Admin)
   * Nâng cấp: Bao gồm cả Room name để hiển thị đúng ở Table Frontend
   */
// src/modules/tickets/tickets.service.ts

async findAll() {
  return this.prisma.ticket.findMany({
    include: {
      booking: { 
        include: { user: { select: { full_name: true, email: true } } } 
      },
      showtime: { 
        include: { 
          movie: { select: { title: true } },
          room: { select: { name: true } } 
        } 
      },
      // Cách 1: Nếu Ticket nối trực tiếp với Seat
      seat: true, 
      // Cách 2: Nếu qua bảng trung gian showtime_seat (khuyên dùng)
      showtime_seat: {
        include: { seat: true }
      }
    },
    orderBy: { created_at: 'desc' }
  });
}

  /**
   * 3. Lấy chi tiết 1 vé
   */
  async findOne(id: number) {
    const ticket = await this.prisma.ticket.findUnique({
      where: { id },
      include: { 
        booking: { include: { user: true } },
        seat: true, 
        showtime: { include: { movie: true, room: true } },
        showtime_seat: true 
      }
    });
    
    if (!ticket) throw new NotFoundException(`Không tìm thấy vé với ID #${id}`);
    return ticket;
  }

  /**
   * 4. Cập nhật vé
   * Khắc phục: Xử lý cập nhật trạng thái đồng bộ với ghế nếu cần
   */
  async update(id: number, updateTicketDto: UpdateTicketDto) {
    const { status, price } = updateTicketDto;
    
    const currentTicket = await this.findOne(id);

    return this.prisma.$transaction(async (tx) => {
      const updatedTicket = await tx.ticket.update({
        where: { id },
        data: {
          ...(status && { status }),
          ...(price && { price }),
        },
        include: { showtime_seat: true }
      });

      if (status === TicketStatus.FAILED) {
        await tx.showtimeSeat.update({
          where: { id: currentTicket.showtime_seat_id },
          data: { status: 'AVAILABLE' }
        });
      }

      return updatedTicket;
    });
  }
   // src/modules/tickets/tickets.service.ts

/**
 * Cập nhật trạng thái hàng loạt cho vé thuộc về 1 Booking
 * Dùng khi thanh toán thành công hoặc thất bại
 */
async updateStatusByBooking(bookingId: number, status: TicketStatus) {
  return await this.prisma.$transaction(async (tx) => {
    // 1. Cập nhật tất cả vé của booking đó
    await tx.ticket.updateMany({
      where: { booking_id: bookingId },
      data: { status }
    });

    // 2. Nếu thất bại/hủy thì giải phóng ghế
    if (status === TicketStatus.FAILED) {
      const tickets = await tx.ticket.findMany({ where: { booking_id: bookingId } });
      const seatIds = tickets.map(t => t.showtime_seat_id);
      
      await tx.showtimeSeat.updateMany({
        where: { id: { in: seatIds } },
        data: { status: 'AVAILABLE' }
      });
    }
    
    return { success: true };
  });
}
  /**
   * 5. Hủy/Xóa vé vĩnh viễn
   * Đảm bảo ghế luôn được giải phóng trước khi vé biến mất
   */
  async remove(id: number) {
    const ticket = await this.prisma.ticket.findUnique({ 
      where: { id } 
    });

    if (!ticket) throw new NotFoundException('Vé không tồn tại trong hệ thống');

    return this.prisma.$transaction(async (tx) => {
      // 1. Trả trạng thái ghế về trống
      await tx.showtimeSeat.update({
        where: { id: ticket.showtime_seat_id },
        data: { status: 'AVAILABLE' }
      });

      // 2. Xóa vé
      return tx.ticket.delete({ where: { id } });
    });
  }
  
}
