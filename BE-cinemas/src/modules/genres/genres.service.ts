import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
// 1. THÊM IMPORT DTO Ở ĐÂY
import { CreateGenreDto } from './dto/create-genre.dto';
import { UpdateGenreDto } from './dto/update-genre.dto';

@Injectable()
export class GenresService {
  constructor(private prisma: PrismaService) {}

  async create(createGenreDto: CreateGenreDto) {
    try {
      return await this.prisma.genre.create({
        // Sử dụng dữ liệu từ DTO
        data: { name: createGenreDto.name, description: createGenreDto.description },
      });
    } catch (error: any) { // 2. ÉP KIỂU ANY ĐỂ DÙNG .code
      if (error.code === 'P2002') {
        throw new ConflictException('Tên thể loại này đã tồn tại');
      }
      throw error;
    }
  }

  async findAll() {
    return await this.prisma.genre.findMany({
      include: {
        _count: {
          select: { movies: true },
        },
      },
      orderBy: { id: 'desc' },
    });
  }

  async findOne(id: number) {
    const genre = await this.prisma.genre.findUnique({
      where: { id },
      include: {
        movies: {
          include: {
            movie: true,
          },
        },
      },
    });

    if (!genre) {
      throw new NotFoundException(`Không tìm thấy thể loại với ID ${id}`);
    }
    return genre;
  }

  async update(id: number, updateGenreDto: UpdateGenreDto) {
    await this.findOne(id); 
    try {
      return await this.prisma.genre.update({
        where: { id },
        data: { name: updateGenreDto.name, description: updateGenreDto.description },
      });
    } catch (error: any) {
      // 3. SỬA LỖI CHÍNH TẢ error.code_ THÀNH error.code
      if (error.code === 'P2002') {
        throw new ConflictException('Tên thể loại mới đã tồn tại');
      }
      throw error;
    }
  }

  async remove(id: number) {
    await this.findOne(id);
    return await this.prisma.genre.delete({
      where: { id },
    });
  }
}