import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreatePromotionDto } from './dto/create-promotion.dto';
import { DiscountType } from '@prisma/client';

@Injectable()
export class PromotionsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return await this.prisma.promotion.findMany({
      orderBy: { created_at: 'desc' } 
    });
  }

  async findOne(id: number) {
    const promo = await this.prisma.promotion.findUnique({ where: { id } });
    if (!promo) throw new NotFoundException('Mã khuyến mãi không tồn tại');
    return promo;
  }

  async create(dto: CreatePromotionDto) {
    // Kiểm tra xem mã code đã tồn tại chưa
    const existing = await this.prisma.promotion.findUnique({ where: { code: dto.code } });
    if (existing) throw new BadRequestException('Mã khuyến mãi này đã tồn tại');

    return await this.prisma.promotion.create({ 
      data: {
        ...dto,
        start_date: new Date(dto.start_date),
        end_date: new Date(dto.end_date)
      } 
    });
  }

  async update(id: number, data: any) {
    return await this.prisma.promotion.update({ 
      where: { id }, 
      data: {
        ...data,
        ...(data.start_date && { start_date: new Date(data.start_date) }),
        ...(data.end_date && { end_date: new Date(data.end_date) }),
      } 
    });
  }

  async remove(id: number) {
    return await this.prisma.promotion.delete({ where: { id } });
  }

  /**
   * Logic kiểm tra mã khuyến mãi
   */
  async validatePromotion(code: string, currentOrderAmount: number) {
    const promo = await this.prisma.promotion.findUnique({ where: { code } });

    if (!promo || !promo.is_active) {
      throw new BadRequestException('Mã khuyến mãi không tồn tại hoặc đã bị vô hiệu hóa');
    }

    const now = new Date();
    if (now < promo.start_date || now > promo.end_date) {
      throw new BadRequestException('Mã khuyến mãi đã hết hạn sử dụng');
    }

    // Kiểm tra giới hạn lượt dùng nếu có (usage_limit là optional Int?)
    if (promo.usage_limit && promo.used_count >= promo.usage_limit) {
      throw new BadRequestException('Mã khuyến mãi đã hết lượt sử dụng');
    }

    if (currentOrderAmount < promo.min_order_value) {
      throw new BadRequestException(`Đơn hàng tối thiểu ${promo.min_order_value.toLocaleString()}đ để dùng mã này`);
    }

    // Tính toán số tiền được giảm
    let discountAmount = 0;
    if (promo.discount_type === DiscountType.PERCENT) {
      discountAmount = currentOrderAmount * (promo.discount_value / 100);
      
      // SỬA TẠI ĐÂY: Khớp với tên trường 'max_discount' trong Prisma của bạn
      if (promo.max_discount && discountAmount > promo.max_discount) {
        discountAmount = promo.max_discount;
      }
    } else {
      discountAmount = promo.discount_value;
    }

    return {
      id: promo.id,
      code: promo.code,
      discount_amount: Math.round(discountAmount), // Làm tròn số tiền giảm
      final_amount: Math.max(0, currentOrderAmount - Math.round(discountAmount))
    };
  }
}