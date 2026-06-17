// src/modules/chat/chat.controller.ts

import {
  Controller,
  Post,
  Get,
  Body,
  Query,
  UseGuards,
  Req,
  HttpCode,
  HttpStatus,
  ValidationPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { ChatService } from './chat.service';
import { ChatDto, RateMovieDto, SearchMovieDto, ChatResponseDto } from './dto/chat.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { Request } from 'express';

interface AuthenticatedRequest extends Request {
  user?: { id: number; email: string };
}

@ApiTags('Chat')
@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Gửi tin nhắn chat',
    description: 'Xử lý tin nhắn của người dùng và trả về phản hồi từ AI',
  })
  @ApiResponse({
    status: 200,
    description: 'Phản hồi thành công',
    type: ChatResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Dữ liệu đầu vào không hợp lệ',
  })
  @ApiResponse({
    status: 503,
    description: 'Dịch vụ AI không khả dụng',
  })
  async handleChat(
    @Body(new ValidationPipe({ transform: true, whitelist: true })) chatDto: ChatDto,
  ): Promise<ChatResponseDto> {
    const reply = await this.chatService.getChatResponse(
      chatDto.message,
      chatDto.userId,
      chatDto.sessionId,
    );
    return reply;
  }

  @Post('rate-movie')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Đánh giá phim',
    description: 'Người dùng đã đăng nhập có thể đánh giá phim',
  })
  @ApiResponse({
    status: 200,
    description: 'Đánh giá thành công',
  })
  @ApiResponse({
    status: 401,
    description: 'Chưa đăng nhập',
  })
  async rateMovie(
    @Body(new ValidationPipe({ transform: true, whitelist: true })) rateDto: RateMovieDto,
   @Req() req: AuthenticatedRequest,
  ) {
    const userId = (req.user as any)?.id;
    return this.chatService.rateMovie(userId, rateDto);
  }

  @Post('search-movie')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Tìm kiếm phim',
    description: 'Tìm kiếm phim theo từ khóa',
  })
  @ApiResponse({
    status: 200,
    description: 'Kết quả tìm kiếm',
  })
  async searchMovie(
    @Body(new ValidationPipe({ transform: true, whitelist: true })) searchDto: SearchMovieDto,
  ) {
    return this.chatService.searchMovies(searchDto.keyword, searchDto.limit);
  }

  @Get('quick-actions')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Lấy các hành động nhanh',
    description: 'Trả về danh sách các gợi ý hành động cho người dùng',
  })
  @ApiQuery({ name: 'userId', required: false, type: Number })
  async getQuickActions(@Query('userId') userId?: number) {
    return this.chatService.getQuickActions(userId);
  }

  @Get('now-showing')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Lấy danh sách phim đang chiếu',
    description: 'Trả về danh sách phim đang chiếu hôm nay',
  })
  async getNowShowing() {
    return this.chatService.getNowShowingMovies();
  }

  @Get('suggestions')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Gợi ý phim cá nhân hóa',
    description: 'Trả về danh sách phim gợi ý cho người dùng (nếu đăng nhập)',
  })
  @ApiQuery({ name: 'userId', required: false, type: Number })
  async getSuggestions(@Query('userId') userId?: number) {
    return this.chatService.getMovieSuggestions(userId);
  }
}