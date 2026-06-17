import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { PaymentService } from '../payments/payments.service';
export declare class BookingsController {
    private readonly bookingsService;
    private readonly paymentService;
    constructor(bookingsService: BookingsService, paymentService: PaymentService);
    getUserBookings(req: any): Promise<({
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
                cinema: {
                    id: number;
                    name: string;
                    address: string | null;
                    city: string | null;
                    hotline: string | null;
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
            };
        } & {
            id: number;
            movie_id: number;
            room_id: number;
            start_time: Date;
            end_time: Date;
            price_base: number;
        };
        tickets: ({
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
            status: import("@prisma/client").$Enums.TicketStatus;
            created_at: Date;
            booking_id: number;
            seat_id: number;
            showtime_seat_id: number;
            price: number;
        })[];
        booking_foods: ({
            food: {
                id: number;
                created_at: Date;
                updated_at: Date;
                name: string;
                price: number;
                description: string | null;
                image_url: string | null;
                category: import("@prisma/client").$Enums.FoodCategory;
                is_available: boolean;
            };
        } & {
            id: number;
            booking_id: number;
            price: number;
            total_price: number;
            food_id: number;
            quantity: number;
        })[];
    } & {
        id: number;
        user_id: number;
        showtime_id: number;
        promotion_id: number | null;
        total_amount: number;
        status: import("@prisma/client").$Enums.BookingStatus;
        created_at: Date;
        updated_at: Date;
    })[]>;
    update(id: number, status: any): Promise<{
        id: number;
        user_id: number;
        showtime_id: number;
        promotion_id: number | null;
        total_amount: number;
        status: import("@prisma/client").$Enums.BookingStatus;
        created_at: Date;
        updated_at: Date;
    }>;
    remove(id: number): Promise<{
        id: number;
        user_id: number;
        showtime_id: number;
        promotion_id: number | null;
        total_amount: number;
        status: import("@prisma/client").$Enums.BookingStatus;
        created_at: Date;
        updated_at: Date;
    }>;
    createBooking(req: any, dto: CreateBookingDto): Promise<{
        message: string;
        bookingId: number;
        totalAmount: number;
        status: import("@prisma/client").$Enums.BookingStatus;
    }>;
    getAllForAdmin(query: any): Promise<{
        items: ({
            user: {
                id: number;
                email: string;
                full_name: string;
            };
            showtime: {
                movie: {
                    title: string;
                };
                room: {
                    cinema: {
                        id: number;
                        name: string;
                        address: string | null;
                        city: string | null;
                        hotline: string | null;
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
                };
            } & {
                id: number;
                movie_id: number;
                room_id: number;
                start_time: Date;
                end_time: Date;
                price_base: number;
            };
            tickets: ({
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
                status: import("@prisma/client").$Enums.TicketStatus;
                created_at: Date;
                booking_id: number;
                seat_id: number;
                showtime_seat_id: number;
                price: number;
            })[];
            booking_foods: ({
                food: {
                    id: number;
                    created_at: Date;
                    updated_at: Date;
                    name: string;
                    price: number;
                    description: string | null;
                    image_url: string | null;
                    category: import("@prisma/client").$Enums.FoodCategory;
                    is_available: boolean;
                };
            } & {
                id: number;
                booking_id: number;
                price: number;
                total_price: number;
                food_id: number;
                quantity: number;
            })[];
        } & {
            id: number;
            user_id: number;
            showtime_id: number;
            promotion_id: number | null;
            total_amount: number;
            status: import("@prisma/client").$Enums.BookingStatus;
            created_at: Date;
            updated_at: Date;
        })[];
        total: number;
        page: number;
        lastPage: number;
    }>;
}
