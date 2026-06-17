import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Patch, 
  Param, 
  Delete, 
  ParseIntPipe 
} from '@nestjs/common';
import { CinemasService } from './cinemas.service';
import { CreateCinemaDto } from './dto/create-cinema.dto';
import { UpdateCinemaDto } from './dto/update-cinema.dto';

@Controller('cinemas')
export class CinemasController {
  constructor(private readonly cinemasService: CinemasService) {}

  @Post()
  async create(@Body() createCinemaDto: CreateCinemaDto) {
    const data = await this.cinemasService.create(createCinemaDto);
    return {
      message: 'Tạo cụm rạp thành công',
      data,
    };
  }

  @Get()
  async findAll() {
    const data = await this.cinemasService.findAll();
    return {
      message: 'Lấy danh sách cụm rạp thành công',
      data,
    };
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const data = await this.cinemasService.findOne(id);
    return {
      message: 'Lấy chi tiết cụm rạp thành công',
      data,
    };
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number, 
    @Body() updateCinemaDto: UpdateCinemaDto
  ) {
    const data = await this.cinemasService.update(id, updateCinemaDto);
    return {
      message: 'Cập nhật cụm rạp thành công',
      data,
    };
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.cinemasService.remove(id);
    return {
      message: 'Xóa cụm rạp thành công',
    };
  }
}