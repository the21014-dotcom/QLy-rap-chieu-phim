// src/modules/chat/dto/chat.dto.ts

import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  Min,
  Max,
  Length,
  IsEnum,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

// Enum cho các loại tin nhắn
export enum MessageType {
  TEXT = 'TEXT',
  VOICE = 'VOICE',
  IMAGE = 'IMAGE',
}

// DTO cho tin nhắn chat
export class ChatDto {
  @ApiProperty({
    description: 'Nội dung tin nhắn của người dùng',
    example: 'Cho mình hỏi lịch chiếu phim Doraemon hôm nay?',
  })
  @IsString({ message: 'Tin nhắn phải là chuỗi văn bản' })
  @IsNotEmpty({ message: 'Tin nhắn không được để trống' })
  @Length(1, 1000, { message: 'Tin nhắn phải từ 1-1000 ký tự' })
  message: string;

  @ApiPropertyOptional({
    description: 'ID của người dùng (nếu đã đăng nhập)',
    example: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'User ID phải là số' })
  @Min(1, { message: 'User ID phải lớn hơn 0' })
  userId?: number;

  @ApiPropertyOptional({
    description: 'Loại tin nhắn',
    enum: MessageType,
    default: MessageType.TEXT,
  })
  @IsOptional()
  @IsEnum(MessageType, { message: 'Loại tin nhắn không hợp lệ' })
  messageType?: MessageType = MessageType.TEXT;

  @ApiPropertyOptional({
    description: 'ID phiên chat (để lưu lịch sử)',
    example: 'session-123',
  })
  @IsOptional()
  @IsString({ message: 'Session ID phải là chuỗi' })
  sessionId?: string;

  @ApiPropertyOptional({
    description: 'Ngôn ngữ của tin nhắn',
    example: 'vi',
  })
  @IsOptional()
  @IsString({ message: 'Ngôn ngữ phải là chuỗi' })
  language?: string = 'vi';
}

// DTO cho yêu cầu đánh giá phim
export class RateMovieDto {
  @ApiProperty({
    description: 'ID phim cần đánh giá',
    example: 1,
  })
  @IsNumber({}, { message: 'Movie ID phải là số' })
  @Min(1, { message: 'Movie ID không hợp lệ' })
  movieId: number;

  @ApiProperty({
    description: 'Điểm đánh giá (1-5 sao)',
    example: 5,
  })
  @IsNumber({}, { message: 'Rating phải là số' })
  @Min(1, { message: 'Rating tối thiểu là 1 sao' })
  @Max(5, { message: 'Rating tối đa là 5 sao' })
  rating: number;

  @ApiPropertyOptional({
    description: 'Nội dung đánh giá',
    example: 'Phim rất hay, khuyến khích mọi người xem!',
  })
  @IsOptional()
  @IsString({ message: 'Content phải là chuỗi' })
  @Length(0, 500, { message: 'Nội dung tối đa 500 ký tự' })
  content?: string;
}

// DTO cho yêu cầu tìm kiếm phim
export class SearchMovieDto {
  @ApiProperty({
    description: 'Từ khóa tìm kiếm',
    example: 'Doraemon',
  })
  @IsString({ message: 'Từ khóa phải là chuỗi' })
  @IsNotEmpty({ message: 'Từ khóa không được để trống' })
  keyword: string;

  @ApiPropertyOptional({
    description: 'Số lượng kết quả trả về',
    default: 10,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'Limit phải là số' })
  @Min(1, { message: 'Limit tối thiểu là 1' })
  @Max(50, { message: 'Limit tối đa là 50' })
  limit?: number = 10;
}

// DTO cho phản hồi chat
export class ChatResponseDto {
  @ApiProperty({ description: 'Nội dung phản hồi' })
  reply: string;

  @ApiProperty({ description: 'Loại phản hồi' })
  type: 'TEXT' | 'MOVIE_LIST' | 'SHOWTIME_LIST' | 'BOOKING_INFO' | 'ERROR';

  @ApiPropertyOptional({ description: 'Dữ liệu bổ sung' })
  data?: Record<string, unknown>;

  @ApiPropertyOptional({ description: 'Gợi ý câu hỏi tiếp theo' })
  suggestions?: string[];
}