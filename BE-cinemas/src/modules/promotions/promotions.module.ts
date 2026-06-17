// src/modules/promotions/promotions.module.ts
import { Module } from '@nestjs/common';
import { PromotionsService } from './promotions.service';
import { PromotionsController } from './promotions.controller';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [PromotionsController],
  providers: [PromotionsService],
  exports: [PromotionsService], // BẮT BUỘC: Export để BookingService có thể dùng được
})
export class PromotionsModule {}