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
exports.BookingsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const client_1 = require("@prisma/client");
let BookingsService = class BookingsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createBooking(userId, dto) {
        return await this.prisma.$transaction(async (tx) => {
            if (!dto.showtime_seat_ids?.length || dto.showtime_seat_ids.length > 8) {
                throw new common_1.BadRequestException('Số lượng ghế không hợp lệ (1-8 ghế)');
            }
            const [showtime, targetSeats] = await Promise.all([
                tx.showtime.findUnique({ where: { id: dto.showtime_id } }),
                tx.showtimeSeat.findMany({
                    where: { id: { in: dto.showtime_seat_ids }, showtime_id: dto.showtime_id },
                    include: { seat: true }
                }),
            ]);
            if (!showtime)
                throw new common_1.NotFoundException('Suất chiếu không tồn tại');
            if (targetSeats.length !== dto.showtime_seat_ids.length) {
                throw new common_1.BadRequestException('Một số ghế chọn không thuộc suất chiếu này');
            }
            const existingTickets = await tx.ticket.findMany({
                where: { showtime_seat_id: { in: dto.showtime_seat_ids } }
            });
            if (existingTickets.length > 0) {
                throw new common_1.BadRequestException('Một số ghế bạn chọn đã được xuất vé rồi, vui lòng chọn ghế khác');
            }
            const updateResult = await tx.showtimeSeat.updateMany({
                where: {
                    id: { in: dto.showtime_seat_ids },
                    status: 'AVAILABLE',
                },
                data: { status: 'BOOKED' },
            });
            if (updateResult.count !== dto.showtime_seat_ids.length) {
                throw new common_1.BadRequestException('Một hoặc nhiều ghế đã có người khác đặt nhanh hơn');
            }
            let totalAmount = 0;
            const ticketsToCreate = targetSeats.map((ss) => {
                const finalPrice = Number(ss.price_base);
                totalAmount += finalPrice;
                return {
                    showtime_id: dto.showtime_id,
                    seat_id: ss.seat_id,
                    showtime_seat_id: ss.id,
                    price: finalPrice,
                    status: client_1.TicketStatus.BOOKING,
                };
            });
            const foodData = [];
            if (dto.foods?.length) {
                const dbFoods = await tx.food.findMany({
                    where: { id: { in: dto.foods.map(f => f.food_id) }, is_available: true },
                });
                for (const item of dto.foods) {
                    const f = dbFoods.find(df => df.id === item.food_id);
                    if (!f)
                        throw new common_1.BadRequestException(`Món ăn ID ${item.food_id} không khả dụng`);
                    const itemPrice = Number(f.price);
                    const itemQuantity = Number(item.quantity);
                    const itemTotalPrice = itemPrice * itemQuantity;
                    totalAmount += itemTotalPrice;
                    foodData.push({
                        food_id: f.id,
                        quantity: itemQuantity,
                        price: itemPrice,
                        total_price: itemTotalPrice,
                    });
                }
            }
            let promotionId = null;
            if (dto.promotion_code) {
                const promo = await tx.promotion.findUnique({ where: { code: dto.promotion_code } });
                const now = new Date();
                if (promo?.is_active &&
                    promo.start_date <= now &&
                    promo.end_date >= now &&
                    promo.used_count < (promo.usage_limit || Infinity) &&
                    totalAmount >= Number(promo.min_order_value)) {
                    let discount = promo.discount_type === 'PERCENT'
                        ? totalAmount * (Number(promo.discount_value) / 100)
                        : Number(promo.discount_value);
                    if (promo.discount_type === 'PERCENT' && promo.max_discount) {
                        discount = Math.min(discount, Number(promo.max_discount));
                    }
                    totalAmount = Math.max(0, totalAmount - discount);
                    promotionId = promo.id;
                    await tx.promotion.update({
                        where: { id: promo.id },
                        data: { used_count: { increment: 1 } }
                    });
                }
            }
            return await tx.booking.create({
                data: {
                    user_id: userId,
                    showtime_id: dto.showtime_id,
                    promotion_id: promotionId,
                    total_amount: totalAmount,
                    status: client_1.BookingStatus.PENDING,
                    tickets: { create: ticketsToCreate },
                    booking_foods: { create: foodData },
                },
                include: { tickets: true }
            });
        }, { isolationLevel: 'Serializable' });
    }
    async getHistoryByUserId(userId) {
        return await this.prisma.booking.findMany({
            where: { user_id: userId },
            include: {
                showtime: {
                    include: {
                        movie: true,
                        room: { include: { cinema: true } },
                    },
                },
                tickets: { include: { seat: true } },
                booking_foods: { include: { food: true } },
            },
            orderBy: { created_at: 'desc' },
        });
    }
    async findAllForAdmin(query) {
        const { status, search, page, limit } = query;
        const skip = (page - 1) * limit;
        const where = {};
        if (status)
            where.status = status;
        if (search) {
            where.OR = [
                { id: !isNaN(Number(search)) ? Number(search) : undefined },
                { user: { full_name: { contains: search } } },
                { user: { email: { contains: search } } },
            ];
        }
        const [items, total] = await Promise.all([
            this.prisma.booking.findMany({
                where,
                skip,
                take: limit,
                include: {
                    user: { select: { id: true, full_name: true, email: true } },
                    showtime: { include: { movie: { select: { title: true } }, room: { include: { cinema: true } } } },
                    tickets: { include: { seat: true } },
                    booking_foods: { include: { food: true } },
                },
                orderBy: { created_at: 'desc' },
            }),
            this.prisma.booking.count({ where }),
        ]);
        return { items, total, page, lastPage: Math.ceil(total / limit) };
    }
    async deleteBooking(id) {
        return await this.prisma.booking.delete({ where: { id } });
    }
    async updateStatus(id, status) {
        return await this.prisma.$transaction(async (tx) => {
            const updatedBooking = await tx.booking.update({
                where: { id },
                data: { status: status }
            });
            await tx.ticket.updateMany({
                where: { booking_id: id },
                data: { status: status === 'SUCCESS' ? 'SUCCESS' : 'FAILED' }
            });
            if (status === 'SUCCESS') {
                const tickets = await tx.ticket.findMany({ where: { booking_id: id } });
                const seatIds = tickets.map(t => t.showtime_seat_id);
                await tx.showtimeSeat.updateMany({
                    where: { id: { in: seatIds } },
                    data: { status: 'SOLD' }
                });
            }
            return updatedBooking;
        });
    }
    async getBookingDetail(id) {
        const booking = await this.prisma.booking.findUnique({
            where: { id },
            include: {
                user: { select: { id: true, full_name: true, email: true, phone: true } },
                showtime: {
                    include: {
                        movie: true,
                        room: { include: { cinema: true } }
                    }
                },
                tickets: { include: { seat: true } },
                booking_foods: { include: { food: true } },
                promotion: true,
            },
        });
        if (!booking)
            throw new common_1.NotFoundException('Không tìm thấy đơn hàng');
        return booking;
    }
};
exports.BookingsService = BookingsService;
exports.BookingsService = BookingsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], BookingsService);
//# sourceMappingURL=bookings.service.js.map