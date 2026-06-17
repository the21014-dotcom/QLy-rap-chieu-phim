import { MovieRating } from '@prisma/client';
export declare class CreateMovieDto {
    title: string;
    description?: string;
    duration: number;
    rating?: MovieRating;
    director?: string;
    actors?: string;
    language?: string;
    release_date?: string;
    end_date?: string;
    poster_url?: string;
    landscape_url?: string;
    trailer_url?: string;
    is_active?: boolean;
    genre_ids?: number[];
}
