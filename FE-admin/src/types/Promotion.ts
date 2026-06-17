export type DiscountType = 'PERCENT' | 'FIXED_AMOUNT';

// 2. Tạo một object constant để sử dụng như Enum trong code (Value)
export const DiscountTypeValues = {
  PERCENT: 'PERCENT' as DiscountType,
  FIXED_AMOUNT: 'FIXED_AMOUNT' as DiscountType,
};

export interface Promotion {
  id: number;           
  code: string;       
  discount_type: DiscountType;
  discount_value: number;
  usage_limit: number | null;
  used_count: number;
  is_active: boolean;
  start_date?: string; 
  end_date?: string;
  created_at: string;
}