import { 
  Controller, Post, Body, UseGuards, Get, Patch, 
  Param, ParseIntPipe, Delete, Query 
} from '@nestjs/common';
import { RoomsService } from './rooms.service';
import { CreateRoomDto, UpdateRoomDto } from './dto/create-room.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard'; 
import { RolesGuard } from '../../auth/guards/roles.guard';     
import { Roles } from '../../auth/decorators/roles.decorator'; 

@Controller('rooms')
export class RoomsController {
  constructor(private readonly roomsService: RoomsService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  create(@Body() createRoomDto: CreateRoomDto) {
    return this.roomsService.createRoom(createRoomDto);
  }

  @Get()
  findAll(@Query('cinemaId') cinemaId?: string) {
    return this.roomsService.findAll(cinemaId ? Number(cinemaId) : undefined);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.roomsService.findOne(id);
  }

  @Get(':id/seats')
  getRoomSeats(@Param('id', ParseIntPipe) id: number) {
    return this.roomsService.getRoomSeats(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateDto: UpdateRoomDto) {
    return this.roomsService.updateRoom(id, updateDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.roomsService.deleteRoom(id);
  }
}