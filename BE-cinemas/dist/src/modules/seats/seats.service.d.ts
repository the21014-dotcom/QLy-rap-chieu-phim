import { PrismaService } from '../../prisma/prisma.service';
import { CreateSeatDto, UpdateSeatDto, GenerateRoomSeatsDto } from './dto/create-seat.dto';
export declare class SeatsService {
    private prisma;
    constructor(prisma: PrismaService);
    findByRoom(roomId: number): Promise<{
        room: {
            id: number;
            name: string;
            room_type: import("@prisma/client").$Enums.RoomType;
            total_rows: number;
            cols_per_row: number;
            total_seats: number;
        };
        seats: {
            number: number;
            id: number;
            room_id: number;
            row: string;
            type: import("@prisma/client").$Enums.SeatType;
            price_extra: number;
        }[];
    }>;
    findByShowtime(showtimeId: number): Promise<({
        seat: {
            number: number;
            id: number;
            row: string;
            type: import("@prisma/client").$Enums.SeatType;
            price_extra: number;
        };
    } & {
        id: number;
        showtime_id: number;
        status: string;
        seat_id: number;
        price_base: number;
        seat_type: import("@prisma/client").$Enums.SeatType;
        held_at: Date | null;
    })[]>;
    create(createSeatDto: CreateSeatDto): Promise<{
        room: {
            name: string;
        };
    } & {
        number: number;
        id: number;
        room_id: number;
        row: string;
        type: import("@prisma/client").$Enums.SeatType;
        price_extra: number;
    }>;
    update(id: number, dto: UpdateSeatDto): Promise<{
        number: number;
        id: number;
        room_id: number;
        row: string;
        type: import("@prisma/client").$Enums.SeatType;
        price_extra: number;
    }>;
    generateSeatsForRoom(roomId: number, dto: GenerateRoomSeatsDto): Promise<{
        room_name: string;
        total_seats: number;
        summary: any;
        count: number;
    }>;
    private getSeatTypeSummary;
    deleteByRoom(roomId: number): Promise<{
        deletedCount: number;
    }>;
    holdSeats(showtimeId: number, seatIds: number[]): Promise<import("@prisma/client").Prisma.BatchPayload[]>;
    releaseSeats(showtimeId: number, seatIds: number[]): Promise<import("@prisma/client").Prisma.BatchPayload>;
}
