import { PrismaService } from '../../prisma/prisma.service';
import { CreatePromotionDto } from './dto/create-promotion.dto';
export declare class PromotionsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findAll(): Promise<{
        id: number;
        created_at: Date;
        description: string | null;
        end_date: Date;
        is_active: boolean;
        code: string;
        discount_type: import("@prisma/client").$Enums.DiscountType;
        discount_value: number;
        max_discount: number | null;
        min_order_value: number;
        start_date: Date;
        usage_limit: number | null;
        used_count: number;
    }[]>;
    findOne(id: number): Promise<{
        id: number;
        created_at: Date;
        description: string | null;
        end_date: Date;
        is_active: boolean;
        code: string;
        discount_type: import("@prisma/client").$Enums.DiscountType;
        discount_value: number;
        max_discount: number | null;
        min_order_value: number;
        start_date: Date;
        usage_limit: number | null;
        used_count: number;
    }>;
    create(dto: CreatePromotionDto): Promise<{
        id: number;
        created_at: Date;
        description: string | null;
        end_date: Date;
        is_active: boolean;
        code: string;
        discount_type: import("@prisma/client").$Enums.DiscountType;
        discount_value: number;
        max_discount: number | null;
        min_order_value: number;
        start_date: Date;
        usage_limit: number | null;
        used_count: number;
    }>;
    update(id: number, data: any): Promise<{
        id: number;
        created_at: Date;
        description: string | null;
        end_date: Date;
        is_active: boolean;
        code: string;
        discount_type: import("@prisma/client").$Enums.DiscountType;
        discount_value: number;
        max_discount: number | null;
        min_order_value: number;
        start_date: Date;
        usage_limit: number | null;
        used_count: number;
    }>;
    remove(id: number): Promise<{
        id: number;
        created_at: Date;
        description: string | null;
        end_date: Date;
        is_active: boolean;
        code: string;
        discount_type: import("@prisma/client").$Enums.DiscountType;
        discount_value: number;
        max_discount: number | null;
        min_order_value: number;
        start_date: Date;
        usage_limit: number | null;
        used_count: number;
    }>;
    validatePromotion(code: string, currentOrderAmount: number): Promise<{
        id: number;
        code: string;
        discount_amount: number;
        final_amount: number;
    }>;
}
