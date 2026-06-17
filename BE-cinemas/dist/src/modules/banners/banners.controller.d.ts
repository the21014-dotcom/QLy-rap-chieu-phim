import { BannersService } from './banners.service';
export declare class BannersController {
    private readonly bannersService;
    constructor(bannersService: BannersService);
    getActiveBanners(): Promise<({
        movie: {
            id: number;
            title: string;
            rating: import("@prisma/client").$Enums.MovieRating;
            release_date: Date;
        };
    } & {
        id: number;
        created_at: Date;
        updated_at: Date;
        title: string | null;
        end_date: Date | null;
        is_active: boolean;
        movie_id: number | null;
        image_url: string;
        start_date: Date | null;
        type: string | null;
        priority: number;
        position: string | null;
        target_link: string | null;
    })[]>;
    findAll(): Promise<({
        movie: {
            id: number;
            title: string;
        };
    } & {
        id: number;
        created_at: Date;
        updated_at: Date;
        title: string | null;
        end_date: Date | null;
        is_active: boolean;
        movie_id: number | null;
        image_url: string;
        start_date: Date | null;
        type: string | null;
        priority: number;
        position: string | null;
        target_link: string | null;
    })[]>;
    findOne(id: number): Promise<{
        movie: {
            id: number;
            title: string;
            poster_url: string;
            landscape_url: string;
        };
    } & {
        id: number;
        created_at: Date;
        updated_at: Date;
        title: string | null;
        end_date: Date | null;
        is_active: boolean;
        movie_id: number | null;
        image_url: string;
        start_date: Date | null;
        type: string | null;
        priority: number;
        position: string | null;
        target_link: string | null;
    }>;
    create(file: Express.Multer.File, createData: any): Promise<{
        id: number;
        created_at: Date;
        updated_at: Date;
        title: string | null;
        end_date: Date | null;
        is_active: boolean;
        movie_id: number | null;
        image_url: string;
        start_date: Date | null;
        type: string | null;
        priority: number;
        position: string | null;
        target_link: string | null;
    }>;
    update(id: number, file: Express.Multer.File, updateData: any): Promise<{
        id: number;
        created_at: Date;
        updated_at: Date;
        title: string | null;
        end_date: Date | null;
        is_active: boolean;
        movie_id: number | null;
        image_url: string;
        start_date: Date | null;
        type: string | null;
        priority: number;
        position: string | null;
        target_link: string | null;
    }>;
    remove(id: number): Promise<{
        id: number;
        created_at: Date;
        updated_at: Date;
        title: string | null;
        end_date: Date | null;
        is_active: boolean;
        movie_id: number | null;
        image_url: string;
        start_date: Date | null;
        type: string | null;
        priority: number;
        position: string | null;
        target_link: string | null;
    }>;
    private deletePhysicalFile;
}
