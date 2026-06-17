import { PrismaService } from '../../prisma/prisma.service';
import { CreateMovieDto } from './dto/create-movie.dto';
export declare class MoviesService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(query: any): Promise<({
        genres: ({
            genre: {
                id: number;
                name: string;
                description: string | null;
            };
        } & {
            movie_id: number;
            genre_id: number;
        })[];
    } & {
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
    })[]>;
    findOne(id: number): Promise<{
        genres: ({
            genre: {
                id: number;
                name: string;
                description: string | null;
            };
        } & {
            movie_id: number;
            genre_id: number;
        })[];
        showtimes: ({
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
        })[];
    } & {
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
    }>;
    create(createMovieDto: CreateMovieDto): Promise<{
        genres: ({
            genre: {
                id: number;
                name: string;
                description: string | null;
            };
        } & {
            movie_id: number;
            genre_id: number;
        })[];
    } & {
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
    }>;
    findNowShowing(): Promise<({
        genres: ({
            genre: {
                id: number;
                name: string;
                description: string | null;
            };
        } & {
            movie_id: number;
            genre_id: number;
        })[];
    } & {
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
    })[]>;
    findUpcoming(): Promise<({
        genres: ({
            genre: {
                id: number;
                name: string;
                description: string | null;
            };
        } & {
            movie_id: number;
            genre_id: number;
        })[];
    } & {
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
    })[]>;
    updateImages(id: number, files: any): Promise<{
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
    }>;
    update(id: number, updateMovieDto: any): Promise<{
        genres: ({
            genre: {
                id: number;
                name: string;
                description: string | null;
            };
        } & {
            movie_id: number;
            genre_id: number;
        })[];
    } & {
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
    }>;
    remove(id: number): Promise<{
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
    }>;
}
