import { IsNumber, IsString, Min, Max, IsNotEmpty, Length,IsOptional } from 'class-validator';

export class CreateFeedbackDto {
  @IsNotEmpty()
  @IsNumber()
  movie_id: number;

  @IsOptional() // Thêm cái này để Admin truyền ID người khác vào
  @IsNumber()
  user_id?: number;

  @IsNotEmpty()
  @IsString()
  @Length(10, 500, { message: 'Nội dung đánh giá phải từ 10 đến 500 ký tự' })
  content: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(1, { message: 'Đánh giá tối thiểu là 1 sao' })
  @Max(5, { message: 'Đánh giá tối đa là 5 sao' })
  rating: number;
}