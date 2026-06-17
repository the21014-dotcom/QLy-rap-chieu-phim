import { PrismaService } from '../../prisma/prisma.service';
import { CreateShowtimeDto, UpdateShowtimeDto } from './dto/create-showtime.dto';
import { CinemaShowtimesResponse, MovieShowtimesResponse } from './showtimes.types';
export declare class ShowtimesService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    getRoomLayout(showtimeId: number): Promise<{
        showtimeId: number;
        startTime: string;
        movie: {
            title: string;
            duration: number;
            rating: import("@prisma/client").$Enums.MovieRating;
            language: string;
        };
        cinema: {
            name: string;
            address: string;
        };
        roomName: string;
        roomType: import("@prisma/client").$Enums.RoomType;
        seats: {
            id: number;
            row: string;
            number: number;
            type: import("@prisma/client").$Enums.SeatType;
            price: number;
            status: string;
        }[];
    }>;
    findOne(id: number): Promise<{
        movie: {
            id: number;
            title: string;
            duration: number;
            rating: import("@prisma/client").$Enums.MovieRating;
            poster_url: string;
        };
        room: {
            cinema: {
                name: string;
                address: string;
                city: string;
            };
        } & {
            id: number;
            is_active: boolean;
            name: string;
            room_type: import("@prisma/client").$Enums.RoomType;
            total_rows: number;
            cols_per_row: number;
            total_seats: number;
            cinema_id: number;
        };
        showtime_seats: ({
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
            price_base: number;
            showtime_id: number;
            seat_id: number;
            status: string;
            seat_type: import("@prisma/client").$Enums.SeatType;
            held_at: Date | null;
        })[];
    } & {
        id: number;
        movie_id: number;
        room_id: number;
        start_time: Date;
        end_time: Date;
        price_base: number;
    }>;
    findAll(): Promise<({
        movie: {
            id: number;
            title: string;
            duration: number;
            rating: import("@prisma/client").$Enums.MovieRating;
        };
        room: {
            id: number;
            cinema: {
                id: number;
                name: string;
                city: string;
            };
            name: string;
            room_type: import("@prisma/client").$Enums.RoomType;
        };
        _count: {
            showtime_seats: number;
        };
    } & {
        id: number;
        movie_id: number;
        room_id: number;
        start_time: Date;
        end_time: Date;
        price_base: number;
    })[]>;
    findByMovie(movieId: number, date?: string, city?: string): Promise<CinemaShowtimesResponse[]>;
    findByCinema(cinemaId: number, date?: string): Promise<MovieShowtimesResponse[]>;
    create(dto: CreateShowtimeDto): Promise<{
        cinema: string;
        roomName: string;
        movieTitle: string;
        totalSeats: number;
        id: number;
        movie_id: number;
        room_id: number;
        start_time: Date;
        end_time: Date;
        price_base: number;
    }>;
    update(id: number, dto: UpdateShowtimeDto): Promise<{
        id: number;
        movie_id: number;
        room_id: number;
        start_time: Date;
        end_time: Date;
        price_base: number;
    }>;
    remove(id: number): Promise<{
        id: number;
        movie_id: number;
        room_id: number;
        start_time: Date;
        end_time: Date;
        price_base: number;
    }>;
}
