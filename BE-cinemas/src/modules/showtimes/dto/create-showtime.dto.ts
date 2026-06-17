import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  IsISO8601,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateShowtimeDto {
  @IsNumber()
  @IsNotEmpty({ message: 'movie_id không được để trống' })
  @Type(() => Number)
  movie_id: number;

  @IsNumber()
  @IsNotEmpty({ message: 'room_id không được để trống' })
  @Type(() => Number)
  room_id: number;

  /**
   * Dùng @IsISO8601 thay vì @IsDate để nhận string từ JSON body
   * Ví dụ: "2026-05-25T19:00:00" hoặc "2026-05-25T19:00:00+07:00"
   * Service sẽ dùng moment-timezone để parse sang giờ Việt Nam
   */
  @IsISO8601({}, { message: 'start_time phải đúng định dạng ISO8601 (VD: 2026-05-25T19:00:00)' })
  @IsNotEmpty({ message: 'start_time không được để trống' })
  start_time: string;

  @IsNumber()
  @Min(0, { message: 'price_base không được âm' })
  @IsNotEmpty({ message: 'price_base không được để trống' })
  @Type(() => Number)
  price_base: number;
}

export class UpdateShowtimeDto {
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  movie_id?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  room_id?: number;

  @IsOptional()
  @IsISO8601({}, { message: 'start_time phải đúng định dạng ISO8601' })
  start_time?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  price_base?: number;
}