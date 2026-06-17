import { IsNumber, IsNotEmpty, IsString, IsOptional, IsEnum } from 'class-validator';
import { TicketStatus } from '@prisma/client';

export class CreateTicketDto {
  @IsNotEmpty()
  @IsNumber()
  showtime_id: number;

  @IsNotEmpty()
  @IsNumber()
  booking_id: number;

  @IsNotEmpty()
  @IsNumber()
  seat_id: number;

  @IsNotEmpty()
  @IsNumber()
  showtime_seat_id: number;

  @IsNotEmpty()
  @IsNumber()
  price: number;

@IsOptional()
  @IsEnum(TicketStatus)
  status?: TicketStatus;
}


