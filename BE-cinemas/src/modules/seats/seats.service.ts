import { Injectable, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { SeatType, RoomType } from '@prisma/client';
import { CreateSeatDto, UpdateSeatDto, GenerateRoomSeatsDto } from './dto/create-seat.dto';

@Injectable()
export class SeatsService {
  constructor(private prisma: PrismaService) {}

  // 1. Lấy danh sách ghế theo phòng (Tối ưu cho Frontend render)
  async findByRoom(roomId: number) {
    const room = await this.prisma.room.findUnique({
      where: { id: roomId },
      include: { seats: {
        orderBy: [
          { row: 'asc' },
          { number: 'asc' }
        ]
      }}
    });

    if (!room) throw new NotFoundException('Phòng chiếu không tồn tại');

    return {
      room: {
        id: room.id,
        name: room.name,
        room_type: room.room_type,
        total_rows: room.total_rows,
        cols_per_row: room.cols_per_row,
        total_seats: room.total_seats
      },
      seats: room.seats
    };
  }

  // 2. Lấy ghế theo suất chiếu (Dành cho booking)
  async findByShowtime(showtimeId: number) {
    return this.prisma.showtimeSeat.findMany({
      where: { showtime_id: showtimeId },
      include: {
        seat: {
          select: {
            id: true,
            row: true,
            number: true,
            type: true,
            price_extra: true
          }
        }
      },
      orderBy: [
        { seat: { row: 'asc' } },
        { seat: { number: 'asc' } }
      ]
    });
  }

  // 3. Tạo 1 ghế đơn lẻ
  async create(createSeatDto: CreateSeatDto) {
    // Kiểm tra ghế đã tồn tại chưa
    const existingSeat = await this.prisma.seat.findFirst({
      where: {
        room_id: createSeatDto.room_id,
        row: createSeatDto.row,
        number: createSeatDto.number
      }
    });

    if (existingSeat) {
      throw new ConflictException(`Ghế ${createSeatDto.row}${createSeatDto.number} đã tồn tại`);
    }

    return this.prisma.seat.create({
      data: createSeatDto,
      include: { room: { select: { name: true } } }
    });
  }

  // 4. Cập nhật ghế (Admin)
  async update(id: number, dto: UpdateSeatDto) {
    const seat = await this.prisma.seat.findUnique({ where: { id } });
    if (!seat) throw new NotFoundException('Ghế không tồn tại');

    return this.prisma.seat.update({
      where: { id },
      data: dto,
    });
  }

  // 5. TỰ ĐỘNG TẠO GHẾ KHỚP 100% LOGIC SEED.TS
  async generateSeatsForRoom(roomId: number, dto: GenerateRoomSeatsDto) {
    const room = await this.prisma.room.findUnique({ 
      where: { id: roomId } 
    });
    if (!room) throw new NotFoundException('Phòng chiếu không tồn tại');

    // Xóa ghế cũ
    await this.prisma.seat.deleteMany({ where: { room_id: roomId } });

    const rowChars = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K'].slice(0, dto.rows);
    const seatData = [];

    for (let i = 0; i < dto.rows; i++) {
      const row = rowChars[i];
      
      for (let col = 1; col <= dto.cols; col++) {
        let type: SeatType = SeatType.NORMAL;
        let extra = 0;

       
        if (room.room_type === RoomType.GOLD_CLASS) {
          type = SeatType.VIP;
          extra = 50000;
        } else {
          // Hàng D-I,J là VIP (index 3-9)
          if (['D', 'E', 'F', 'G', 'H', 'I', 'J'].includes(row)) {
            type = SeatType.VIP;
            extra = 20000;
          } 
          // Hàng K là SWEETBOX
          else if (row === 'K') {
            type = SeatType.SWEETBOX;
            extra = 40000;
          }
        }

        seatData.push({
          room_id: roomId,
          row,
          number: col,
          type,
          price_extra: extra
        });
      }
    }

    const result = await this.prisma.seat.createMany({ 
      data: seatData,
      skipDuplicates: true 
    });

    // Cập nhật lại total_seats cho room
    await this.prisma.room.update({
      where: { id: roomId },
      data: { total_seats: seatData.length }
    });

    return {
      ...result,
      room_name: room.name,
      total_seats: seatData.length,
      summary: this.getSeatTypeSummary(seatData)
    };
  }

  // 6. Thống kê loại ghế
  private getSeatTypeSummary(seats: any[]) {
    const summary = seats.reduce((acc, seat) => {
      acc[seat.type] = (acc[seat.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return summary;
  }

  // 7. Xóa toàn bộ ghế của phòng
  async deleteByRoom(roomId: number) {
    const deleted = await this.prisma.seat.deleteMany({ 
      where: { room_id: roomId } 
    });

    // Reset total_seats về 0
    await this.prisma.room.update({
      where: { id: roomId },
      data: { total_seats: 0 }
    });

    return { deletedCount: deleted.count };
  }

  // 8. Đặt ghế tạm thời HOLD (cho booking)
  async holdSeats(showtimeId: number, seatIds: number[]) {
    const showtimeSeats = await this.prisma.showtimeSeat.findMany({
      where: {
        showtime_id: showtimeId,
        seat_id: { in: seatIds },
        status: 'AVAILABLE'
      }
    });

    if (showtimeSeats.length !== seatIds.length) {
      throw new BadRequestException('Một số ghế đã được đặt hoặc không khả dụng');
    }

    return this.prisma.$transaction(
      seatIds.map(seatId => 
        this.prisma.showtimeSeat.updateMany({
          where: {
            showtime_id: showtimeId,
            seat_id: seatId,
            status: 'AVAILABLE'
          },
          data: {
            status: 'HOLDING',
            held_at: new Date()
          }
        })
      )
    );
  }

  // 9. Giải phóng ghế HOLD
  async releaseSeats(showtimeId: number, seatIds: number[]) {
    return this.prisma.showtimeSeat.updateMany({
      where: {
        showtime_id: showtimeId,
        seat_id: { in: seatIds },
        status: 'HOLDING'
      },
      data: {
        status: 'AVAILABLE',
        held_at: null
      }
    });
  }
}