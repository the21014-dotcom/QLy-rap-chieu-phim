import { ChatService } from './chat.service';
import { ChatDto, RateMovieDto, SearchMovieDto, ChatResponseDto } from './dto/chat.dto';
import { Request } from 'express';
interface AuthenticatedRequest extends Request {
    user?: {
        id: number;
        email: string;
    };
}
export declare class ChatController {
    private readonly chatService;
    constructor(chatService: ChatService);
    handleChat(chatDto: ChatDto): Promise<ChatResponseDto>;
    rateMovie(rateDto: RateMovieDto, req: AuthenticatedRequest): Promise<{
        success: boolean;
        message: string;
        data: {
            id: number;
            rating: number;
            created_at: Date;
            movie_id: number;
            user_id: number;
            content: string;
        };
    }>;
    searchMovie(searchDto: SearchMovieDto): Promise<{
        success: boolean;
        data: {
            id: number;
            title: string;
            duration: number;
            rating: import("@prisma/client").$Enums.MovieRating;
            poster_url: string;
        }[];
        total: number;
        message?: undefined;
    } | {
        success: boolean;
        message: string;
        data?: undefined;
        total?: undefined;
    }>;
    getQuickActions(userId?: number): Promise<{
        success: boolean;
        actions: {
            label: string;
            intent: string;
        }[];
    }>;
    getNowShowing(): Promise<{
        success: boolean;
        data: ({
            genres: ({
                genre: {
                    id: number;
                    description: string | null;
                    name: string;
                };
            } & {
                movie_id: number;
                genre_id: number;
            })[];
        } & {
            id: number;
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
            created_at: Date;
            updated_at: Date;
        })[];
        message?: undefined;
    } | {
        success: boolean;
        message: string;
        data?: undefined;
    }>;
    getSuggestions(userId?: number): Promise<any>;
}
export {};
