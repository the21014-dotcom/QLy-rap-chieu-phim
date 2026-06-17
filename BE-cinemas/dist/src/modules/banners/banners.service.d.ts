import { PrismaService } from '../../prisma/prisma.service';
import { Prisma } from '@prisma/client';
export declare class BannersService {
    private prisma;
    constructor(prisma: PrismaService);
    findActive(): Promise<({
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
    create(data: Prisma.BannerCreateInput): Promise<{
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
    update(id: number, data: Prisma.BannerUpdateInput): Promise<{
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
    toggleStatus(id: number): Promise<{
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
}
