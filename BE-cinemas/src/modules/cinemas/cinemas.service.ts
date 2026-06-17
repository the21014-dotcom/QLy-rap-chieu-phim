import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service'; // Đảm bảo đúng đường dẫn PrismaService
import { CreateCinemaDto } from './dto/create-cinema.dto';
import { UpdateCinemaDto } from './dto/update-cinema.dto';

@Injectable()
export class CinemasService {
  constructor(private prisma: PrismaService) {}

  async create(createCinemaDto: CreateCinemaDto) {
    return this.prisma.cinema.create({
      data: createCinemaDto,
    });
  }

  async findAll() {
    return this.prisma.cinema.findMany({
      include: {
        _count: {
          select: { rooms: true }, // Lấy số lượng phòng chiếu mà không cần load hết data phòng
        },
        rooms: true, // Nếu cần danh sách chi tiết phòng
      },
      orderBy: { id: 'desc' },
    });
  }

  async findOne(id: number) {
    const cinema = await this.prisma.cinema.findUnique({
      where: { id },
      include: { rooms: true },
    });

    if (!cinema) {
      throw new NotFoundException(`Cụm rạp với ID ${id} không tồn tại`);
    }
    return cinema;
  }

  async update(id: number, updateCinemaDto: UpdateCinemaDto) {
    // Kiểm tra tồn tại trước khi update
    await this.findOne(id);

    return this.prisma.cinema.update({
      where: { id },
      data: updateCinemaDto,
    });
  }

  async remove(id: number) {
    // Kiểm tra tồn tại
    await this.findOne(id);

    // Lưu ý: Prisma sẽ lỗi nếu xóa Cinema mà vẫn còn Room (do quan hệ onDelete: Cascade chưa được set ở Cinema side)
    // Nhưng trong schema của bạn đã có onDelete: Cascade ở phía Room, nên xóa Cinema sẽ tự xóa Room liên quan.
    return this.prisma.cinema.delete({
      where: { id },
    });
  }
}