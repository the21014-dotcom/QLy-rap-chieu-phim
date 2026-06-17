import { TicketStatus } from '@prisma/client';
export declare class CreateTicketDto {
    showtime_id: number;
    booking_id: number;
    seat_id: number;
    showtime_seat_id: number;
    price: number;
    status?: TicketStatus;
}
