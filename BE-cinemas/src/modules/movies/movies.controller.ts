import { Controller, Post, Body, Get, Param, Query, UseGuards, ParseIntPipe, UseInterceptors, UploadedFiles,Patch, Delete} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { MoviesService } from './movies.service';
import { CreateMovieDto } from './dto/create-movie.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { PartialType } from '@nestjs/mapped-types';
export class UpdateMovieDto extends PartialType(CreateMovieDto) {}

@Controller('movies')
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) {}

  // 1. Lấy danh sách tất cả phim (Có thể lọc theo genre qua query: ?genre=HanhDong)
  @Get()
  findAll(@Query() query: any) {
    return this.moviesService.findAll(query);
  }

  // 1. Lấy phim ĐANG CHIẾU
  @Get('now-showing')
  async getNowShowing() {
    return this.moviesService.findNowShowing();
  }

  // 2. Lấy phim SẮP CHIẾU
  @Get('upcoming')
  async getUpcoming() {
    return this.moviesService.findUpcoming();
  }

  // 2. Upload Poster và Landscape cho Phim
  @Post(':id/upload-images')
  @Roles('ADMIN')
  @UseInterceptors(FileFieldsInterceptor([
    { name: 'poster', maxCount: 1 },
    { name: 'landscape', maxCount: 1 },
  ]))
  uploadMovieImages(
    
    @Param('id') id: number,
    @UploadedFiles() files: { poster?: Express.Multer.File[], landscape?: Express.Multer.File[] }
  ) {
    return this.moviesService.updateImages(id, files);
  }
  // 2. Lấy chi tiết một bộ phim theo ID
 @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.moviesService.findOne(id);
  }

  // 3. Thêm phim mới (Chỉ ADMIN mới có quyền)
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN') 
  create(@Body() createMovieDto: CreateMovieDto) {
    return this.moviesService.create(createMovieDto);
  }
  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  update(
    @Param('id', ParseIntPipe) id: number, 
    @Body() updateMovieDto: UpdateMovieDto // Sử dụng DTO chuẩn thay vì any
  ) {
    return this.moviesService.update(id, updateMovieDto);
  }

  // 5. Xóa phim (Chỉ ADMIN)
  @Delete(':id')
  @Roles('ADMIN')
  @UseGuards(JwtAuthGuard, RolesGuard)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.moviesService.remove(id);
  }
}