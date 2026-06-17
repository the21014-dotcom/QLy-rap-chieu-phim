import { RoomType } from '@prisma/client';
export declare class CreateRoomDto {
    name: string;
    room_type: RoomType;
    total_rows: number;
    cols_per_row: number;
    cinema_id: number;
}
declare const UpdateRoomDto_base: import("@nestjs/mapped-types").MappedType<Partial<CreateRoomDto>>;
export declare class UpdateRoomDto extends UpdateRoomDto_base {
}
export {};
