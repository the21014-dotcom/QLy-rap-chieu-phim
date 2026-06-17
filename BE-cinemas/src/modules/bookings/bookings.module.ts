import { Module } from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { BookingsController } from './bookings.controller';
import { PromotionsModule } from '../promotions/promotions.module';
import { BookingsProcessor } from './bookings.processor';

@Module({
  imports: [PromotionsModule],
  controllers: [BookingsController],
  providers: [BookingsService, BookingsProcessor],
})
export class BookingsModule {}
