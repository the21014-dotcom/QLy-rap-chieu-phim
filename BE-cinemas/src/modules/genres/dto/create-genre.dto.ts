import { IsNotEmpty, IsString, MinLength, MaxLength, IsOptional } from 'class-validator';

export class CreateGenreDto {
  @IsNotEmpty({ message: 'Tên thể loại không được để trống' })
  @IsString({ message: 'Tên thể loại phải là chuỗi ký tự' })
  @MinLength(2, { message: 'Tên thể loại phải có ít nhất 2 ký tự' })
  @MaxLength(50, { message: 'Tên thể loại không được quá 50 ký tự' })
  name: string;

  @IsString()
  @IsOptional() // Cho phép để trống mô tả
  description?: string;
}