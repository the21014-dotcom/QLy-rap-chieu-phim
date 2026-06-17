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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShowtimesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const moment_timezone_1 = __importDefault(require("moment-timezone"));
const VN_TZ = 'Asia/Ho_Chi_Minh';
function buildFormatLabel(roomType, language = 'Phụ đề') {
    const langMap = {
        'Tiếng Việt': 'Lồng Tiếng Việt',
        'Phụ đề': 'Phụ Đề Anh',
        'Tiếng Anh': 'Phụ Đề Anh',
    };
    const typeMap = {
        STANDARD_2D: '2D',
        PREMIUM_3D: '3D',
        IMAX: 'IMAX',
        GOLD_CLASS: '2D',
    };
    return `${typeMap[roomType] ?? '2D'} ${langMap[language] ?? 'Phụ Đề Anh'}`;
}
function countAvailable(seats) {
    return seats.filter((s) => s.status === 'AVAILABLE').length;
}
function groupByFormat(showtimes) {
    const map = new Map();
    for (const st of showtimes) {
        const label = buildFormatLabel(st.room.room_type, st.movie?.language);
        const key = `${label}::${st.room.room_type}`;
        if (!map.has(key)) {
            map.set(key, {
                label,
                roomType: st.room.room_type,
                isGoldClass: st.room.room_type === 'GOLD_CLASS',
                showtimes: [],
            });
        }
        const slot = {
            id: st.id,
            roomName: st.room['name'] || st.room.name,
            start_time: (0, moment_timezone_1.default)(st.start_time).tz(VN_TZ).format(),
            end_time: (0, moment_timezone_1.default)(st.end_time).tz(VN_TZ).format(),
            availableSeats: countAvailable(st.showtime_seats),
            price_base: st.price_base,
        };
        map.get(key).showtimes.push(slot);
    }
    for (const group of map.values()) {
        group.showtimes.sort((a, b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime());
    }
    return Array.from(map.values());
}
let ShowtimesService = class ShowtimesService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getRoomLayout(showtimeId) {
        const showtime = await this.prisma.showtime.findUnique({
            where: { id: showtimeId },
            include: {
                movie: { select: { title: true, rating: true, duration: true, language: true } },
                room: {
                    include: {
                        cinema: { select: { name: true, address: true } },
                        seats: {
                            orderBy: [{ row: 'asc' }, { number: 'asc' }],
                            include: {
                                showtime_seats: { where: { showtime_id: showtimeId } }
                            },
                        },
                    },
                },
            },
        });
        if (!showtime)
            throw new common_1.NotFoundException('Không tìm thấy suất chiếu');
        return {
            showtimeId: showtime.id,
            startTime: (0, moment_timezone_1.default)(showtime.start_time).tz(VN_TZ).format('HH:mm DD/MM/YYYY'),
            movie: showtime.movie,
            cinema: showtime.room.cinema,
            roomName: showtime.room.name,
            roomType: showtime.room.room_type,
            seats: showtime.room.seats.map((seatItem) => {
                const statusData = seatItem.showtime_seats[0];
                return {
                    id: statusData?.id || seatItem.id,
                    row: seatItem.row,
                    number: seatItem.number,
                    type: seatItem.type,
                    price: statusData ? Number(statusData.price_base) : (Number(showtime.price_base) + Number(seatItem.price_extra)),
                    status: statusData?.status ?? 'AVAILABLE',
                };
            }),
        };
    }
    async findOne(id) {
        const showtime = await this.prisma.showtime.findUnique({
            where: { id },
            include: {
                movie: {
                    select: {
                        id: true,
                        title: true,
                        poster_url: true,
                        duration: true,
                        rating: true,
                    }
                },
                room: {
                    include: {
                        cinema: {
                            select: { name: true, city: true, address: true }
                        }
                    }
                },
                showtime_seats: {
                    include: {
                        seat: true
                    }
                }
            }
        });
        if (!showtime)
            throw new common_1.NotFoundException('Không tìm thấy suất chiếu');
        return showtime;
    }
    async findAll() {
        return this.prisma.showtime.findMany({
            include: {
                movie: { select: { id: true, title: true, duration: true, rating: true } },
                room: {
                    select: {
                        id: true, name: true, room_type: true,
                        cinema: { select: { id: true, name: true, city: true } },
                    },
                },
                _count: { select: { showtime_seats: true } },
            },
            orderBy: { start_time: 'asc' },
        });
    }
    async findByMovie(movieId, date, city) {
        const target = date ? moment_timezone_1.default.tz(date, 'YYYY-MM-DD', VN_TZ) : moment_timezone_1.default.tz(VN_TZ);
        const startOfDay = target.clone().startOf('day').toDate();
        const endOfDay = target.clone().endOf('day').toDate();
        const now = (0, moment_timezone_1.default)().tz(VN_TZ).toDate();
        const startTimeFilter = target.isSame((0, moment_timezone_1.default)(), 'day') ? now : startOfDay;
        const rows = await this.prisma.showtime.findMany({
            where: {
                movie_id: movieId,
                start_time: {
                    gte: startTimeFilter,
                    lte: endOfDay
                },
                ...(city && {
                    room: {
                        cinema: {
                            city: { contains: city },
                        },
                    },
                }),
            },
            include: {
                movie: { select: { language: true } },
                room: {
                    select: {
                        id: true,
                        name: true,
                        room_type: true,
                        cinema: {
                            select: { id: true, name: true, address: true, city: true }
                        },
                    },
                },
                showtime_seats: { select: { status: true } },
            },
            orderBy: { start_time: 'asc' },
        });
        const cinemaMap = new Map();
        for (const st of rows) {
            const cid = st.room.cinema.id;
            if (!cinemaMap.has(cid))
                cinemaMap.set(cid, []);
            const rawSt = {
                id: st.id,
                start_time: st.start_time,
                end_time: st.end_time,
                price_base: Number(st.price_base),
                room: {
                    name: st.room.name,
                    room_type: st.room.room_type,
                    cinema: st.room.cinema
                },
                movie: {
                    language: st.movie.language
                },
                showtime_seats: st.showtime_seats
            };
            cinemaMap.get(cid).push(rawSt);
        }
        return Array.from(cinemaMap.values()).map((list) => {
            const c = list[0].room.cinema;
            return {
                id: c.id,
                name: c.name,
                address: c.address ?? '',
                city: c.city ?? '',
                formats: groupByFormat(list),
            };
        });
    }
    async findByCinema(cinemaId, date) {
        const target = date ? moment_timezone_1.default.tz(date, 'YYYY-MM-DD', VN_TZ) : moment_timezone_1.default.tz(VN_TZ);
        const startOfDay = target.clone().startOf('day').toDate();
        const endOfDay = target.clone().endOf('day').toDate();
        const rows = await this.prisma.showtime.findMany({
            where: {
                start_time: { gte: startOfDay, lte: endOfDay },
                room: { cinema_id: cinemaId },
            },
            include: {
                movie: {
                    select: { id: true, title: true, rating: true, duration: true, language: true, poster_url: true },
                },
                room: {
                    select: {
                        id: true,
                        name: true,
                        room_type: true
                    }
                },
                showtime_seats: { select: { status: true } },
            },
            orderBy: { start_time: 'asc' },
        });
        const movieMap = new Map();
        for (const st of rows) {
            const mid = st.movie.id;
            if (!movieMap.has(mid))
                movieMap.set(mid, []);
            movieMap.get(mid).push(st);
        }
        return Array.from(movieMap.values()).map((list) => {
            const m = list[0].movie;
            return {
                id: m.id,
                title: m.title,
                rating: m.rating,
                duration: m.duration,
                poster_url: m.poster_url,
                formats: groupByFormat(list),
            };
        });
    }
    async create(dto) {
        return this.prisma.$transaction(async (tx) => {
            const movie = await tx.movie.findUnique({ where: { id: dto.movie_id } });
            if (!movie)
                throw new common_1.NotFoundException('Không tìm thấy phim');
            const room = await tx.room.findUnique({
                where: { id: dto.room_id },
                include: { cinema: { select: { name: true } } },
            });
            if (!room)
                throw new common_1.NotFoundException('Không tìm thấy phòng chiếu');
            if (!room.is_active)
                throw new common_1.BadRequestException('Phòng chiếu hiện không hoạt động');
            const startTime = moment_timezone_1.default.tz(dto.start_time, VN_TZ).toDate();
            const endTime = (0, moment_timezone_1.default)(startTime).add(movie.duration + 15, 'minutes').toDate();
            const conflict = await tx.showtime.findFirst({
                where: {
                    room_id: dto.room_id,
                    OR: [
                        { start_time: { lte: startTime }, end_time: { gt: startTime } },
                        { start_time: { lt: endTime }, end_time: { gte: endTime } },
                        { start_time: { gte: startTime }, end_time: { lte: endTime } },
                    ],
                },
                include: { movie: { select: { title: true } } },
            });
            if (conflict) {
                throw new common_1.BadRequestException(`Phòng đã có suất "${conflict.movie.title}" lúc ${(0, moment_timezone_1.default)(conflict.start_time).tz(VN_TZ).format('HH:mm DD/MM')}`);
            }
            const showtime = await tx.showtime.create({
                data: {
                    movie_id: movie.id,
                    room_id: dto.room_id,
                    price_base: dto.price_base,
                    start_time: startTime,
                    end_time: endTime,
                },
            });
            const seats = await tx.seat.findMany({ where: { room_id: dto.room_id } });
            if (seats.length > 0) {
                await tx.showtimeSeat.createMany({
                    data: seats.map((seat) => ({
                        showtime_id: showtime.id,
                        seat_id: seat.id,
                        status: 'AVAILABLE',
                        price_base: dto.price_base + (seat.price_extra || 0),
                        seat_type: seat.type,
                    })),
                });
            }
            return {
                ...showtime,
                cinema: room.cinema.name,
                roomName: room.name,
                movieTitle: movie.title,
                totalSeats: seats.length,
            };
        });
    }
    async update(id, dto) {
        const existing = await this.prisma.showtime.findUnique({
            where: { id },
            include: { movie: true },
        });
        if (!existing)
            throw new common_1.NotFoundException('Không tìm thấy suất chiếu');
        const movieId = dto.movie_id ?? existing.movie_id;
        const roomId = dto.room_id ?? existing.room_id;
        const startTime = dto.start_time
            ? moment_timezone_1.default.tz(dto.start_time, VN_TZ).toDate()
            : existing.start_time;
        const movie = await this.prisma.movie.findUnique({ where: { id: movieId } });
        if (!movie)
            throw new common_1.NotFoundException('Không tìm thấy phim');
        const endTime = (0, moment_timezone_1.default)(startTime).add(movie.duration + 15, 'minutes').toDate();
        const conflict = await this.prisma.showtime.findFirst({
            where: {
                room_id: roomId,
                id: { not: id },
                OR: [
                    { start_time: { lte: startTime }, end_time: { gt: startTime } },
                    { start_time: { lt: endTime }, end_time: { gte: endTime } },
                    { start_time: { gte: startTime }, end_time: { lte: endTime } },
                ],
            },
            include: { movie: { select: { title: true } } },
        });
        if (conflict) {
            throw new common_1.BadRequestException(`Phòng đã có suất "${conflict.movie.title}" ` +
                `lúc ${(0, moment_timezone_1.default)(conflict.start_time).tz(VN_TZ).format('HH:mm DD/MM')}` +
                ` — ${(0, moment_timezone_1.default)(conflict.end_time).tz(VN_TZ).format('HH:mm')}`);
        }
        return this.prisma.showtime.update({
            where: { id },
            data: {
                movie_id: movieId,
                room_id: roomId,
                start_time: startTime,
                end_time: endTime,
                ...(dto.price_base !== undefined && { price_base: dto.price_base }),
            },
        });
    }
    async remove(id) {
        const showtime = await this.prisma.showtime.findUnique({
            where: { id },
            include: { bookings: { select: { status: true } } },
        });
        if (!showtime)
            throw new common_1.NotFoundException('Không tìm thấy suất chiếu');
        const hasSuccess = showtime.bookings.some((b) => b.status === 'SUCCESS');
        if (hasSuccess) {
            throw new common_1.BadRequestException('Không thể xóa suất chiếu đã có vé thanh toán thành công');
        }
        return this.prisma.showtime.delete({ where: { id } });
    }
};
exports.ShowtimesService = ShowtimesService;
exports.ShowtimesService = ShowtimesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ShowtimesService);
//# sourceMappingURL=showtimes.service.js.map