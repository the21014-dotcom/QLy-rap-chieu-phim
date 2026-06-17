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
exports.TicketsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const client_1 = require("@prisma/client");
let TicketsService = class TicketsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(createTicketDto) {
        try {
            return await this.prisma.$transaction(async (tx) => {
                const showtimeSeat = await tx.showtimeSeat.findUnique({
                    where: { id: createTicketDto.showtime_seat_id },
                });
                if (!showtimeSeat || showtimeSeat.status !== 'AVAILABLE') {
                    throw new common_1.ConflictException('Ghế này hiện không khả dụng (đã có người đặt hoặc đang chờ)');
                }
                const ticket = await tx.ticket.create({
                    data: {
                        showtime_id: createTicketDto.showtime_id,
                        booking_id: createTicketDto.booking_id,
                        seat_id: createTicketDto.seat_id,
                        showtime_seat_id: createTicketDto.showtime_seat_id,
                        price: createTicketDto.price,
                        status: createTicketDto.status || client_1.TicketStatus.BOOKING,
                    },
                    include: {
                        seat: true,
                        showtime: {
                            include: {
                                movie: { select: { title: true } },
                                room: { select: { name: true } }
                            }
                        },
                        showtime_seat: true
                    }
                });
                await tx.showtimeSeat.update({
                    where: { id: createTicketDto.showtime_seat_id },
                    data: { status: 'BOOKED' }
                });
                return ticket;
            });
        }
        catch (error) {
            if (error instanceof common_1.ConflictException)
                throw error;
            throw new common_1.InternalServerErrorException('Lỗi hệ thống khi tạo vé');
        }
    }
    async findAll() {
        return this.prisma.ticket.findMany({
            include: {
                booking: {
                    include: { user: { select: { full_name: true, email: true } } }
                },
                showtime: {
                    include: {
                        movie: { select: { title: true } },
                        room: { select: { name: true } }
                    }
                },
                seat: true,
                showtime_seat: {
                    include: { seat: true }
                }
            },
            orderBy: { created_at: 'desc' }
        });
    }
    async findOne(id) {
        const ticket = await this.prisma.ticket.findUnique({
            where: { id },
            include: {
                booking: { include: { user: true } },
                seat: true,
                showtime: { include: { movie: true, room: true } },
                showtime_seat: true
            }
        });
        if (!ticket)
            throw new common_1.NotFoundException(`Không tìm thấy vé với ID #${id}`);
        return ticket;
    }
    async update(id, updateTicketDto) {
        const { status, price } = updateTicketDto;
        const currentTicket = await this.findOne(id);
        return this.prisma.$transaction(async (tx) => {
            const updatedTicket = await tx.ticket.update({
                where: { id },
                data: {
                    ...(status && { status }),
                    ...(price && { price }),
                },
                include: { showtime_seat: true }
            });
            if (status === client_1.TicketStatus.FAILED) {
                await tx.showtimeSeat.update({
                    where: { id: currentTicket.showtime_seat_id },
                    data: { status: 'AVAILABLE' }
                });
            }
            return updatedTicket;
        });
    }
    async updateStatusByBooking(bookingId, status) {
        return await this.prisma.$transaction(async (tx) => {
            await tx.ticket.updateMany({
                where: { booking_id: bookingId },
                data: { status }
            });
            if (status === client_1.TicketStatus.FAILED) {
                const tickets = await tx.ticket.findMany({ where: { booking_id: bookingId } });
                const seatIds = tickets.map(t => t.showtime_seat_id);
                await tx.showtimeSeat.updateMany({
                    where: { id: { in: seatIds } },
                    data: { status: 'AVAILABLE' }
                });
            }
            return { success: true };
        });
    }
    async remove(id) {
        const ticket = await this.prisma.ticket.findUnique({
            where: { id }
        });
        if (!ticket)
            throw new common_1.NotFoundException('Vé không tồn tại trong hệ thống');
        return this.prisma.$transaction(async (tx) => {
            await tx.showtimeSeat.update({
                where: { id: ticket.showtime_seat_id },
                data: { status: 'AVAILABLE' }
            });
            return tx.ticket.delete({ where: { id } });
        });
    }
};
exports.TicketsService = TicketsService;
exports.TicketsService = TicketsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], TicketsService);
//# sourceMappingURL=tickets.service.js.map