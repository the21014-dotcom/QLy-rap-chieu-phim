import { IsNotEmpty, IsString, IsOptional, MaxLength } from 'class-validator';

export class CreateRoleDto {
  @IsString({ message: 'Tên vai trò phải là chuỗi ký tự' })
  @IsNotEmpty({ message: 'Tên vai trò không được để trống' })
  @MaxLength(50, { message: 'Tên vai trò không được quá 50 ký tự' })
  name: string;

  @IsString({ message: 'Mô tả phải là chuỗi ký tự' })
  @IsOptional() // Trường này không bắt buộc
  description?: string;

  // Nếu bạn muốn gán quyền ngay khi tạo Role, có thể thêm:
  @IsOptional()
  permissionIds?: number[];
}