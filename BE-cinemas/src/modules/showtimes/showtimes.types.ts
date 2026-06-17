// src/modules/showtimes/showtimes.types.ts

export interface ShowtimeSlot {
  id: number;
  roomName: string
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

// Ảnh 2 CGV: theo phim → list rạp
export interface CinemaShowtimesResponse {
  id: number;
  name: string;
  address: string;
  city: string;
  formats: FormatGroup[];
}

// Ảnh 1 CGV: theo rạp → list phim
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