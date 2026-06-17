import { IsString, IsNotEmpty, IsOptional, IsNumber, IsBoolean } from 'class-validator';

export class CreateBannerDto {
  @IsString() @IsOptional() title?: string;
  @IsString() @IsNotEmpty() image_url: string;
  @IsNumber() @IsOptional() movie_id?: number;
  @IsNumber() @IsOptional() priority?: number;
  @IsBoolean() @IsOptional() is_active?: boolean;
  @IsString() @IsOptional() type?: string;
  @IsString() @IsOptional() position?: string;
  @IsString() @IsOptional() target_link?: string;
  @IsString() @IsOptional() start_date?: string;
  @IsString() @IsOptional() end_date?: string;
}