declare class FoodItemDto {
    food_id: number;
    quantity: number;
}
export declare class CreateBookingDto {
    showtime_id: number;
    showtime_seat_ids: number[];
    foods?: FoodItemDto[];
    promotion_code?: string;
}
export {};
