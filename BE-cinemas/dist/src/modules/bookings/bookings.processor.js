"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var BookingsProcessor_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookingsProcessor = void 0;
const common_1 = require("@nestjs/common");
const schedule_1 = require("@nestjs/schedule");
const prisma_service_1 = require("../../prisma/prisma.service");
const client_1 = require("@prisma/client");
const moment_1 = __importDefault(require("moment"));
let BookingsProcessor = BookingsProcessor_1 = class BookingsProcessor {
    constructor(prisma) {
        this.prisma = prisma;
        this.logger = new common_1.Logger(BookingsProcessor_1.name);
    }
    async handleAutoCancelBookings() {
        const expirationTime = (0, moment_1.default)().subtract(10, 'minutes').toDate();
        const expiredBookings = await this.prisma.booking.findMany({
            where: {
                status: client_1.BookingStatus.PENDING,
                created_at: { lt: expirationTime },
            },
            include: { tickets: true },
        });
        if (expiredBookings.length === 0)
            return;
        this.logger.log(`Phát hiện ${expiredBookings.length} đơn hàng quá hạn. Đang xử lý...`);
        for (const booking of expiredBookings) {
            try {
                await this.prisma.$transaction(async (tx) => {
                    await tx.booking.update({
                        where: { id: booking.id },
                        data: { status: client_1.BookingStatus.CANCELLED },
                    });
                    await tx.ticket.updateMany({
                        where: { booking_id: booking.id },
                        data: { status: client_1.TicketStatus.FAILED },
                    });
                    const ssIds = booking.tickets.map((t) => t.showtime_seat_id);
                    await tx.showtimeSeat.updateMany({
                        where: { id: { in: ssIds } },
                        data: { status: 'AVAILABLE', held_at: null },
                    });
                });
                this.logger.warn(`Đã hủy thành công đơn hàng #${booking.id}`);
            }
            catch (error) {
                this.logger.error(`Lỗi khi hủy đơn hàng #${booking.id}:`, error);
            }
        }
    }
};
exports.BookingsProcessor = BookingsProcessor;
__decorate([
    (0, schedule_1.Cron)(schedule_1.CronExpression.EVERY_MINUTE),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], BookingsProcessor.prototype, "handleAutoCancelBookings", null);
exports.BookingsProcessor = BookingsProcessor = BookingsProcessor_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], BookingsProcessor);
//# sourceMappingURL=bookings.processor.js.map