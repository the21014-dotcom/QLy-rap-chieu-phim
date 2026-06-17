// ticket-cleanup.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class TicketCleanupService {
  private readonly logger = new Logger(TicketCleanupService.name);
  constructor(private prisma: PrismaService) {}

  @Cron(CronExpression.EVERY_MINUTE)
  async handleExpiredBookings() {
    const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000);
    
    const result = await this.prisma.ticket.deleteMany({
      where: {
        status: 'BOOKING',
        created_at: { lt: tenMinutesAgo }
      }
    });

    if (result.count > 0) {
      this.logger.log(`🧹 Đã giải phóng ${result.count} ghế quá hạn thanh toán.`);
    }
  }
}