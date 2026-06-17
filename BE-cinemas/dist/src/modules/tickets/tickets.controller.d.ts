import { TicketsService } from './tickets.service';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
export declare class TicketsController {
    private readonly ticketsService;
    constructor(ticketsService: TicketsService);
    create(createTicketDto: CreateTicketDto): Promise<{
        seat: {
            number: number;
            id: number;
            room_id: number;
            row: string;
            type: import("@prisma/client").$Enums.SeatType;
            price_extra: number;
        };
        showtime: {
            movie: {
                title: string;
            };
            room: {
                name: string;
            };
        } & {
            id: number;
            movie_id: number;
            room_id: number;
            start_time: Date;
            end_time: Date;
            price_base: number;
        };
        showtime_seat: {
            id: number;
            showtime_id: number;
            status: string;
            seat_id: number;
            price_base: number;
            seat_type: import("@prisma/client").$Enums.SeatType;
            held_at: Date | null;
        };
    } & {
        id: number;
        showtime_id: number;
        status: import("@prisma/client").$Enums.TicketStatus;
        created_at: Date;
        booking_id: number;
        seat_id: number;
        showtime_seat_id: number;
        price: number;
    }>;
    findAll(): Promise<({
        seat: {
            number: number;
            id: number;
            room_id: number;
            row: string;
            type: import("@prisma/client").$Enums.SeatType;
            price_extra: number;
        };
        showtime: {
            movie: {
                title: string;
            };
            room: {
                name: string;
            };
        } & {
            id: number;
            movie_id: number;
            room_id: number;
            start_time: Date;
            end_time: Date;
            price_base: number;
        };
        booking: {
            user: {
                email: string;
                full_name: string;
            };
        } & {
            id: number;
            user_id: number;
            showtime_id: number;
            promotion_id: number | null;
            total_amount: number;
            status: import("@prisma/client").$Enums.BookingStatus;
            created_at: Date;
            updated_at: Date;
        };
        showtime_seat: {
            seat: {
                number: number;
                id: number;
                room_id: number;
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
        };
    } & {
        id: number;
        showtime_id: number;
        status: import("@prisma/client").$Enums.TicketStatus;
        created_at: Date;
        booking_id: number;
        seat_id: number;
        showtime_seat_id: number;
        price: number;
    })[]>;
    findOne(id: number): Promise<{
        seat: {
            number: number;
            id: number;
            room_id: number;
            row: string;
            type: import("@prisma/client").$Enums.SeatType;
            price_extra: number;
        };
        showtime: {
            movie: {
                id: number;
                created_at: Date;
                updated_at: Date;
                title: string;
                duration: number;
                rating: import("@prisma/client").$Enums.MovieRating;
                description: string | null;
                poster_url: string | null;
                landscape_url: string | null;
                trailer_url: string | null;
                director: string | null;
                actors: string | null;
                language: string | null;
                release_date: Date | null;
                end_date: Date | null;
                is_active: boolean;
            };
            room: {
                id: number;
                name: string;
                is_active: boolean;
                room_type: import("@prisma/client").$Enums.RoomType;
                total_rows: number;
                cols_per_row: number;
                total_seats: number;
                cinema_id: number;
            };
        } & {
            id: number;
            movie_id: number;
            room_id: number;
            start_time: Date;
            end_time: Date;
            price_base: number;
        };
        booking: {
            user: {
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
            };
        } & {
            id: number;
            user_id: number;
            showtime_id: number;
            promotion_id: number | null;
            total_amount: number;
            status: import("@prisma/client").$Enums.BookingStatus;
            created_at: Date;
            updated_at: Date;
        };
        showtime_seat: {
            id: number;
            showtime_id: number;
            status: string;
            seat_id: number;
            price_base: number;
            seat_type: import("@prisma/client").$Enums.SeatType;
            held_at: Date | null;
        };
    } & {
        id: number;
        showtime_id: number;
        status: import("@prisma/client").$Enums.TicketStatus;
        created_at: Date;
        booking_id: number;
        seat_id: number;
        showtime_seat_id: number;
        price: number;
    }>;
    update(id: number, updateTicketDto: UpdateTicketDto): Promise<{
        showtime_seat: {
            id: number;
            showtime_id: number;
            status: string;
            seat_id: number;
            price_base: number;
            seat_type: import("@prisma/client").$Enums.SeatType;
            held_at: Date | null;
        };
    } & {
        id: number;
        showtime_id: number;
        status: import("@prisma/client").$Enums.TicketStatus;
        created_at: Date;
        booking_id: number;
        seat_id: number;
        showtime_seat_id: number;
        price: number;
    }>;
    remove(id: number): Promise<{
        id: number;
        showtime_id: number;
        status: import("@prisma/client").$Enums.TicketStatus;
        created_at: Date;
        booking_id: number;
        seat_id: number;
        showtime_seat_id: number;
        price: number;
    }>;
}
