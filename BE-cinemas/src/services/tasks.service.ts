// src/services/tasks.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TasksService {
  private readonly logger = new Logger(TasksService.name);
  constructor(private prisma: PrismaService) {}

  @Cron(CronExpression.EVERY_MINUTE) // Chạy mỗi phút 1 lần
  async handleExpiredSeats() {
    const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000);

    const deleted = await this.prisma.showtimeSeat.deleteMany({
      where: {
        status: 'HOLDING',
        held_at: { lt: tenMinutesAgo } // Những ghế giữ trước 10 phút trước
      }
    });

    if (deleted.count > 0) {
      this.logger.log(`🧹 Đã giải phóng ${deleted.count} ghế hết hạn thanh toán.`);
    }
  }
}