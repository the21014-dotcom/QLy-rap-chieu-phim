import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class BannersService {
  constructor(private prisma: PrismaService) {}

  /**
   * Lấy danh sách Banner đang hoạt động cho khách hàng
   * Ưu tiên hiển thị theo độ ưu tiên (priority) cao nhất, sau đó mới đến ngày tạo
   */
  async findActive() {
    return await this.prisma.banner.findMany({
      where: { is_active: true },
      include: {
        movie: {
          select: {
            id: true,
            title: true,
            rating: true,
            release_date: true,
          },
        },
      },
      orderBy: [
        { priority: 'desc' }, // Banner có priority 10 hiện trước priority 1
        { created_at: 'desc' }, // Priority bằng nhau thì cái nào mới hơn hiện trước
      ],
    });
  }

  /**
   * Lấy tất cả Banner cho trang Quản trị
   */
  async findAll() {
    try {
      return await this.prisma.banner.findMany({
        include: {
          movie: {
            select: {
              id: true,
              title: true,
            },
          },
        },
        orderBy: {
          created_at: 'desc',
        },
      });
    } catch (error) {
      throw new InternalServerErrorException('Lỗi khi truy vấn danh sách banner');
    }
  }

  /**
   * Tìm chi tiết 1 banner
   */
  async findOne(id: number) {
    const banner = await this.prisma.banner.findUnique({
      where: { id },
      include: {
        movie: {
          select: {
            id: true,
            title: true,
            //image_url: true,
            poster_url: true,    // Đổi thành poster_url
          landscape_url: true,
          },
        },
      },
    });

    if (!banner) {
      throw new NotFoundException(`Banner với ID #${id} không tồn tại`);
    }

    return banner;
  }

  /**
   * Tạo Banner mới
   * Sử dụng Prisma.BannerCreateInput để đảm bảo Type Safety
   */
  async create(data: Prisma.BannerCreateInput) {
    return await this.prisma.banner.create({
      data,
    });
  }

  /**
   * Cập nhật Banner
   */
  async update(id: number, data: Prisma.BannerUpdateInput) {
    // Kiểm tra tồn tại trước khi cập nhật
    await this.findOne(id);

    return await this.prisma.banner.update({
      where: { id },
      data: {
        ...data,
        updated_at: new Date(), // Đảm bảo luôn cập nhật thời gian sửa
      },
    });
  }

  /**
   * Xóa Banner
   */
  async remove(id: number) {
    await this.findOne(id);
    return await this.prisma.banner.delete({
      where: { id },
    });
  }

  /**
   * Logic bổ sung: Thay đổi trạng thái nhanh (Ẩn/Hiện)
   */
  async toggleStatus(id: number) {
    const banner = await this.findOne(id);
    return await this.prisma.banner.update({
      where: { id },
      data: { is_active: !banner.is_active },
    });
  }
}