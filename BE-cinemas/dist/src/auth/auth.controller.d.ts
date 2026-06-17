import type { Response } from 'express';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { JwtService } from '@nestjs/jwt';
import { MailService } from '../services/mail.service';
export declare class AuthController {
    private prisma;
    private jwtService;
    private mailService;
    constructor(prisma: PrismaService, jwtService: JwtService, mailService: MailService);
    register(body: RegisterDto, res: Response): Promise<Response<any, Record<string, any>>>;
    verifyOtp(body: {
        email: string;
        otp: string;
    }): Promise<{
        message: string;
    }>;
    login(body: any, res: Response): Promise<Response<any, Record<string, any>>>;
    forgotPassword(body: {
        email: string;
    }): Promise<{
        message: string;
    }>;
}
