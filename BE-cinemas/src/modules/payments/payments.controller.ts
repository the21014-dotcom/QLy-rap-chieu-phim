import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Param, 
  HttpStatus, 
  ParseIntPipe,
  Logger,
  UseGuards
} from '@nestjs/common';
import { PaymentService } from './payments.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CreatePaymentDto } from './dto/create-payment.dto';

@Controller('payments')
export class PaymentsController {
  private readonly logger = new Logger(PaymentsController.name);

  constructor(private readonly paymentService: PaymentService) {}
 
  @Get('booking-detail/:id')
  async getDetail(@Param('id', ParseIntPipe) id: number) {
    return this.paymentService.getBookingDetail(id);
  }
  @Post('confirm-manual')
  async confirmManualPayment(
    @Body('bookingId', ParseIntPipe) bookingId: number,
    @Body('orderInfo') orderInfo: string,
  ) {
    return this.paymentService.processManualPayment(bookingId, orderInfo);
  }
 
  @Post('process-manual')
async processManualPayment(@Body() dto: CreatePaymentDto) {
  this.logger.log(`Khởi tạo thanh toán thủ công cho Booking #${dto.bookingId}`);
  
  // Gọi hàm xử lý thanh toán cứng (SUCCESS luôn) từ service
  // Truyền kèm một chuỗi orderInfo mặc định
  const result = await this.paymentService.processManualPayment(
    dto.bookingId, 
    "Thanh toán tại quầy/Chuyển khoản nhanh"
  );
  
  // Trả về kết quả sạch, không chứa field "status" gây nhiễu
  return { 
    message: 'Thanh toán thành công',
    bookingId: dto.bookingId,
    paymentId: result.paymentId
  };
}
  
  /**
   * 2. CHI TIẾT VÉ (DÙNG CHO TRANG CHI TIẾT SAU CHECKOUT)
   * Hiển thị đầy đủ thông tin: Phim, Rạp, Ghế, Đồ ăn, Tổng tiền
   */
  @Get('booking-detail/:id')
  async getBookingDetail(@Param('id', ParseIntPipe) id: number) {
    const booking = await this.paymentService.getBookingDetail(id);
    return {
      status: HttpStatus.OK,
      data: booking
    };
  }
  
}