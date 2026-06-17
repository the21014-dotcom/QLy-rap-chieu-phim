import { DiscountType } from '@prisma/client';
export declare class CreatePromotionDto {
    code: string;
    description: string;
    discount_type: DiscountType;
    discount_value: number;
    min_order_value?: number;
    max_discount_amount?: number;
    usage_limit: number;
    start_date: string;
    end_date: string;
    is_active?: boolean;
}
