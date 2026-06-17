import { IsEmail, IsString, MinLength } from 'class-validator';

export class RegisterDto {
  @IsEmail({}, { message: 'Email không hợp lệ' })
  email!: string; // Thêm dấu ! ở đây

  @IsString()
  @MinLength(6, { message: 'Mật khẩu phải từ 6 ký tự' })
  password!: string;

  @IsString()
  full_name!: string;

  @IsString()
  phone!: string;
}