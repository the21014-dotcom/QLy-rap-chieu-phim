import { 
  Controller, Get, Post, Body, Patch, Param, Delete, 
  UseGuards, ParseIntPipe, UseInterceptors, UploadedFile,
  BadRequestException 
} from '@nestjs/common';
import { BannersService } from './banners.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import type {Banner}  from '../../types/banners'

import * as fs from 'fs';
import { storageConfig } from './banners.upload';

@Controller('banners')
export class BannersController {
  constructor(private readonly bannersService: BannersService) {}

  // --- PUBLIC API ---
  @Get('active')
  async getActiveBanners() {
    return this.bannersService.findActive();
  }

  // --- ADMIN API ---

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  findAll() {
    return this.bannersService.findAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.bannersService.findOne(id);
  }

 @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @UseInterceptors(FileInterceptor('image', storageConfig))
  async create(@UploadedFile() file: Express.Multer.File, @Body() createData: any) {
    const imageUrl = file ? `/uploads/banners/${file.filename}` : createData.image_url;

    return this.bannersService.create({
      title: createData.title,
      image_url: imageUrl,
      priority: Number(createData.priority || 0),
      is_active: String(createData.is_active) === 'true',
      type: createData.type,
      position: createData.position,
      target_link: createData.target_link,
      start_date: createData.start_date ? new Date(createData.start_date) : null,
      end_date: createData.end_date ? new Date(createData.end_date) : null,
      movie: createData.movie_id && createData.movie_id !== 'null' 
        ? { connect: { id: Number(createData.movie_id) } } 
        : undefined
    });
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @UseInterceptors(FileInterceptor('image', storageConfig))
  async update(
    @Param('id', ParseIntPipe) id: number, 
    @UploadedFile() file: Express.Multer.File, 
    @Body() updateData: any
  ) {
    const currentBanner = await this.bannersService.findOne(id);
    
    const payload: any = {};
    if (updateData.title !== undefined) payload.title = updateData.title;
    if (updateData.priority !== undefined) payload.priority = Number(updateData.priority);
    if (updateData.is_active !== undefined) payload.is_active = String(updateData.is_active) === 'true';

    // Xử lý quan hệ movie
    if (updateData.movie_id !== undefined) {
      if (updateData.movie_id === 'null' || !updateData.movie_id) {
        payload.movie = { disconnect: true };
      } else {
        payload.movie = { connect: { id: Number(updateData.movie_id) } };
      }
    }

    // Xử lý file ảnh mới
    if (file) {
      // Xóa ảnh cũ để tiết kiệm bộ nhớ server
      this.deletePhysicalFile(currentBanner.image_url);
      payload.image_url = `/uploads/banners/${file.filename}`;
    }

    return this.bannersService.update(id, payload);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  async remove(@Param('id', ParseIntPipe) id: number) {
    const banner = await this.bannersService.findOne(id);
    
    // Xóa file vật lý
    this.deletePhysicalFile(banner.image_url);
    
    return this.bannersService.remove(id);
  }

  /**
   * Hàm hỗ trợ xóa file vật lý
   */
  private deletePhysicalFile(relativeIdPath: string) {
    if (relativeIdPath && relativeIdPath.startsWith('/uploads')) {
      const filePath = `./${relativeIdPath.startsWith('/') ? relativeIdPath.substring(1) : relativeIdPath}`;
      if (fs.existsSync(filePath)) {
        try {
          fs.unlinkSync(filePath);
        } catch (err) {
          console.error(`Không thể xóa file: ${filePath}`, err);
        }
      }
    }
  }
}