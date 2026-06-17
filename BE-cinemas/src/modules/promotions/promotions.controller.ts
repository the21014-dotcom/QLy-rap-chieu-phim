import { 
  Controller, Get, Post, Body, Patch, Param, Delete, 
  UseGuards, ParseIntPipe, BadRequestException 
} from '@nestjs/common';
import { PromotionsService } from './promotions.service';
import { CreatePromotionDto } from './dto/create-promotion.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';

@Controller('promotions')
@UseGuards(JwtAuthGuard, RolesGuard)
export class PromotionsController {
  constructor(private readonly promotionsService: PromotionsService) {}

  @Get()
  @Roles('ADMIN', 'STAFF', 'USER')
  async findAll() {
    return await this.promotionsService.findAll();
  }

  @Post()
  @Roles('ADMIN')
  async create(@Body() createPromotionDto: CreatePromotionDto) {
    return await this.promotionsService.create(createPromotionDto);
  }

  @Patch(':id')
  @Roles('ADMIN')
  async update(
    @Param('id', ParseIntPipe) id: number, 
    @Body() updateData: Partial<CreatePromotionDto>
  ) {
    return await this.promotionsService.update(id, updateData);
  }

  @Delete(':id')
  @Roles('ADMIN')
  async remove(@Param('id', ParseIntPipe) id: number) {
    return await this.promotionsService.remove(id);
  }

  /**
   * Endpoint dành cho khách hàng kiểm tra mã trước khi thanh toán
   */
  @Post('validate')
  @Roles('USER', 'ADMIN', 'STAFF')
  async validate(@Body() body: { code: string; amount: number }) {
    if (!body.code) throw new BadRequestException('Vui lòng nhập mã khuyến mãi');
    return await this.promotionsService.validatePromotion(body.code, body.amount || 0);
  }
}