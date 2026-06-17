import { PrismaService } from '../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { MailService } from './mail.service';
export declare class PaymentService {
    private prisma;
    private configService;
    private mailService;
    constructor(prisma: PrismaService, configService: ConfigService, mailService: MailService);
    createVnPayUrl(bookingId: number, amount: number, ipAddr: string): string;
    verifyVnPayReturn(query: any): Promise<{
        success: boolean;
        orderId: any;
    } | {
        success: boolean;
        orderId?: undefined;
    }>;
    processVnPayIpn(query: any): Promise<{
        RspCode: string;
        Message: string;
    }>;
    completeBooking(bookingId: number): Promise<{
        id: number;
        user_id: number;
        showtime_id: number;
        promotion_id: number | null;
        total_amount: number;
        status: import("@prisma/client").$Enums.BookingStatus;
        created_at: Date;
        updated_at: Date;
    }>;
    private sortObject;
}
