import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import dayjs from 'dayjs';

@Injectable()
export class StatisticsService {
  constructor(private readonly prisma: PrismaService) {}

  async getSummaryStats() {
    const now = dayjs();
    const startOfCurrentMonth = now.startOf('month').toDate();
    const startOfLastMonth = now.subtract(1, 'month').startOf('month').toDate();
    const endOfLastMonth = now.subtract(1, 'month').endOf('month').toDate();

    const [
      ticketData,       // Doanh thu vé
      foodData,         // Doanh thu bắp nước
      lastMonthTickets, // Doanh thu vé tháng trước
      lastMonthFood,    // Doanh thu bắp nước tháng trước
      totalTicketsCount, 
      userCount, 
      occupancyData
    ] = await Promise.all([
      // 1. Tổng tiền VÉ thành công
      this.prisma.ticket.aggregate({
        _sum: { price: true },
        where: { status: 'SUCCESS' }
      }),
      // 2. Tổng tiền FOOD thành công
      this.prisma.bookingFood.aggregate({
        _sum: { total_price: true },
        where: { booking: { status: 'SUCCESS' } }
      }),
      // 3. Doanh thu vé tháng trước
      this.prisma.ticket.aggregate({
        _sum: { price: true },
        where: { status: 'SUCCESS', created_at: { gte: startOfLastMonth, lte: endOfLastMonth } }
      }),
      // 4. Doanh thu food tháng trước
      this.prisma.bookingFood.aggregate({
        _sum: { total_price: true },
        where: { booking: { status: 'SUCCESS', created_at: { gte: startOfLastMonth, lte: endOfLastMonth } } }
      }),
      // 5. Tổng số lượng vé đã bán
      this.prisma.ticket.count({ where: { status: 'SUCCESS' } }),
      // 6. Khách hàng mới trong tháng này
      this.prisma.user.count({ 
        where: { created_at: { gte: startOfCurrentMonth } } 
      }),
      // 7. Dữ liệu tỷ lệ lấp đầy
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

    // Tính toán con số cụ thể
    const revenueByTicket = Number(ticketData._sum.price) || 0;
    const revenueByFood = Number(foodData._sum.total_price) || 0;
    
    // TỔNG DOANH THU CHUẨN = VÉ + BẮP NƯỚC
    const totalRevenue = revenueByTicket + revenueByFood;

    // Tính tăng trưởng so với tháng trước
    const prevTicketRevenue = Number(lastMonthTickets._sum.price) || 0;
    const prevFoodRevenue = Number(lastMonthFood._sum.total_price) || 0;
    const prevTotalRevenue = prevTicketRevenue + prevFoodRevenue;
    
    const revenueGrowth = prevTotalRevenue === 0 
      ? 100 
      : parseFloat(((totalRevenue - prevTotalRevenue) / prevTotalRevenue * 100).toFixed(2));

    // Tính tỷ lệ lấp đầy
    let totalCapacity = 0;
    let totalTicketsSold = 0;
    occupancyData.forEach(st => {
      totalCapacity += st.room.total_seats;
      totalTicketsSold += st._count.tickets;
    });

    const occupancyRate = totalCapacity > 0 ? (totalTicketsSold / totalCapacity) * 100 : 0;

    return {
      totalRevenue, // Đây là con số tổng cuối cùng
      totalTickets: totalTicketsCount,
      newUsers: userCount,
      revenueByTicket,
      revenueByFood,
      revenueGrowth,
      occupancyRate: parseFloat(occupancyRate.toFixed(1))
    };
  }
  async getCinemasBreakdown() {
  // Lấy toàn bộ danh sách cụm rạp cùng các thành phần liên quan đến doanh thu
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

  // Tính toán số liệu chi tiết cho từng cụm rạp
  return cinemas.map(cinema => {
    let totalTicketsSold = 0;
    let revenueByTicket = 0;
    let revenueByFood = 0;

    cinema.rooms.forEach(room => {
      room.showtimes.forEach(showtime => {
        // 1. Thống kê vé bán ra và doanh thu vé của rạp này
        totalTicketsSold += showtime.tickets.length;
        revenueByTicket += showtime.tickets.reduce((sum, t) => sum + t.price, 0);

        // 2. Thống kê doanh thu F&B thông qua các Booking thành công của suất chiếu
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
  // Cập nhật biểu đồ tuần để cộng cả Food
  async getWeeklyRevenue() {
    const days = Array.from({ length: 7 }, (_, i) => 
      dayjs().subtract(6 - i, 'day').format('YYYY-MM-DD')
    );

    return await Promise.all(days.map(async (date) => {
      const start = dayjs(date).startOf('day').toDate();
      const end = dayjs(date).endOf('day').toDate();

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
        date: dayjs(date).format('DD/MM'),
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
        // Doanh thu phim này = Tổng giá vé của phim đó
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
  async getRevenueByPeriod(startDate?: string, endDate?: string) {
    if (!startDate || !endDate) {
      throw new BadRequestException('Vui lòng chọn ngày bắt đầu và kết thúc');
    }

    const start = dayjs(startDate).startOf('day').toDate();
    const end = dayjs(endDate).endOf('day').toDate();

    // Lấy song song doanh thu vé và food trong khoảng thời gian
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
      period: `${dayjs(startDate).format('DD/MM/YYYY')} - ${dayjs(endDate).format('DD/MM/YYYY')}`,
      totalRevenue: totalTicket + totalFood,
      revenueByTicket: totalTicket,
      revenueByFood: totalFood,
      totalOrders: ticketStats._count.id || 0 // Đếm số vé hoặc số đơn tùy bạn
    };
  }
}