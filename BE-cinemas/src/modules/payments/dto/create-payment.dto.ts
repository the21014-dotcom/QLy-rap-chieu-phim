import { IsNumber, IsOptional, IsString, IsNotEmpty, IsEnum } from 'class-validator';

export class CreatePaymentDto {
  @IsNotEmpty({ message: 'ID đơn hàng không được để trống' })
  @IsNumber({}, { message: 'ID đơn hàng phải là số' })
  bookingId: number;

  @IsNotEmpty({ message: 'Số tiền không được để trống' })
  @IsNumber({}, { message: 'Số tiền phải là số' })
  amount: number;

  @IsOptional()
  @IsString()
  bankCode?: string; // Ví dụ: VNBANK, INTCARD, NCB...

  @IsString()
  @IsOptional() // Thêm dòng này để cho phép gửi paymentMethod
  paymentMethod?: string;


  @IsOptional() // Thêm dòng này để cho phép gửi foods
  foods?: any[];

  @IsOptional()
  @IsEnum(['vn', 'en'], { message: 'Ngôn ngữ hỗ trợ: vn hoặc en' })
  language?: string = 'vn';
}