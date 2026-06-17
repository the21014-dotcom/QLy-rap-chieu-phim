import { Module, Global } from '@nestjs/common';
import { PaymentService } from './payments.service'; // Chỉnh lại path cho đúng
import { PaymentsController } from './payments.controller';

@Global() // Dùng @Global() để các module khác (như Bookings) không cần import lại
@Module({
  controllers: [PaymentsController],
  providers: [PaymentService],
  exports: [PaymentService],
})
export class PaymentsModule {}