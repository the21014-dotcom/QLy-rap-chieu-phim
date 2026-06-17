import { Injectable, BadRequestException, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateFeedbackDto } from './dto/create-feedback.dto';
import { UpdateFeedbackDto } from './dto/update-feedback.dto';

@Injectable()
export class FeedbacksService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * 1. TẠO ĐÁNH GIÁ MỚI (Hỗ trợ Seeding cho Admin)
   */
  async createFeedback(currentUserId: number, role: string, dto: CreateFeedbackDto) {

const roleName = (role && typeof role === 'object') 
    ? (role as { name: string }).name 
    : (role as string || '');

  // 2. Xác định targetUserId dựa trên roleName đã chuẩn hóa
  const targetUserId = (roleName.toUpperCase() === 'ADMIN' && dto.user_id) 
    ? Number(dto.user_id) 
    : currentUserId;

  // 3. Logic kiểm tra quyền
  if (roleName.toUpperCase() !== 'ADMIN') {
      const hasBooked = await this.prisma.booking.findFirst({
        where: {
          user_id: targetUserId,
          status: 'SUCCESS',
          showtime: { movie_id: dto.movie_id },
        },
      });

      if (!hasBooked) {
        throw new BadRequestException('Bạn cần mua vé xem phim này trước khi để lại đánh giá.');
      }

      const existingFeedback = await this.prisma.feedback.findFirst({
        where: { user_id: targetUserId, movie_id: dto.movie_id },
      });

      if (existingFeedback) {
        throw new BadRequestException('Mỗi phim bạn chỉ có thể đánh giá một lần.');
      }
    }

    // Tạo feedback
    return await this.prisma.feedback.create({
      data: {
        user_id: targetUserId,
        movie_id: dto.movie_id,
        content: dto.content,
        rating: dto.rating,
      },
      include: { 
        user: { select: { full_name: true, avatar: true } } 
      }
    });
  }

  /**
   * 2. LẤY DANH SÁCH ĐÁNH GIÁ CỦA MỘT PHIM (Client)
   */
  async getMovieFeedbacks(movieId: number) {
    return await this.prisma.feedback.findMany({
      where: { movie_id: movieId },
      include: {
        user: { select: { id: true, full_name: true, avatar: true } },
      },
      orderBy: { created_at: 'desc' },
    });
  }

  /**
   * 3. LẤY TẤT CẢ ĐÁNH GIÁ (Admin Management)
   */
  async getAllFeedbacks() {
    return this.prisma.feedback.findMany({
      include: {
        user: { select: { full_name: true, email: true, avatar: true } },
        movie: { select: { title: true } },
      },
      orderBy: { created_at: 'desc' },
    });
  }

  /**
   * 4. LẤY CHI TIẾT MỘT ĐÁNH GIÁ
   */
  async getFeedbackDetail(id: number) {
    const feedback = await this.prisma.feedback.findUnique({
      where: { id },
      include: {
        user: { select: { full_name: true, avatar: true } },
        movie: { select: { title: true } }
      }
    });
    if (!feedback) throw new NotFoundException('Không tìm thấy đánh giá này');
    return feedback;
  }

  /**
   * 5. CHỈNH SỬA ĐÁNH GIÁ
   */
  async updateFeedback(id: number, userId: number, role: string, dto: UpdateFeedbackDto) {
    const feedback = await this.prisma.feedback.findUnique({ where: { id } });
    if (!feedback) throw new NotFoundException('Không tìm thấy đánh giá');

    if (feedback.user_id !== userId && role !== 'ADMIN') {
      throw new ForbiddenException('Bạn không có quyền chỉnh sửa đánh giá này');
    }

    return await this.prisma.feedback.update({
      where: { id },
      data: {
        content: dto.content,
        rating: dto.rating,
      },
    });
  }

  /**
   * 6. XÓA ĐÁNH GIÁ
   */
  async removeFeedback(id: number, userId: number, role: string) {
    const feedback = await this.prisma.feedback.findUnique({ where: { id } });
    if (!feedback) throw new NotFoundException('Đánh giá không tồn tại');

    if (role !== 'ADMIN' && feedback.user_id !== userId) {
      throw new ForbiddenException('Bạn không có quyền xóa đánh giá này');
    }

    return await this.prisma.feedback.delete({ where: { id } });
  }
}