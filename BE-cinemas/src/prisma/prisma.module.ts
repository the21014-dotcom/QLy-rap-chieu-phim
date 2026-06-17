// src/prisma/prisma.module.ts
import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global() // Dùng Global để không cần import lại ở mọi nơi
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}