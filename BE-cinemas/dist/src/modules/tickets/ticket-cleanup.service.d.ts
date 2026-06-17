import { PrismaService } from '../../prisma/prisma.service';
export declare class TicketCleanupService {
    private prisma;
    private readonly logger;
    constructor(prisma: PrismaService);
    handleExpiredBookings(): Promise<void>;
}
