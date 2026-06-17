import { PrismaService } from '../../prisma/prisma.service';
import { CreateGenreDto } from './dto/create-genre.dto';
import { UpdateGenreDto } from './dto/update-genre.dto';
export declare class GenresService {
    private prisma;
    constructor(prisma: PrismaService);
    create(createGenreDto: CreateGenreDto): Promise<{
        id: number;
        name: string;
        description: string | null;
    }>;
    findAll(): Promise<({
        _count: {
            movies: number;
        };
    } & {
        id: number;
        name: string;
        description: string | null;
    })[]>;
    findOne(id: number): Promise<{
        movies: ({
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
        } & {
            movie_id: number;
            genre_id: number;
        })[];
    } & {
        id: number;
        name: string;
        description: string | null;
    }>;
    update(id: number, updateGenreDto: UpdateGenreDto): Promise<{
        id: number;
        name: string;
        description: string | null;
    }>;
    remove(id: number): Promise<{
        id: number;
        name: string;
        description: string | null;
    }>;
}
