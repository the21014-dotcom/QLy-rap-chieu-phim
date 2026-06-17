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
exports.RoomsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const client_1 = require("@prisma/client");
let RoomsService = class RoomsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createRoom(dto) {
        return await this.prisma.$transaction(async (tx) => {
            const room = await tx.room.create({
                data: {
                    name: dto.name,
                    room_type: dto.room_type,
                    total_rows: dto.total_rows,
                    cols_per_row: dto.cols_per_row,
                    total_seats: dto.total_rows * dto.cols_per_row,
                    cinema_id: dto.cinema_id,
                },
            });
            const seats = [];
            const rowLabels = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
            for (let r = 0; r < dto.total_rows; r++) {
                const rowChar = rowLabels[r];
                for (let c = 1; c <= dto.cols_per_row; c++) {
                    let type = client_1.SeatType.NORMAL;
                    let extra = 0;
                    if (dto.room_type === client_1.RoomType.GOLD_CLASS) {
                        type = client_1.SeatType.VIP;
                        extra = 50000;
                    }
                    else {
                        if (['D', 'E', 'F', 'G', 'H', 'I', 'J'].includes(rowChar)) {
                            type = client_1.SeatType.VIP;
                            extra = 20000;
                        }
                        else if (r === dto.total_rows - 1) {
                            type = client_1.SeatType.SWEETBOX;
                            extra = 40000;
                        }
                    }
                    seats.push({
                        room_id: room.id,
                        row: rowChar,
                        number: c,
                        type: type,
                        price_extra: extra,
                    });
                }
            }
            await tx.seat.createMany({ data: seats });
            return room;
        });
    }
    async getRoomSeats(roomId) {
        const room = await this.prisma.room.findUnique({
            where: { id: roomId },
            include: {
                seats: {
                    orderBy: [{ row: 'asc' }, { number: 'asc' }]
                },
                cinema: true
            }
        });
        if (!room)
            throw new common_1.NotFoundException('Không tìm thấy phòng chiếu');
        return room;
    }
    async findAll(cinema_id) {
        return await this.prisma.room.findMany({
            where: cinema_id ? { cinema_id } : {},
            include: {
                cinema: { select: { name: true } },
                _count: { select: { seats: true } }
            },
            orderBy: { id: 'desc' },
        });
    }
    async findOne(id) {
        const room = await this.prisma.room.findUnique({
            where: { id },
            include: { cinema: true, _count: { select: { seats: true } } }
        });
        if (!room)
            throw new common_1.NotFoundException('Phòng không tồn tại');
        return room;
    }
    async updateRoom(id, dto) {
        const room = await this.prisma.room.findUnique({ where: { id } });
        if (!room)
            throw new common_1.NotFoundException('Phòng không tồn tại');
        if (dto.total_rows || dto.cols_per_row) {
            const hasShowtimes = await this.prisma.showtime.findFirst({ where: { room_id: id } });
            if (hasShowtimes) {
                throw new common_1.BadRequestException('Không thể thay đổi cấu trúc phòng đã có suất chiếu');
            }
        }
        return this.prisma.room.update({
            where: { id },
            data: dto
        });
    }
    async deleteRoom(id) {
        const hasShowtimes = await this.prisma.showtime.findFirst({ where: { room_id: id } });
        if (hasShowtimes) {
            throw new common_1.BadRequestException('Phòng đang có suất chiếu, không thể xóa');
        }
        return await this.prisma.$transaction(async (tx) => {
            await tx.seat.deleteMany({ where: { room_id: id } });
            return tx.room.delete({ where: { id } });
        });
    }
};
exports.RoomsService = RoomsService;
exports.RoomsService = RoomsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], RoomsService);
//# sourceMappingURL=rooms.service.js.map