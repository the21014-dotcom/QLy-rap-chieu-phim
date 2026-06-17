// src/auth/auth.module.ts
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule } from '@nestjs/config'; // Thêm dòng này
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PrismaService } from '../prisma/prisma.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { MailService } from '../services/mail.service'; // Đảm bảo đúng đường dẫn services

@Module({
  imports: [
    PassportModule,
    ConfigModule.forRoot({ isGlobal: true }),
    JwtModule.register({
      secret: 'YOUR_SECRET_KEY',
      signOptions: { expiresIn: '100d' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, PrismaService, JwtStrategy, MailService], // Đưa MailService vào đây
  exports: [AuthService],
})
export class AuthModule {}