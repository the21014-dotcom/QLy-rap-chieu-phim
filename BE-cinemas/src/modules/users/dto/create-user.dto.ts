// src/modules/users/dto/create-user.dto.ts
import { IsEmail, IsNotEmpty, IsOptional, IsString, MinLength, IsBoolean } from 'class-validator';

export class CreateUserDto {
  @IsEmail({}, { message: 'Email không đúng định dạng' })
  @IsNotEmpty()
  email: string;

  @IsString()
  @MinLength(6, { message: 'Mật khẩu phải ít nhất 6 ký tự' })
  @IsNotEmpty()
  password: string;

  @IsString()
  @IsOptional()
  full_name?: string;

  @IsString()
  @IsOptional()
  phone?: string;

   @IsString()
  @IsOptional()
  avatar?: string;

  @IsBoolean()
  @IsOptional()
  is_verified?: boolean;

  @IsString()
  @IsNotEmpty()
  roleName: string; // Quan trọng: trường này dùng để map Role trong Service
}