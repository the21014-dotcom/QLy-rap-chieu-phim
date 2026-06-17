import { PrismaService } from '../../prisma/prisma.service';
import { CreateBookingDto } from './dto/create-booking.dto';
export declare class BookingsService {
    private prisma;
    constructor(prisma: PrismaService);
    createBooking(userId: number, dto: CreateBookingDto): Promise<{
        tickets: {
            id: number;
            showtime_id: number;
            status: import("@prisma/client").$Enums.TicketStatus;
            created_at: Date;
            booking_id: number;
            seat_id: number;
            showtime_seat_id: number;
            price: number;
        }[];
    } & {
        id: number;
        user_id: number;
        showtime_id: number;
        promotion_id: number | null;
        total_amount: number;
        status: import("@prisma/client").$Enums.BookingStatus;
        created_at: Date;
        updated_at: Date;
    }>;
    getHistoryByUserId(userId: number): Promise<({
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
    findAllForAdmin(query: {
        status?: any;
        search?: string;
        page: number;
        limit: number;
    }): Promise<{
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
    deleteBooking(id: number): Promise<{
        id: number;
        user_id: number;
        showtime_id: number;
        promotion_id: number | null;
        total_amount: number;
        status: import("@prisma/client").$Enums.BookingStatus;
        created_at: Date;
        updated_at: Date;
    }>;
    updateStatus(id: number, status: any): Promise<{
        id: number;
        user_id: number;
        showtime_id: number;
        promotion_id: number | null;
        total_amount: number;
        status: import("@prisma/client").$Enums.BookingStatus;
        created_at: Date;
        updated_at: Date;
    }>;
    getBookingDetail(id: number): Promise<{
        user: {
            id: number;
            email: string;
            full_name: string;
            phone: string;
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
        promotion: {
            id: number;
            created_at: Date;
            description: string | null;
            end_date: Date;
            is_active: boolean;
            code: string;
            discount_type: import("@prisma/client").$Enums.DiscountType;
            discount_value: number;
            max_discount: number | null;
            min_order_value: number;
            start_date: Date;
            usage_limit: number | null;
            used_count: number;
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
    }>;
}
