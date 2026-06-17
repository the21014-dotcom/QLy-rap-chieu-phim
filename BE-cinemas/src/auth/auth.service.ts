import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service'; // Giả định bạn đã có PrismaService
import { MailService } from '../services/mail.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private mailService: MailService,
    private jwtService: JwtService,
  ) {}

  async login(user: any) {
  console.log('User đăng nhập:', user);
  const payload = { 
    email: user.email, 
    sub: user.id, 
    role: user.role // PHẢI có dòng này để RolesGuard hoạt động
  };
  return {
    token: this.jwtService.sign(payload), 
    user: {
      id: user.id,
      email: user.email,
      full_name: user.full_name,
      role: user.role,
    }
  };
}

  async register(data: any) {
    const { email, password, full_name, phone } = data;

    // 1. Kiểm tra email tồn tại chưa
    const userExists = await this.prisma.user.findUnique({ where: { email }, include: { role: true } });
    if (userExists) throw new BadRequestException('Email đã tồn tại!');

    // 2. Băm mật khẩu
    const hashedPassword = await bcrypt.hash(password, 10);

    // 3. Tạo mã OTP 6 số
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExp = new Date();
    otpExp.setMinutes(otpExp.getMinutes() + 10); // Hết hạn sau 10p

    // 4. Lưu vào DB
    const user = await this.prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        full_name,
        phone,
        otp_code: otp,
        otp_exp: otpExp,
        is_verified: false,
      },
    });

    // 5. Gửi Mail

    await this.mailService.sendOTP(email, otp);

    return { message: 'Đăng ký thành công! Vui lòng kiểm tra email để nhận mã OTP.' };
  }
}

