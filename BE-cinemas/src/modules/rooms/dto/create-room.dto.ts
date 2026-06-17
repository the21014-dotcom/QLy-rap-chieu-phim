import { IsString, IsNumber, IsEnum, Min, Max, IsNotEmpty } from 'class-validator';
import { RoomType } from '@prisma/client';
import { PartialType } from '@nestjs/mapped-types';

export class CreateRoomDto {
  @IsNotEmpty({ message: 'Tên phòng không được để trống' })
  @IsString()
  name: string;

  @IsNotEmpty({ message: 'Loại phòng phải được chọn' })
  @IsEnum(RoomType)
  room_type: RoomType;

  @IsNumber()
  @Min(1)
  @Max(26) // Giới hạn theo bảng chữ cái A-Z
  total_rows: number;

  @IsNumber()
  @Min(1)
  @Max(30)
  cols_per_row: number;

  @IsNumber()
  @IsNotEmpty()
  cinema_id: number;
}

export class UpdateRoomDto extends PartialType(CreateRoomDto) {}