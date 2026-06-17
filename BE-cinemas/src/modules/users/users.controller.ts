import { Controller, Get, Post, Body, Query, Patch, Param, Delete } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('users') 
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    // Truyền trực tiếp DTO vào service để xử lý role_id
    return this.usersService.create(createUserDto);
  }

  @Get()
  findAll(
    @Query('role') role?: string, 
    @Query('search') search?: string
  ) {
    // Khớp với logic filter theo Role Name trong Schema
    return this.usersService.findAll(role, search);
  }

  // Bổ sung thêm các phương thức để khớp với CRUD mà UserList.tsx yêu cầu
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: any) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}