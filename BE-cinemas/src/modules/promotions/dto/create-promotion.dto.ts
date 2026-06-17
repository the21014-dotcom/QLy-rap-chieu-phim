import { IsEnum, IsNumber, IsString, IsOptional, IsDateString, Min, IsBoolean } from 'class-validator';
import { DiscountType } from '@prisma/client'; // Import trực tiếp từ Prisma client

export class CreatePromotionDto {
  @IsString()
  code: string;

  @IsString()
  description: string;

  @IsEnum(DiscountType, { message: 'Loại giảm giá phải là PERCENT hoặc FIXED' })
  discount_type: DiscountType;

  @IsNumber()
  @Min(0)
  discount_value: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  min_order_value?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  max_discount_amount?: number;

  @IsNumber()
  @Min(1)
  usage_limit: number;

  @IsDateString()
  start_date: string;

  @IsDateString()
  end_date: string;

  @IsOptional()
  @IsBoolean()
  is_active?: boolean;
}