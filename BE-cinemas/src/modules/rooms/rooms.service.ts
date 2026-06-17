import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateRoomDto, UpdateRoomDto } from './dto/create-room.dto';
import { SeatType, RoomType } from '@prisma/client';

@Injectable()
export class RoomsService {
  constructor(private prisma: PrismaService) {}

  async createRoom(dto: CreateRoomDto) {
    return await this.prisma.$transaction(async (tx) => {
      // 1. Tạo phòng chiếu
      const room = await tx.room.create({
        data: {
          name: dto.name,
          room_type: dto.room_type,
          total_rows: dto.total_rows,
          cols_per_row: dto.cols_per_row,
          total_seats: dto.total_rows * dto.cols_per_row,
          cinema_id: dto.cinema_id,
        },
      });

      // 2. Logic tự động sinh ghế khớp 100% Seed.ts
      const seats = [];
      const rowLabels = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

      for (let r = 0; r < dto.total_rows; r++) {
        const rowChar = rowLabels[r];
        
        for (let c = 1; c <= dto.cols_per_row; c++) {
          let type: SeatType = SeatType.NORMAL;
          let extra = 0;

          // PHÂN LOẠI THEO LOẠI PHÒNG (RoomType)
          if (dto.room_type === RoomType.GOLD_CLASS ) {
            type = SeatType.VIP;
            extra = 50000;
          } 
          // PHÂN LOẠI THEO VỊ TRÍ (Hàng ghế) CHO PHÒNG THƯỜNG
          else {
            // Hàng giữa (D-J) thường là VIP
            if (['D', 'E', 'F', 'G', 'H', 'I', 'J'].includes(rowChar)) {
              type = SeatType.VIP;
              extra = 20000;
            } 
            // Hàng cuối cùng luôn là SWEETBOX (Ghế đôi)
            else if (r === dto.total_rows - 1) {
              type = SeatType.SWEETBOX;
              extra = 40000;
            }
          }

          seats.push({
            room_id: room.id,
            row: rowChar,
            number: c,
            type: type,
            price_extra: extra,
          });
        }
      }

      await tx.seat.createMany({ data: seats });
      return room;
    });
  }

  async getRoomSeats(roomId: number) {
    const room = await this.prisma.room.findUnique({
      where: { id: roomId },
      include: { 
        seats: {
          orderBy: [{ row: 'asc' }, { number: 'asc' }]
        },
        cinema: true
      }
    });
    if (!room) throw new NotFoundException('Không tìm thấy phòng chiếu');
    return room;
  }

  async findAll(cinema_id?: number) {
    return await this.prisma.room.findMany({
      where: cinema_id ? { cinema_id } : {},
      include: {
        cinema: { select: { name: true } },
        _count: { select: { seats: true } }
      },
      orderBy: { id: 'desc' },
    });
  }

  async findOne(id: number) {
    const room = await this.prisma.room.findUnique({
      where: { id },
      include: { cinema: true, _count: { select: { seats: true } } }
    });
    if (!room) throw new NotFoundException('Phòng không tồn tại');
    return room;
  }

  async updateRoom(id: number, dto: UpdateRoomDto) {
    const room = await this.prisma.room.findUnique({ where: { id } });
    if (!room) throw new NotFoundException('Phòng không tồn tại');

    // Nếu thay đổi cấu trúc (rows/cols), cần kiểm tra xem đã có suất chiếu chưa
    if (dto.total_rows || dto.cols_per_row) {
      const hasShowtimes = await this.prisma.showtime.findFirst({ where: { room_id: id } });
      if (hasShowtimes) {
        throw new BadRequestException('Không thể thay đổi cấu trúc phòng đã có suất chiếu');
      }
      
      // Logic: Nếu Admin cố tình đổi, ta phải xóa sạch ghế cũ và chạy lại vòng lặp tạo ghế mới
      // (Phần này có thể mở rộng tùy theo quy trình của bạn)
    }

    return this.prisma.room.update({
      where: { id },
      data: dto
    });
  }

  async deleteRoom(id: number) {
    // Ràng buộc: Không xóa phòng nếu đang có suất chiếu (Showtime)
    const hasShowtimes = await this.prisma.showtime.findFirst({ where: { room_id: id } });
    if (hasShowtimes) {
      throw new BadRequestException('Phòng đang có suất chiếu, không thể xóa');
    }

    return await this.prisma.$transaction(async (tx) => {
      await tx.seat.deleteMany({ where: { room_id: id } });
      return tx.room.delete({ where: { id } });
    });
  }
}