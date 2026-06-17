import { PrismaService } from '../../prisma/prisma.service';
export declare class StatisticsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    getSummaryStats(): Promise<{
        totalRevenue: number;
        totalTickets: number;
        newUsers: number;
        revenueByTicket: number;
        revenueByFood: number;
        revenueGrowth: number;
        occupancyRate: number;
    }>;
    getCinemasBreakdown(): Promise<{
        id: number;
        name: string;
        address: string;
        city: string;
        totalTickets: number;
        revenueByTicket: number;
        revenueByFood: number;
        totalRevenue: number;
    }[]>;
    getWeeklyRevenue(): Promise<{
        date: string;
        revenue: number;
        ticketsSold: number;
    }[]>;
    getTopMovies(): Promise<{
        id: number;
        title: string;
        totalRevenue: number;
        totalTickets: number;
        occupancy: number;
    }[]>;
    getRevenueByPeriod(startDate?: string, endDate?: string): Promise<{
        period: string;
        totalRevenue: number;
        revenueByTicket: number;
        revenueByFood: number;
        totalOrders: number;
    }>;
}
