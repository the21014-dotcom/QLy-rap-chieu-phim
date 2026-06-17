import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../prisma/prisma.service';
import { ChatResponseDto, RateMovieDto } from './dto/chat.dto';
export declare class ChatService {
    private configService;
    private prisma;
    private readonly logger;
    private genAI;
    private conversationContexts;
    private readonly MAX_CONTEXT_LENGTH;
    constructor(configService: ConfigService, prisma: PrismaService);
    private getErrorMessage;
    getChatResponse(userMessage: string, userId?: number, sessionId?: string): Promise<ChatResponseDto>;
    private buildPrompt;
    private parseIntent;
    private generateSuggestions;
    private getNowShowingContext;
    getNowShowingMovies(): Promise<{
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
    searchMovies(keyword: string, limit?: number): Promise<{
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
    rateMovie(userId: number, rateDto: RateMovieDto): Promise<{
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
    getMovieSuggestions(userId?: number): any;
    getQuickActions(userId?: number): Promise<{
        success: boolean;
        actions: {
            label: string;
            intent: string;
        }[];
    }>;
    private getDemoResponse;
    private getFallbackResponse;
}
