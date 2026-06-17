import { PrismaService } from '../prisma/prisma.service';
import { MailService } from '../services/mail.service';
import { JwtService } from '@nestjs/jwt';
export declare class AuthService {
    private prisma;
    private mailService;
    private jwtService;
    constructor(prisma: PrismaService, mailService: MailService, jwtService: JwtService);
    login(user: any): Promise<{
        token: string;
        user: {
            id: any;
            email: any;
            full_name: any;
            role: any;
        };
    }>;
    register(data: any): Promise<{
        message: string;
    }>;
}
