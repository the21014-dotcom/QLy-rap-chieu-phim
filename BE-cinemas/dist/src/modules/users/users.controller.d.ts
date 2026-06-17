import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    create(createUserDto: CreateUserDto): Promise<{
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
    findAll(role?: string, search?: string): Promise<({
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
    update(id: string, updateUserDto: any): Promise<{
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
    remove(id: string): Promise<{
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
