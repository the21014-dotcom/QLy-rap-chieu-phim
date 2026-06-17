import { FoodsService } from './foods.service';
import { CreateFoodDto } from './dto/create-food.dto';
export declare class FoodsController {
    private readonly foodsService;
    constructor(foodsService: FoodsService);
    create(createFoodDto: CreateFoodDto): Promise<{
        message: string;
        data: {
            id: number;
            created_at: Date;
            updated_at: Date;
            name: string;
            price: number;
            description: string | null;
            image_url: string | null;
            category: import("@prisma/client").$Enums.FoodCategory;
            is_available: boolean;
        };
    }>;
    getAllFoods(): Promise<{
        message: string;
        data: {
            id: number;
            created_at: Date;
            updated_at: Date;
            name: string;
            price: number;
            description: string | null;
            image_url: string | null;
            category: import("@prisma/client").$Enums.FoodCategory;
            is_available: boolean;
        }[];
    }>;
    getFoodById(id: number): Promise<{
        message: string;
        data: {
            id: number;
            created_at: Date;
            updated_at: Date;
            name: string;
            price: number;
            description: string | null;
            image_url: string | null;
            category: import("@prisma/client").$Enums.FoodCategory;
            is_available: boolean;
        };
    }>;
    update(id: number, updateData: any): Promise<{
        message: string;
        data: {
            id: number;
            created_at: Date;
            updated_at: Date;
            name: string;
            price: number;
            description: string | null;
            image_url: string | null;
            category: import("@prisma/client").$Enums.FoodCategory;
            is_available: boolean;
        };
    }>;
    remove(id: number): Promise<{
        message: string;
    }>;
}
