import { 
  Controller, 
  Post, 
  Body, 
  Res, 
  HttpStatus, 
  BadRequestException, 
  UnauthorizedException 
} from '@nestjs/common';
import type { Response } from 'express';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service'; 
import { RegisterDto } from './dto/register.dto';
import { JwtService } from '@nestjs/jwt';
import { MailService } from '../services/mail.service';



@Controller('auth')
export class AuthController {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService, // Thêm dấu phẩy ở đây
    private mailService: MailService
  ) {}

  /**
   * 1. ĐĂNG KÝ TÀI KHOẢN MỚI
   */
  @Post('register')
  async register(@Body() body: RegisterDto, @Res() res: Response) {
    const email = body.email.toLowerCase();
    const { password, full_name, phone } = body;

    const existingUser = await this.prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      throw new BadRequestException('Email này đã được sử dụng!');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    try {
      // Tìm ID của role 'USER' mặc định trong database
      const defaultRole = await this.prisma.role.findFirst({ where: { name: 'USER' } });

      await this.prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          full_name,
          phone,
          otp_code: otp,
          otp_exp: new Date(Date.now() + 10 * 60000),
          role_id: defaultRole?.id || 1, // Gán role mặc định
          is_verified: false,
        },
      });

      await this.mailService.sendOTP(email, otp);
       
      return res.status(HttpStatus.CREATED).json({
        statusCode: 201,
        message: 'Đăng ký thành công. Vui lòng kiểm tra email để lấy mã OTP!',
      });
    } catch (error) {
      throw new BadRequestException('Dữ liệu không hợp lệ hoặc lỗi hệ thống!');
    }
  }

  /**
   * 2. XÁC THỰC OTP
   */
  @Post('verify-otp')
  async verifyOtp(@Body() body: { email: string; otp: string }) {
    const user = await this.prisma.user.findUnique({ where: { email: body.email } });

    // Lưu ý: Nếu DB lưu otp_code là kiểu Int, hãy dùng Number(body.otp)
   if (!user || String(user.otp_code) !== String(body.otp)) {
   throw new BadRequestException('Mã OTP không chính xác!');
}

    if (new Date() > user.otp_exp) {
      throw new BadRequestException('Mã OTP đã hết hạn!');
    }

    await this.prisma.user.update({
      where: { email: body.email },
      data: { is_verified: true, otp_code: null },
    });

    return { message: 'Xác thực tài khoản thành công!' };
  }

  /**
   * 3. ĐĂNG NHẬP
   */
  @Post('login')
  async login(@Body() body: any, @Res() res: Response) {
    const email = body.email?.toLowerCase();
    const { password } = body;

    if (!email || !password) {
      throw new BadRequestException('Vui lòng nhập đầy đủ email và mật khẩu!');
    }

    const user = await this.prisma.user.findUnique({
      where: { email },
      include: { role: true }
    });

    if (!user) {
      throw new UnauthorizedException('Email hoặc mật khẩu không chính xấc!');
    }

    // KIỂM TRA XÁC THỰC OTP TRƯỚC KHI CHO LOGIN
    if (!user.is_verified) {
      throw new UnauthorizedException('Tài khoản chưa được kích hoạt OTP!');
    }

    const isPasswordMatching = await bcrypt.compare(password, user.password);
    if (!isPasswordMatching) {
      throw new UnauthorizedException('Email hoặc mật khẩu không chính xác!');
    }

    const payload = { 
      sub: user.id, 
      email: user.email,
      role: user.role
    };

    return res.status(HttpStatus.OK).json({
      statusCode: 200,
      message: 'Đăng nhập thành công!',
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        full_name: user.full_name,
        role: user.role
      }
    });
  }

  /**
   * 4. QUÊN MẬT KHẨU
   */
  @Post('forgot-password')
  async forgotPassword(@Body() body: { email: string }) {
    const user = await this.prisma.user.findUnique({ where: { email: body.email } });
    if (!user) throw new BadRequestException('Email không tồn tại!');

    const newPassword = Math.random().toString(36).slice(-8); 
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await this.prisma.user.update({
      where: { email: body.email },
      data: { password: hashedPassword },
    });

    await this.mailService.sendNewPassword(body.email, newPassword);
    return { message: 'Mật khẩu mới đã được gửi vào email của bạn!' };
  }
}