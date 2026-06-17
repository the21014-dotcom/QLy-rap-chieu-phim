import { ShowtimesService } from './showtimes.service';
import { CreateShowtimeDto, UpdateShowtimeDto } from './dto/create-showtime.dto';
import { CinemaShowtimesResponse, MovieShowtimesResponse, ApiResponse } from './showtimes.types';
import { SeatsService } from '../seats/seats.service';
export declare class ShowtimesController {
    private readonly showtimesService;
    private readonly seatsService;
    constructor(showtimesService: ShowtimesService, seatsService: SeatsService);
    findByMovie(movieId: number, date?: string, city?: string): Promise<ApiResponse<CinemaShowtimesResponse[]>>;
    findByCinema(cinemaId: number, date?: string): Promise<ApiResponse<MovieShowtimesResponse[]>>;
    getRoomLayout(id: number): Promise<ApiResponse<Awaited<ReturnType<ShowtimesService['getRoomLayout']>>>>;
    findAll(): Promise<ApiResponse<({
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
    })[]>>;
    create(dto: CreateShowtimeDto): Promise<ApiResponse<{
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
    }>>;
    update(id: number, dto: UpdateShowtimeDto): Promise<ApiResponse<{
        id: number;
        movie_id: number;
        room_id: number;
        start_time: Date;
        end_time: Date;
        price_base: number;
    }>>;
    remove(id: number): Promise<{
        message: string;
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
    getSeatsByShowtime(showtimeId: number): Promise<({
        seat: {
            number: number;
            id: number;
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
    })[]>;
    holdSeats(showtimeId: number, seatIds: number[]): Promise<import("@prisma/client").Prisma.BatchPayload[]>;
    releaseSeats(showtimeId: number, seatIds: number[]): Promise<import("@prisma/client").Prisma.BatchPayload>;
}
