import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  getHello(): string {
    return 'Chào mừng đến với Hệ thống quản lý RẠP CHIẾU PHIM CGV 2026!';
  }
}