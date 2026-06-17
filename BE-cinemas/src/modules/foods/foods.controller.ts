// src/modules/foods/foods.controller.ts
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
import { FoodsService } from './foods.service';
import { CreateFoodDto } from './dto/create-food.dto';

@Controller('foods')
export class FoodsController {
  constructor(private readonly foodsService: FoodsService) {}

  @Post()
  async create(@Body() createFoodDto: CreateFoodDto) {
    return {
      message: "Tạo món ăn thành công",
      data: await this.foodsService.create(createFoodDto)
    };
  }

  @Get()
  async getAllFoods() {
    const data = await this.foodsService.findAll();
    return {
      message: "Lấy danh sách món ăn thành công",
      data: data
    };
  }

  @Get(':id')
  async getFoodById(@Param('id', ParseIntPipe) id: number) {
    const data = await this.foodsService.findOne(id);
    return {
      message: "Lấy thông tin món ăn thành công",
      data: data
    };
  }
  @Patch(':id')
  async update(@Param('id', ParseIntPipe) id: number, @Body() updateData: any) {
    return {
      message: "Cập nhật thành công",
      data: await this.foodsService.update(id, updateData)
    };
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.foodsService.remove(id);
    return { message: "Xóa món ăn thành công" };
  }
}
