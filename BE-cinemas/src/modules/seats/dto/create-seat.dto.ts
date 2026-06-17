import { IsInt, IsString, IsEnum, Min, IsOptional } from 'class-validator';
import { SeatType } from '@prisma/client';

export class CreateSeatDto {
  @IsInt()
  @Min(1)
  room_id: number;

  @IsString()
  row: string; // A, B, C...

  @IsInt()
  @Min(1)
  number: number;

  @IsEnum(SeatType)
  type: SeatType;

  @IsInt()
  @IsOptional()
  price_extra?: number;
}

export class UpdateSeatDto {
  @IsString()
  @IsOptional()
  row?: string;

  @IsInt()
  @IsOptional()
  number?: number;

  @IsEnum(SeatType)
  @IsOptional()
  type?: SeatType;

  @IsInt()
  @IsOptional()
  price_extra?: number;
}

export class GenerateRoomSeatsDto {
  @IsInt()
  @Min(1)
  rows: number;

  @IsInt()
  @Min(1)
  cols: number;

  @IsOptional()
  room_type?: string; // Để override logic tự động
}