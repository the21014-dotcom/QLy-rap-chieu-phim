import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  ParseIntPipe,
  UseGuards,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { ShowtimesService } from './showtimes.service';
import { CreateShowtimeDto, UpdateShowtimeDto } from './dto/create-showtime.dto';
import {
  CinemaShowtimesResponse,
  MovieShowtimesResponse,
  ApiResponse,
} from './showtimes.types';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { SeatsService } from '../seats/seats.service';

function ok<T>(data: T, message = 'Thành công'): ApiResponse<T> {
  return { message, data };
}

@Controller('showtimes')
export class ShowtimesController {
  constructor(private readonly showtimesService: ShowtimesService, private readonly seatsService: SeatsService) {}
  
  // ── PUBLIC ────────────────────────────────────────────────────────────────

  /**
   * GET /showtimes/movie/:movieId?date=2026-05-25&city=Hải Phòng
   * Ảnh 2 CGV: 1 phim → nhóm theo rạp
   */
  @Get('movie/:movieId')
  async findByMovie(
    @Param('movieId', ParseIntPipe) movieId: number,
    @Query('date') date?: string,
    @Query('city') city?: string,
  ): Promise<ApiResponse<CinemaShowtimesResponse[]>> {
    const data = await this.showtimesService.findByMovie(movieId, date, city);
    return ok(data, 'Lấy suất chiếu theo phim thành công');
  }

  /**
   * GET /showtimes/cinema/:cinemaId?date=2026-05-25
   * Ảnh 1 CGV: 1 rạp → nhóm theo phim
   */
  @Get('cinema/:cinemaId')
  async findByCinema(
    @Param('cinemaId', ParseIntPipe) cinemaId: number,
    @Query('date') date?: string,
  ): Promise<ApiResponse<MovieShowtimesResponse[]>> {
    const data = await this.showtimesService.findByCinema(cinemaId, date);
    return ok(data, 'Lấy suất chiếu theo rạp thành công');
  }

  /**
   * GET /showtimes/:id/seats
   * Sơ đồ ghế cho trang chọn ghế
   */
  @Get('layout/:id')
  async getRoomLayout(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ApiResponse<Awaited<ReturnType<ShowtimesService['getRoomLayout']>>>> {
    const data = await this.showtimesService.getRoomLayout(id);
    return ok(data, 'Lấy sơ đồ ghế thành công');
  }

  // ── ADMIN ─────────────────────────────────────────────────────────────────

  /**
   * GET /showtimes
   */
  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  async findAll() {
    const data = await this.showtimesService.findAll();
    return ok(data, 'Lấy danh sách suất chiếu thành công');
  }

  /**
   * POST /showtimes
   */
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() dto: CreateShowtimeDto) {
    const data = await this.showtimesService.create(dto);
    return ok(data, 'Tạo suất chiếu thành công');
  }

  /**
   * PUT /showtimes/:id
   */
  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateShowtimeDto,
  ) {
    const data = await this.showtimesService.update(id, dto);
    return ok(data, 'Cập nhật suất chiếu thành công');
  }

  /**
   * DELETE /showtimes/:id
   */
  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @HttpCode(HttpStatus.OK)
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.showtimesService.remove(id);
    return { message: 'Xóa suất chiếu thành công' };
  }
  @Get(':id')
findOne(@Param('id', ParseIntPipe) id: number) {
  return this.showtimesService.findOne(id);
}

@Get(':id/seats')
getSeatsByShowtime(@Param('id', ParseIntPipe) showtimeId: number) {
  return this.seatsService.findByShowtime(showtimeId); // Từ SeatsService
}

@Post(':id/hold')
@UseGuards(JwtAuthGuard)
holdSeats(
  @Param('id', ParseIntPipe) showtimeId: number,
  @Body('seatIds') seatIds: number[]
) {
  return this.seatsService.holdSeats(showtimeId, seatIds);
}

@Post(':id/release')
@UseGuards(JwtAuthGuard)
releaseSeats(
  @Param('id', ParseIntPipe) showtimeId: number,
  @Body('seatIds') seatIds: number[]
) {
  return this.seatsService.releaseSeats(showtimeId, seatIds);
}
}