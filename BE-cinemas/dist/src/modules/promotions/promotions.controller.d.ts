import { PromotionsService } from './promotions.service';
import { CreatePromotionDto } from './dto/create-promotion.dto';
export declare class PromotionsController {
    private readonly promotionsService;
    constructor(promotionsService: PromotionsService);
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
    create(createPromotionDto: CreatePromotionDto): Promise<{
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
    update(id: number, updateData: Partial<CreatePromotionDto>): Promise<{
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
    validate(body: {
        code: string;
        amount: number;
    }): Promise<{
        id: number;
        code: string;
        discount_amount: number;
        final_amount: number;
    }>;
}
