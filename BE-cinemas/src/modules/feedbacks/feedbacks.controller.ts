import { 
  Controller, Get, Post, Body,Patch, Param, ParseIntPipe, 
  UseGuards, Req, Delete 
} from '@nestjs/common';
import { FeedbacksService } from './feedbacks.service';
import { CreateFeedbackDto } from './dto/create-feedback.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { UpdateFeedbackDto } from './dto/update-feedback.dto';

@Controller('feedbacks')
export class FeedbacksController {
  constructor(private readonly feedbacksService: FeedbacksService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(@Req() req: any, @Body() createFeedbackDto: CreateFeedbackDto) {
    // Lấy userId trực tiếp từ token sau khi qua Guard
    const userId = req.user.id; 
    const userRole = req.user.role?.name || req.user.role;
    return this.feedbacksService.createFeedback(userId, userRole,createFeedbackDto);
  }

  @Get()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
async findAll() {
  return this.feedbacksService.getAllFeedbacks(); // Trong service dùng prisma.feedback.findMany({ include: { user: true, movie: true } })
}

  @Get('movie/:movieId')
  async getByMovie(@Param('movieId', ParseIntPipe) movieId: number) {
    return this.feedbacksService.getMovieFeedbacks(movieId);
  }

  // Xem chi tiết 1 feedback
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.feedbacksService.getFeedbackDetail(id);
  }

  // Người dùng cập nhật feedback của chính mình
  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: any,
    @Body() updateFeedbackDto: UpdateFeedbackDto,
  ) {
    const userId = req.user.id;
    const userRole = req.user.role;
    return this.feedbacksService.updateFeedback(id, userId, userRole, updateFeedbackDto);
  }

  // Xóa feedback (Admin hoặc Chính người dùng đó)
  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async remove(@Param('id', ParseIntPipe) id: number, @Req() req: any) {
    const userId = req.user.id;
    const userRole = req.user.role;
    return this.feedbacksService.removeFeedback(id, userId, userRole);
  }
}