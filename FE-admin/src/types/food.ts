export interface Food {
  id: string;
  name: string;
  image_url: string;
  description?: string;
  price: number;
  category: 'COMBO' | 'DRINK' | 'SNACK';
  stock_quantity: number;
  is_active: boolean;
}