import { IsString, IsNumber, IsOptional, IsBoolean, IsUrl, Min, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateFoodDto {
  @ApiProperty({ example: 'Bắp Rang Bơ Vị Phô Mai', description: 'Tên món ăn' })
  @IsString({ message: 'Tên món ăn phải là chuỗi ký tự' })
  @IsNotEmpty({ message: 'Tên món ăn không được để trống' })
  name: string;

  @ApiProperty({ example: 55000, description: 'Giá tiền' })
  @IsNumber({}, { message: 'Giá tiền phải là số' })
  @Min(0, { message: 'Giá tiền không được nhỏ hơn 0' })
  @IsNotEmpty({ message: 'Giá tiền không được để trống' })
  price: number;

  @ApiProperty({ 
    example: 'https://example.com/popcorn.jpg', 
    description: 'Đường dẫn hình ảnh',
    required: false 
  })
  @IsOptional()
  @IsString({ message: 'URL hình ảnh phải là chuỗi' })
  // @IsUrl({}, { message: 'URL hình ảnh không hợp lệ' }) // Mở ra nếu bạn muốn bắt buộc định dạng URL
  image_url?: string;

  @ApiProperty({ example: true, description: 'Trạng thái kinh doanh', default: true })
  @IsOptional()
  @IsBoolean({ message: 'Trạng thái phải là kiểu Boolean' })
  is_available?: boolean;

  // THÊM CÁC TRƯỜNG NÀY ĐỂ HẾT LỖI VALIDATION
  @ApiProperty({ example: 'Combo', description: 'Phân loại món ăn' })
  @IsString()
  @IsOptional() 
  category?: string;

  @ApiProperty({ example: 'Mô tả chi tiết', description: 'Chi tiết thành phần' })
  @IsString()
  @IsOptional()
  description?: string;
}

