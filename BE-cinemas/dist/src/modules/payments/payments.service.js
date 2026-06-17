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
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const client_1 = require("@prisma/client");
let PaymentService = class PaymentService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getBookingDetail(bookingId) {
        const booking = await this.prisma.booking.findUnique({
            where: { id: bookingId },
            include: {
                user: { select: { full_name: true, email: true, phone: true } },
                showtime: {
                    include: {
                        movie: true,
                        room: {
                            include: { cinema: true }
                        }
                    }
                },
                tickets: {
                    include: {
                        seat: true
                    }
                },
                booking_foods: {
                    include: {
                        food: true
                    }
                },
                payment: true,
                promotion: true
            }
        });
        if (!booking) {
            throw new common_1.NotFoundException(`Không tìm thấy đơn hàng #${bookingId}`);
        }
        return booking;
    }
    async processManualPayment(bookingId, orderInfo) {
        const booking = await this.prisma.booking.findUnique({
            where: { id: bookingId },
            include: { tickets: true }
        });
        if (!booking)
            throw new common_1.NotFoundException('Đơn hàng không tồn tại');
        try {
            return await this.prisma.$transaction(async (tx) => {
                const payment = await tx.payment.upsert({
                    where: { booking_id: bookingId },
                    update: {
                        payment_method: client_1.PaymentMethod.CASH,
                        payment_status: client_1.PaymentStatus.SUCCESS,
                        order_info: orderInfo,
                        amount: booking.total_amount,
                    },
                    create: {
                        booking_id: bookingId,
                        payment_method: client_1.PaymentMethod.CASH,
                        payment_status: client_1.PaymentStatus.SUCCESS,
                        amount: booking.total_amount,
                        order_info: orderInfo,
                    },
                });
                await tx.booking.update({
                    where: { id: bookingId },
                    data: { status: client_1.BookingStatus.SUCCESS },
                });
                await tx.ticket.updateMany({
                    where: { booking_id: bookingId },
                    data: { status: client_1.TicketStatus.SUCCESS },
                });
                const seatIds = booking.tickets.map(t => t.showtime_seat_id);
                await tx.showtimeSeat.updateMany({
                    where: { id: { in: seatIds } },
                    data: { status: 'SOLD' }
                });
                return {
                    success: true,
                    message: 'Thanh toán thành công!',
                    paymentId: payment.id,
                };
            });
        }
        catch (error) {
            throw new common_1.InternalServerErrorException('Lỗi khi xử lý xác nhận thanh toán');
        }
    }
};
exports.PaymentService = PaymentService;
exports.PaymentService = PaymentService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PaymentService);
//# sourceMappingURL=payments.service.js.map