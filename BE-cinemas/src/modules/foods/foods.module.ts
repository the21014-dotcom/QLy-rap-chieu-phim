// src/modules/foods/foods.module.ts
import { Module } from '@nestjs/common';
import { FoodsController } from './foods.controller';
import { FoodsService } from './foods.service';
import { PrismaModule } from 'src/prisma/prisma.module'; // Import để dùng được Prisma

@Module({
  imports: [PrismaModule],
  controllers: [FoodsController],
  providers: [FoodsService],
})
export class FoodsModule {}