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
exports.SeatsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const client_1 = require("@prisma/client");
let SeatsService = class SeatsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findByRoom(roomId) {
        const room = await this.prisma.room.findUnique({
            where: { id: roomId },
            include: { seats: {
                    orderBy: [
                        { row: 'asc' },
                        { number: 'asc' }
                    ]
                } }
        });
        if (!room)
            throw new common_1.NotFoundException('Phòng chiếu không tồn tại');
        return {
            room: {
                id: room.id,
                name: room.name,
                room_type: room.room_type,
                total_rows: room.total_rows,
                cols_per_row: room.cols_per_row,
                total_seats: room.total_seats
            },
            seats: room.seats
        };
    }
    async findByShowtime(showtimeId) {
        return this.prisma.showtimeSeat.findMany({
            where: { showtime_id: showtimeId },
            include: {
                seat: {
                    select: {
                        id: true,
                        row: true,
                        number: true,
                        type: true,
                        price_extra: true
                    }
                }
            },
            orderBy: [
                { seat: { row: 'asc' } },
                { seat: { number: 'asc' } }
            ]
        });
    }
    async create(createSeatDto) {
        const existingSeat = await this.prisma.seat.findFirst({
            where: {
                room_id: createSeatDto.room_id,
                row: createSeatDto.row,
                number: createSeatDto.number
            }
        });
        if (existingSeat) {
            throw new common_1.ConflictException(`Ghế ${createSeatDto.row}${createSeatDto.number} đã tồn tại`);
        }
        return this.prisma.seat.create({
            data: createSeatDto,
            include: { room: { select: { name: true } } }
        });
    }
    async update(id, dto) {
        const seat = await this.prisma.seat.findUnique({ where: { id } });
        if (!seat)
            throw new common_1.NotFoundException('Ghế không tồn tại');
        return this.prisma.seat.update({
            where: { id },
            data: dto,
        });
    }
    async generateSeatsForRoom(roomId, dto) {
        const room = await this.prisma.room.findUnique({
            where: { id: roomId }
        });
        if (!room)
            throw new common_1.NotFoundException('Phòng chiếu không tồn tại');
        await this.prisma.seat.deleteMany({ where: { room_id: roomId } });
        const rowChars = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K'].slice(0, dto.rows);
        const seatData = [];
        for (let i = 0; i < dto.rows; i++) {
            const row = rowChars[i];
            for (let col = 1; col <= dto.cols; col++) {
                let type = client_1.SeatType.NORMAL;
                let extra = 0;
                if (room.room_type === client_1.RoomType.GOLD_CLASS) {
                    type = client_1.SeatType.VIP;
                    extra = 50000;
                }
                else {
                    if (['D', 'E', 'F', 'G', 'H', 'I', 'J'].includes(row)) {
                        type = client_1.SeatType.VIP;
                        extra = 20000;
                    }
                    else if (row === 'K') {
                        type = client_1.SeatType.SWEETBOX;
                        extra = 40000;
                    }
                }
                seatData.push({
                    room_id: roomId,
                    row,
                    number: col,
                    type,
                    price_extra: extra
                });
            }
        }
        const result = await this.prisma.seat.createMany({
            data: seatData,
            skipDuplicates: true
        });
        await this.prisma.room.update({
            where: { id: roomId },
            data: { total_seats: seatData.length }
        });
        return {
            ...result,
            room_name: room.name,
            total_seats: seatData.length,
            summary: this.getSeatTypeSummary(seatData)
        };
    }
    getSeatTypeSummary(seats) {
        const summary = seats.reduce((acc, seat) => {
            acc[seat.type] = (acc[seat.type] || 0) + 1;
            return acc;
        }, {});
        return summary;
    }
    async deleteByRoom(roomId) {
        const deleted = await this.prisma.seat.deleteMany({
            where: { room_id: roomId }
        });
        await this.prisma.room.update({
            where: { id: roomId },
            data: { total_seats: 0 }
        });
        return { deletedCount: deleted.count };
    }
    async holdSeats(showtimeId, seatIds) {
        const showtimeSeats = await this.prisma.showtimeSeat.findMany({
            where: {
                showtime_id: showtimeId,
                seat_id: { in: seatIds },
                status: 'AVAILABLE'
            }
        });
        if (showtimeSeats.length !== seatIds.length) {
            throw new common_1.BadRequestException('Một số ghế đã được đặt hoặc không khả dụng');
        }
        return this.prisma.$transaction(seatIds.map(seatId => this.prisma.showtimeSeat.updateMany({
            where: {
                showtime_id: showtimeId,
                seat_id: seatId,
                status: 'AVAILABLE'
            },
            data: {
                status: 'HOLDING',
                held_at: new Date()
            }
        })));
    }
    async releaseSeats(showtimeId, seatIds) {
        return this.prisma.showtimeSeat.updateMany({
            where: {
                showtime_id: showtimeId,
                seat_id: { in: seatIds },
                status: 'HOLDING'
            },
            data: {
                status: 'AVAILABLE',
                held_at: null
            }
        });
    }
};
exports.SeatsService = SeatsService;
exports.SeatsService = SeatsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], SeatsService);
//# sourceMappingURL=seats.service.js.map