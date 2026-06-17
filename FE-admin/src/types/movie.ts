export const MovieRating = {
  P: 'P',
  C13: 'C13',
  C16: 'C16',
  C18: 'C18'
} as const;

export type MovieRating = typeof MovieRating[keyof typeof MovieRating];

export interface Movie {
  id: number;
  title: string;
  duration: number;
  rating: MovieRating;
  description?: string;
  poster_url?: string;
  landscape_url?: string;
  trailer_url?: string;
  director?: string;
  actors?: string;
  language?: string;
  release_date?: string;
  end_date?: string;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface Showtime {
  id: string;
  movie_id: string;
  room_id: string;
  room_name?: string; // Tên phòng (P1, P2...)
  start_time: string;
  end_time: string;
  format: '2D' | '3D' | 'IMAX';
  price: number;
}