import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
export declare class UsersService {
    private prisma;
    constructor(prisma: PrismaService);
    create(dto: CreateUserDto): Promise<{
        role: {
            id: number;
            name: string;
            description: string | null;
        };
    } & {
        id: number;
        created_at: Date;
        updated_at: Date;
        email: string;
        password: string;
        full_name: string | null;
        avatar: string | null;
        phone: string | null;
        is_verified: boolean;
        otp_code: string | null;
        otp_exp: Date | null;
        role_id: number | null;
    }>;
    findAll(roleName?: string, search?: string): Promise<({
        role: {
            id: number;
            name: string;
            description: string | null;
        };
        _count: {
            bookings: number;
        };
    } & {
        id: number;
        created_at: Date;
        updated_at: Date;
        email: string;
        password: string;
        full_name: string | null;
        avatar: string | null;
        phone: string | null;
        is_verified: boolean;
        otp_code: string | null;
        otp_exp: Date | null;
        role_id: number | null;
    })[]>;
    update(id: number, updateUserDto: any): Promise<{
        id: number;
        created_at: Date;
        updated_at: Date;
        email: string;
        password: string;
        full_name: string | null;
        avatar: string | null;
        phone: string | null;
        is_verified: boolean;
        otp_code: string | null;
        otp_exp: Date | null;
        role_id: number | null;
    }>;
    remove(id: number): Promise<{
        id: number;
        created_at: Date;
        updated_at: Date;
        email: string;
        password: string;
        full_name: string | null;
        avatar: string | null;
        phone: string | null;
        is_verified: boolean;
        otp_code: string | null;
        otp_exp: Date | null;
        role_id: number | null;
    }>;
}
