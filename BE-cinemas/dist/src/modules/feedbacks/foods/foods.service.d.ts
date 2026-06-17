import { PrismaService } from 'src/prisma/prisma.service';
import { CreateFoodDto } from './dto/create-food.dto';
import { UpdateFoodDto } from './dto/update-food.dto';
export declare class FoodsService {
    private prisma;
    constructor(prisma: PrismaService);
    create(createFoodDto: CreateFoodDto): Promise<{
        created_at: Date;
        id: number;
        updated_at: Date;
        name: string;
        description: string | null;
        price: number;
        image_url: string | null;
        category: import("@prisma/client").$Enums.FoodCategory;
        is_available: boolean;
    }>;
    findAll(): Promise<{
        created_at: Date;
        id: number;
        updated_at: Date;
        name: string;
        description: string | null;
        price: number;
        image_url: string | null;
        category: import("@prisma/client").$Enums.FoodCategory;
        is_available: boolean;
    }[]>;
    findOne(id: number): Promise<{
        created_at: Date;
        id: number;
        updated_at: Date;
        name: string;
        description: string | null;
        price: number;
        image_url: string | null;
        category: import("@prisma/client").$Enums.FoodCategory;
        is_available: boolean;
    }>;
    update(id: number, updateFoodDto: UpdateFoodDto): Promise<{
        created_at: Date;
        id: number;
        updated_at: Date;
        name: string;
        description: string | null;
        price: number;
        image_url: string | null;
        category: import("@prisma/client").$Enums.FoodCategory;
        is_available: boolean;
    }>;
    remove(id: number): Promise<{
        created_at: Date;
        id: number;
        updated_at: Date;
        name: string;
        description: string | null;
        price: number;
        image_url: string | null;
        category: import("@prisma/client").$Enums.FoodCategory;
        is_available: boolean;
    }>;
}
