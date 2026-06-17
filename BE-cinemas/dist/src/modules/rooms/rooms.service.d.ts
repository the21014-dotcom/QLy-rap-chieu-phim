import { PrismaService } from '../../prisma/prisma.service';
import { CreateRoomDto, UpdateRoomDto } from './dto/create-room.dto';
export declare class RoomsService {
    private prisma;
    constructor(prisma: PrismaService);
    createRoom(dto: CreateRoomDto): Promise<{
        id: number;
        name: string;
        is_active: boolean;
        room_type: import("@prisma/client").$Enums.RoomType;
        total_rows: number;
        cols_per_row: number;
        total_seats: number;
        cinema_id: number;
    }>;
    getRoomSeats(roomId: number): Promise<{
        cinema: {
            id: number;
            name: string;
            address: string | null;
            city: string | null;
            hotline: string | null;
        };
        seats: {
            number: number;
            id: number;
            room_id: number;
            row: string;
            type: import("@prisma/client").$Enums.SeatType;
            price_extra: number;
        }[];
    } & {
        id: number;
        name: string;
        is_active: boolean;
        room_type: import("@prisma/client").$Enums.RoomType;
        total_rows: number;
        cols_per_row: number;
        total_seats: number;
        cinema_id: number;
    }>;
    findAll(cinema_id?: number): Promise<({
        cinema: {
            name: string;
        };
        _count: {
            seats: number;
        };
    } & {
        id: number;
        name: string;
        is_active: boolean;
        room_type: import("@prisma/client").$Enums.RoomType;
        total_rows: number;
        cols_per_row: number;
        total_seats: number;
        cinema_id: number;
    })[]>;
    findOne(id: number): Promise<{
        cinema: {
            id: number;
            name: string;
            address: string | null;
            city: string | null;
            hotline: string | null;
        };
        _count: {
            seats: number;
        };
    } & {
        id: number;
        name: string;
        is_active: boolean;
        room_type: import("@prisma/client").$Enums.RoomType;
        total_rows: number;
        cols_per_row: number;
        total_seats: number;
        cinema_id: number;
    }>;
    updateRoom(id: number, dto: UpdateRoomDto): Promise<{
        id: number;
        name: string;
        is_active: boolean;
        room_type: import("@prisma/client").$Enums.RoomType;
        total_rows: number;
        cols_per_row: number;
        total_seats: number;
        cinema_id: number;
    }>;
    deleteRoom(id: number): Promise<{
        id: number;
        name: string;
        is_active: boolean;
        room_type: import("@prisma/client").$Enums.RoomType;
        total_rows: number;
        cols_per_row: number;
        total_seats: number;
        cinema_id: number;
    }>;
}
