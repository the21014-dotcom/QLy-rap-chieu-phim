export interface Movie {
  id: number;
  title: string;
  description: string;
  poster_url: string;
  trailer_url?: string;
  duration: number;
  release_date: string;
  landscape_url: string; 
  director: string;      // THÊM DÒNG NÀY
  actors: string;        // THÊM DÒNG NÀY
  language: string;
  genres: MovieGenre[];
  rating: string; // Ví dụ: C13, C16, C18
  status: "now_showing" | "coming_soon";
  avg_score: number;
  showtimes?: Showtime[];
}
export interface Showtime {
  id: number;
  start_time: string;
  price_base: string;
  room: {
    name: string;
    cinema: {
      name: string;
      city: string;
    }
  }
}
export interface Genre {
  id: number;
  name: string;
}

export interface MovieGenre {
  genre_id: number;
  genre: Genre;
}