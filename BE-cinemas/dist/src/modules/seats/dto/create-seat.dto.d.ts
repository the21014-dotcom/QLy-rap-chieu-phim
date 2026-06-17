import { SeatType } from '@prisma/client';
export declare class CreateSeatDto {
    room_id: number;
    row: string;
    number: number;
    type: SeatType;
    price_extra?: number;
}
export declare class UpdateSeatDto {
    row?: string;
    number?: number;
    type?: SeatType;
    price_extra?: number;
}
export declare class GenerateRoomSeatsDto {
    rows: number;
    cols: number;
    room_type?: string;
}
