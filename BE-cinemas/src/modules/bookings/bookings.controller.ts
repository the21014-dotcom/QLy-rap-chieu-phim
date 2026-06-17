// src/modules/bookings/bookings.controller.ts
import { 
  Controller, 
  Post, 
  Get, 
  Body,
  Patch, 
  Delete,
  UseGuards, 
  Req, 
  Query, 
  BadRequestException, 
  Param,
  ParseIntPipe
} from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard'; 
import { RolesGuard } from '../../auth/guards/roles.guard'; // Giả định bạn có guard phân quyền
import { Roles } from '../../auth/decorators/roles.decorator'; // Giả định bạn có decorator roles
import { PaymentService } from '../payments/payments.service'; 

@Controller('bookings')
export class BookingsController {
  constructor(
    private readonly bookingsService: BookingsService,
    private readonly paymentService: PaymentService
  ) {}
   
  @UseGuards(JwtAuthGuard)
@Get('user/history')
async getUserBookings(@Req() req: any) {
  const userId = req.user.userId || req.user.id;
  // Giả sử bạn viết hàm này trong service để query từ Prisma
  return this.bookingsService.getHistoryByUserId(userId);
}
  /**
   * 1. TẠO MỚI ĐƠN HÀNG & LẤY LINK THANH TOÁN
   * POST /bookings
   */
 // src/modules/bookings/bookings.controller.ts
 // Thêm vào BookingsController
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
@Patch(':id')
async update(@Param('id', ParseIntPipe) id: number, @Body('status') status: any) {
  return this.bookingsService.updateStatus(id, status);
}

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
@Delete(':id')
async remove(@Param('id', ParseIntPipe) id: number) {
  return this.bookingsService.deleteBooking(id);
}

@UseGuards(JwtAuthGuard)
@Post()
async createBooking(@Req() req: any, @Body() dto: CreateBookingDto) {
  const userId = req.user.userId || req.user.id;

  if (!userId) {
    throw new BadRequestException('Không tìm thấy ID người dùng.');
  }

  try {
    // 1. Tạo booking với trạng thái ban đầu (ví dụ: PENDING)
    const booking = await this.bookingsService.createBooking(userId, dto);

    // 2. Trả về thông tin đơn hàng luôn, không gọi sang PaymentService tạo link VNPay nữa
    return {
      message: 'Đơn hàng đã được khởi tạo thành công!',
      bookingId: booking.id,
      totalAmount: booking.total_amount,
      status: booking.status // Thường là PENDING hoặc WAITING_FOR_PAYMENT
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Đặt vé thất bại!';
    throw new BadRequestException(message);
  }
}
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN') // Chỉ admin mới được xem tất cả hóa đơn
@Get('admin/all')
async getAllForAdmin(@Query() query: any) {
  return this.bookingsService.findAllForAdmin({
    status: query.status,
    search: query.search,
    page: Number(query.page) || 1,
    limit: Number(query.limit) || 10
  });
}
}