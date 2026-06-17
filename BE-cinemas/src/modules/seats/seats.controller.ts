import { 
  Controller, 
  Get, 
  Post, 
  Patch, 
  Param, 
  Body, 
  UseGuards, 
  ParseIntPipe, 
  Delete,
  ValidationPipe 
} from '@nestjs/common';
import { SeatsService } from './seats.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { CreateSeatDto, UpdateSeatDto, GenerateRoomSeatsDto } from './dto/create-seat.dto';

@Controller('seats')
export class SeatsController {
  constructor(private readonly seatsService: SeatsService) {}

  // 1. Lấy ghế theo phòng (Public - cho User chọn ghế)
  @Get('room/:roomId')
  getSeatsByRoom(@Param('roomId', ParseIntPipe) roomId: number) {
    return this.seatsService.findByRoom(roomId);
  }

  // 2. Lấy ghế theo suất chiếu (Public - cho booking)
  @Get('showtime/:showtimeId')
  getSeatsByShowtime(@Param('showtimeId', ParseIntPipe) showtimeId: number) {
    return this.seatsService.findByShowtime(showtimeId);
  }

  // 3. Tạo ghế đơn lẻ (Admin)
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  create(@Body(ValidationPipe) createSeatDto: CreateSeatDto) {
    return this.seatsService.create(createSeatDto);
  }

  // 4. Tự động tạo ghế cho phòng (Admin) - KHỚP SEED.TS
  @Post('room/:roomId/generate')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  generateRoomSeats(
    @Param('roomId', ParseIntPipe) roomId: number,
    @Body(ValidationPipe) dto: GenerateRoomSeatsDto
  ) {
    return this.seatsService.generateSeatsForRoom(roomId, dto);
  }

  // 5. Cập nhật ghế (Admin)
  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  updateSeat(
    @Param('id', ParseIntPipe) id: number,
    @Body(ValidationPipe) updateSeatDto: UpdateSeatDto
  ) {
    return this.seatsService.update(id, updateSeatDto);
  }

  // 6. Xóa ghế của phòng (Admin)
  @Delete('room/:roomId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  clearRoomSeats(@Param('roomId', ParseIntPipe) roomId: number) {
    return this.seatsService.deleteByRoom(roomId);
  }

  // 7. HOLD ghế tạm thời (Booking service gọi)
  @Post('showtime/:showtimeId/hold')
  @UseGuards(JwtAuthGuard)
  holdSeats(
    @Param('showtimeId', ParseIntPipe) showtimeId: number,
    @Body('seatIds') seatIds: number[]
  ) {
    return this.seatsService.holdSeats(showtimeId, seatIds);
  }

  // 8. Release ghế (Timeout hoặc cancel)
  @Post('showtime/:showtimeId/release')
  @UseGuards(JwtAuthGuard)
  releaseSeats(
    @Param('showtimeId', ParseIntPipe) showtimeId: number,
    @Body('seatIds') seatIds: number[]
  ) {
    return this.seatsService.releaseSeats(showtimeId, seatIds);
  }
}