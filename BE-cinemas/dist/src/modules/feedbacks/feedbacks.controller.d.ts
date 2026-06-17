import { FeedbacksService } from './feedbacks.service';
import { CreateFeedbackDto } from './dto/create-feedback.dto';
import { UpdateFeedbackDto } from './dto/update-feedback.dto';
export declare class FeedbacksController {
    private readonly feedbacksService;
    constructor(feedbacksService: FeedbacksService);
    create(req: any, createFeedbackDto: CreateFeedbackDto): Promise<{
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
    findAll(): Promise<({
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
    getByMovie(movieId: number): Promise<({
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
    findOne(id: number): Promise<{
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
    update(id: number, req: any, updateFeedbackDto: UpdateFeedbackDto): Promise<{
        id: number;
        user_id: number;
        created_at: Date;
        rating: number;
        movie_id: number;
        content: string;
    }>;
    remove(id: number, req: any): Promise<{
        id: number;
        user_id: number;
        created_at: Date;
        rating: number;
        movie_id: number;
        content: string;
    }>;
}
