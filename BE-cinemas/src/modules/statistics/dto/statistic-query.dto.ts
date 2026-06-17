import { IsOptional, IsString } from 'class-validator';

export class StatisticQueryDto {
  @IsOptional()
  @IsString()
  startDate?: string;

  @IsOptional()
  @IsString()
  endDate?: string;
}