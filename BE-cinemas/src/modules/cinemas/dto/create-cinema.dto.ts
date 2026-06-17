import { IsString, IsNotEmpty, IsOptional, IsPhoneNumber } from 'class-validator';

export class CreateCinemaDto {
  @IsString()
  @IsNotEmpty({ message: 'Tên rạp không được để trống' })
  name: string;

  @IsString()
  @IsOptional()
  address?: string;

  @IsString()
  @IsOptional()
  city?: string;

  @IsString()
  @IsOptional()
  @IsPhoneNumber('VN', { message: 'Số điện thoại không hợp lệ' })
  hotline?: string;
}