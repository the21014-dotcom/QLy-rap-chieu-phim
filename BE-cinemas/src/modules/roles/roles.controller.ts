import { 
  Controller, 
  Get, 
  Post, 
  Put, 
  Delete, 
  Body, 
  Param, 
  ParseIntPipe 
} from '@nestjs/common';
import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';

@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  // Lấy danh sách tất cả các vai trò
  @Get()
  async findAll() {
    return this.rolesService.findAll();
  }

  // Lấy chi tiết một vai trò theo ID
  // Sử dụng ParseIntPipe để tự động ép kiểu string từ URL sang number
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.rolesService.findOne(id);
  }

  // Tạo vai trò mới
  @Post()
  async create(@Body() data: CreateRoleDto) {
    return this.rolesService.create(data);
  }

  // Cập nhật vai trò theo ID
  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number, 
    @Body() data: UpdateRoleDto
  ) {
    return this.rolesService.update(id, data);
  }

  // Xóa vai trò theo ID
  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.rolesService.remove(id);
  }
}