export interface ShowtimeSlot {
    id: number;
    roomName: string;
    start_time: string;
    end_time: string;
    availableSeats: number;
    price_base: number;
}
export interface FormatGroup {
    label: string;
    roomType: string;
    isGoldClass: boolean;
    showtimes: ShowtimeSlot[];
}
export interface CinemaShowtimesResponse {
    id: number;
    name: string;
    address: string;
    city: string;
    formats: FormatGroup[];
}
export interface MovieShowtimesResponse {
    id: number;
    title: string;
    rating: string;
    duration: number;
    poster_url?: string;
    formats: FormatGroup[];
}
export interface ApiResponse<T> {
    message: string;
    data: T;
}
