import { CinemasService } from './cinemas.service';
import { CreateCinemaDto } from './dto/create-cinema.dto';
import { UpdateCinemaDto } from './dto/update-cinema.dto';
export declare class CinemasController {
    private readonly cinemasService;
    constructor(cinemasService: CinemasService);
    create(createCinemaDto: CreateCinemaDto): Promise<{
        message: string;
        data: {
            id: number;
            name: string;
            address: string | null;
            city: string | null;
            hotline: string | null;
        };
    }>;
    findAll(): Promise<{
        message: string;
        data: ({
            _count: {
                rooms: number;
            };
            rooms: {
                id: number;
                name: string;
                is_active: boolean;
                room_type: import("@prisma/client").$Enums.RoomType;
                total_rows: number;
                cols_per_row: number;
                total_seats: number;
                cinema_id: number;
            }[];
        } & {
            id: number;
            name: string;
            address: string | null;
            city: string | null;
            hotline: string | null;
        })[];
    }>;
    findOne(id: number): Promise<{
        message: string;
        data: {
            rooms: {
                id: number;
                name: string;
                is_active: boolean;
                room_type: import("@prisma/client").$Enums.RoomType;
                total_rows: number;
                cols_per_row: number;
                total_seats: number;
                cinema_id: number;
            }[];
        } & {
            id: number;
            name: string;
            address: string | null;
            city: string | null;
            hotline: string | null;
        };
    }>;
    update(id: number, updateCinemaDto: UpdateCinemaDto): Promise<{
        message: string;
        data: {
            id: number;
            name: string;
            address: string | null;
            city: string | null;
            hotline: string | null;
        };
    }>;
    remove(id: number): Promise<{
        message: string;
    }>;
}
