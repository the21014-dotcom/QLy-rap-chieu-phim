// src/modules/bookings/dto/create-booking.dto.ts
import { IsArray, IsInt, IsOptional, IsString, Min, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class FoodItemDto {
  @IsInt()
  food_id: number;

  @IsInt()
  @Min(1)
  quantity: number;
}

export class CreateBookingDto {
  @IsInt()
  showtime_id: number;

  @IsArray()
  @IsInt({ each: true })
  showtime_seat_ids: number[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => FoodItemDto)
  foods?: FoodItemDto[];

  @IsOptional()
  @IsString()
  promotion_code?: string;
}