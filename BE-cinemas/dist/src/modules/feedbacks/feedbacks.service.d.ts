import { PrismaService } from '../../prisma/prisma.service';
import { CreateFeedbackDto } from './dto/create-feedback.dto';
import { UpdateFeedbackDto } from './dto/update-feedback.dto';
export declare class FeedbacksService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    createFeedback(currentUserId: number, role: string, dto: CreateFeedbackDto): Promise<{
        user: {
            full_name: string;
            avatar: string;
        };
    } & {
        id: number;
        user_id: number;
        created_at: Date;
        rating: number;
        movie_id: number;
        content: string;
    }>;
    getMovieFeedbacks(movieId: number): Promise<({
        user: {
            id: number;
            full_name: string;
            avatar: string;
        };
    } & {
        id: number;
        user_id: number;
        created_at: Date;
        rating: number;
        movie_id: number;
        content: string;
    })[]>;
    getAllFeedbacks(): Promise<({
        user: {
            email: string;
            full_name: string;
            avatar: string;
        };
        movie: {
            title: string;
        };
    } & {
        id: number;
        user_id: number;
        created_at: Date;
        rating: number;
        movie_id: number;
        content: string;
    })[]>;
    getFeedbackDetail(id: number): Promise<{
        user: {
            full_name: string;
            avatar: string;
        };
        movie: {
            title: string;
        };
    } & {
        id: number;
        user_id: number;
        created_at: Date;
        rating: number;
        movie_id: number;
        content: string;
    }>;
    updateFeedback(id: number, userId: number, role: string, dto: UpdateFeedbackDto): Promise<{
        id: number;
        user_id: number;
        created_at: Date;
        rating: number;
        movie_id: number;
        content: string;
    }>;
    removeFeedback(id: number, userId: number, role: string): Promise<{
        id: number;
        user_id: number;
        created_at: Date;
        rating: number;
        movie_id: number;
        content: string;
    }>;
}
