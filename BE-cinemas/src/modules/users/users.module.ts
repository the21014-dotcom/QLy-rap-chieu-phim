import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { PrismaModule } from 'src/prisma/prisma.module'; // Đảm bảo có import này

@Module({
  imports: [PrismaModule], // PHẢI CÓ DÒNG NÀY
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}