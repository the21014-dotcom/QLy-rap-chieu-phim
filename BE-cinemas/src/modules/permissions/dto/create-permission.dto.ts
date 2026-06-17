import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreatePermissionDto {
  @IsString()
  @IsNotEmpty({ message: 'Tên quyền không được để trống' })
  name: string; // Ví dụ: CREATE_MOVIE

  @IsString()
  @IsOptional()
  api_path?: string; // Ví dụ: /api/v1/movies

  @IsString()
  @IsOptional()
  method?: string; // Ví dụ: POST

  @IsString()
  @IsOptional()
  module?: string; // Ví dụ: MOVIES
}

// Update DTO (Thừa kế và cho phép các trường là tùy chọn)
import { PartialType } from '@nestjs/mapped-types';
export class UpdatePermissionDto extends PartialType(CreatePermissionDto) {}