import { IsString, IsNotEmpty, IsOptional, IsNumber, IsBoolean, IsEnum, IsArray, IsDateString } from 'class-validator';
import { MovieRating } from '@prisma/client'; // Import Enum từ Prisma

export class CreateMovieDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional() // Trong Prisma bạn để String?
  description?: string;

  @IsNumber()
  @IsNotEmpty()
  duration: number; // Trong Prisma là Int (không để @IsOptional)

  @IsEnum(MovieRating) // Khớp với Enum trong Prisma (P, C13, C16, C18)
  @IsOptional()
 rating?: MovieRating = MovieRating.P;

  @IsString()
  @IsOptional()
  director?: string;

  @IsString()
  @IsOptional()
  actors?: string;

  @IsString()
  @IsOptional()
  language?: string;

  @IsDateString() // Dùng IsDateString để validate định dạng ISO8601 từ Frontend gửi lên
  @IsOptional()
  release_date?: string;

  @IsDateString()
  @IsOptional()
  end_date?: string;

  @IsString()
  @IsOptional()
  poster_url?: string;

  @IsString()
  @IsOptional()
  landscape_url?: string;

  @IsString()
  @IsOptional()
  trailer_url?: string;

  @IsBoolean()
  @IsOptional()
  is_active?: boolean;

  @IsArray()
  @IsNumber({}, { each: true })
  @IsOptional()
  genre_ids?: number[]; // Cực kỳ quan trọng để lưu Thể loại
}