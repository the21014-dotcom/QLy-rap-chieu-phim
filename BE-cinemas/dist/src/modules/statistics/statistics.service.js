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
exports.StatisticsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const dayjs_1 = __importDefault(require("dayjs"));
let StatisticsService = class StatisticsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getSummaryStats() {
        const now = (0, dayjs_1.default)();
        const startOfCurrentMonth = now.startOf('month').toDate();
        const startOfLastMonth = now.subtract(1, 'month').startOf('month').toDate();
        const endOfLastMonth = now.subtract(1, 'month').endOf('month').toDate();
        const [ticketData, foodData, lastMonthTickets, lastMonthFood, totalTicketsCount, userCount, occupancyData] = await Promise.all([
            this.prisma.ticket.aggregate({
                _sum: { price: true },
                where: { status: 'SUCCESS' }
            }),
            this.prisma.bookingFood.aggregate({
                _sum: { total_price: true },
                where: { booking: { status: 'SUCCESS' } }
            }),
            this.prisma.ticket.aggregate({
                _sum: { price: true },
                where: { status: 'SUCCESS', created_at: { gte: startOfLastMonth, lte: endOfLastMonth } }
            }),
            this.prisma.bookingFood.aggregate({
                _sum: { total_price: true },
                where: { booking: { status: 'SUCCESS', created_at: { gte: startOfLastMonth, lte: endOfLastMonth } } }
            }),
            this.prisma.ticket.count({ where: { status: 'SUCCESS' } }),
            this.prisma.user.count({
                where: { created_at: { gte: startOfCurrentMonth } }
            }),
            this.prisma.showtime.findMany({
                where: { start_time: { lte: now.toDate() } },
                select: {
                    room: { select: { total_seats: true } },
                    _count: {
                        select: { tickets: { where: { status: 'SUCCESS' } } }
                    }
                }
            })
        ]);
        const revenueByTicket = Number(ticketData._sum.price) || 0;
        const revenueByFood = Number(foodData._sum.total_price) || 0;
        const totalRevenue = revenueByTicket + revenueByFood;
        const prevTicketRevenue = Number(lastMonthTickets._sum.price) || 0;
        const prevFoodRevenue = Number(lastMonthFood._sum.total_price) || 0;
        const prevTotalRevenue = prevTicketRevenue + prevFoodRevenue;
        const revenueGrowth = prevTotalRevenue === 0
            ? 100
            : parseFloat(((totalRevenue - prevTotalRevenue) / prevTotalRevenue * 100).toFixed(2));
        let totalCapacity = 0;
        let totalTicketsSold = 0;
        occupancyData.forEach(st => {
            totalCapacity += st.room.total_seats;
            totalTicketsSold += st._count.tickets;
        });
        const occupancyRate = totalCapacity > 0 ? (totalTicketsSold / totalCapacity) * 100 : 0;
        return {
            totalRevenue,
            totalTickets: totalTicketsCount,
            newUsers: userCount,
            revenueByTicket,
            revenueByFood,
            revenueGrowth,
            occupancyRate: parseFloat(occupancyRate.toFixed(1))
        };
    }
    async getCinemasBreakdown() {
        const cinemas = await this.prisma.cinema.findMany({
            include: {
                rooms: {
                    include: {
                        showtimes: {
                            include: {
                                tickets: {
                                    where: { status: 'SUCCESS' },
                                    select: { price: true }
                                },
                                bookings: {
                                    where: { status: 'SUCCESS' },
                                    include: {
                                        booking_foods: {
                                            select: { total_price: true }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        });
        return cinemas.map(cinema => {
            let totalTicketsSold = 0;
            let revenueByTicket = 0;
            let revenueByFood = 0;
            cinema.rooms.forEach(room => {
                room.showtimes.forEach(showtime => {
                    totalTicketsSold += showtime.tickets.length;
                    revenueByTicket += showtime.tickets.reduce((sum, t) => sum + t.price, 0);
                    showtime.bookings.forEach(booking => {
                        const foodSum = booking.booking_foods.reduce((sum, bf) => sum + bf.total_price, 0);
                        revenueByFood += foodSum;
                    });
                });
            });
            return {
                id: cinema.id,
                name: cinema.name,
                address: cinema.address,
                city: cinema.city,
                totalTickets: totalTicketsSold,
                revenueByTicket,
                revenueByFood,
                totalRevenue: revenueByTicket + revenueByFood
            };
        });
    }
    async getWeeklyRevenue() {
        const days = Array.from({ length: 7 }, (_, i) => (0, dayjs_1.default)().subtract(6 - i, 'day').format('YYYY-MM-DD'));
        return await Promise.all(days.map(async (date) => {
            const start = (0, dayjs_1.default)(date).startOf('day').toDate();
            const end = (0, dayjs_1.default)(date).endOf('day').toDate();
            const [ticketDay, foodDay] = await Promise.all([
                this.prisma.ticket.aggregate({
                    _sum: { price: true },
                    _count: { id: true },
                    where: { status: 'SUCCESS', created_at: { gte: start, lte: end } }
                }),
                this.prisma.bookingFood.aggregate({
                    _sum: { total_price: true },
                    where: { booking: { status: 'SUCCESS', created_at: { gte: start, lte: end } } }
                })
            ]);
            const dayTotal = (Number(ticketDay._sum.price) || 0) + (Number(foodDay._sum.total_price) || 0);
            const dayTicketsCount = ticketDay._count.id || 0;
            return {
                date: (0, dayjs_1.default)(date).format('DD/MM'),
                revenue: dayTotal,
                ticketsSold: dayTicketsCount
            };
        }));
    }
    async getTopMovies() {
        const movies = await this.prisma.movie.findMany({
            include: {
                showtimes: {
                    include: {
                        room: true,
                        tickets: { where: { status: 'SUCCESS' } }
                    }
                }
            }
        });
        const formatted = movies.map(movie => {
            let totalRevenue = 0;
            let totalTickets = 0;
            let totalCapacity = 0;
            movie.showtimes.forEach(st => {
                totalTickets += st.tickets.length;
                totalCapacity += st.room.total_seats;
                totalRevenue += st.tickets.reduce((sum, t) => sum + t.price, 0);
            });
            return {
                id: movie.id,
                title: movie.title,
                totalRevenue,
                totalTickets,
                occupancy: totalCapacity > 0 ? Math.round((totalTickets / totalCapacity) * 100) : 0
            };
        });
        return formatted
            .sort((a, b) => b.totalRevenue - a.totalRevenue)
            .slice(0, 5);
    }
    async getRevenueByPeriod(startDate, endDate) {
        if (!startDate || !endDate) {
            throw new common_1.BadRequestException('Vui lòng chọn ngày bắt đầu và kết thúc');
        }
        const start = (0, dayjs_1.default)(startDate).startOf('day').toDate();
        const end = (0, dayjs_1.default)(endDate).endOf('day').toDate();
        const [ticketStats, foodStats] = await Promise.all([
            this.prisma.ticket.aggregate({
                _sum: { price: true },
                _count: { id: true },
                where: {
                    status: 'SUCCESS',
                    created_at: { gte: start, lte: end }
                }
            }),
            this.prisma.bookingFood.aggregate({
                _sum: { total_price: true },
                where: {
                    booking: {
                        status: 'SUCCESS',
                        created_at: { gte: start, lte: end }
                    }
                }
            })
        ]);
        const totalTicket = Number(ticketStats._sum.price) || 0;
        const totalFood = Number(foodStats._sum.total_price) || 0;
        return {
            period: `${(0, dayjs_1.default)(startDate).format('DD/MM/YYYY')} - ${(0, dayjs_1.default)(endDate).format('DD/MM/YYYY')}`,
            totalRevenue: totalTicket + totalFood,
            revenueByTicket: totalTicket,
            revenueByFood: totalFood,
            totalOrders: ticketStats._count.id || 0
        };
    }
};
exports.StatisticsService = StatisticsService;
exports.StatisticsService = StatisticsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], StatisticsService);
//# sourceMappingURL=statistics.service.js.map