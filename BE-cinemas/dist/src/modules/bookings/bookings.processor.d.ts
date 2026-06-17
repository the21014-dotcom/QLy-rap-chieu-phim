import { PrismaService } from '../../prisma/prisma.service';
export declare class BookingsProcessor {
    private prisma;
    private readonly logger;
    constructor(prisma: PrismaService);
    handleAutoCancelBookings(): Promise<void>;
}
