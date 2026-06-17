// src/services/mail.service.ts
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import * as QRCode from 'qrcode';
import * as fs from 'fs';
import * as path from 'path';
import * as handlebars from 'handlebars';

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;

  constructor(private configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      service: 'gmail', // Nếu dùng Gmail thì chỉ cần service này
      auth: {
        user: this.configService.get<string>('MAIL_USER'),
        pass: this.configService.get<string>('MAIL_PASS'),
      },
    });
  }

  // 1. Gửi vé xem phim (Đã có sẵn của bạn - Nhớ check path template)
  async sendTicketEmail(bookingData: any) {
    // ... giữ nguyên logic cũ nhưng nên check sự tồn tại của file trước khi read
  }

  // 2. Gửi mật khẩu mới (Đã hiệu chỉnh để chuyên nghiệp hơn)
  async sendNewPassword(email: string, newPass: string) {
    try {
      await this.transporter.sendMail({
        from: '"TA CINEMAS" <no-reply@tacinemas.com>',
        to: email,
        subject: '[TA CINEMAS] Khôi phục mật khẩu',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #ddd; padding: 20px; border-radius: 10px;">
            <h2 style="color: #E71A0F; text-align: center;">Mật khẩu mới của bạn</h2>
            <p>Hệ thống đã tạo mật khẩu tạm thời cho tài khoản <b>${email}</b>:</p>
            <div style="background: #f4f4f4; padding: 15px; text-align: center; font-size: 24px; font-weight: bold; letter-spacing: 2px; color: #333;">
              ${newPass}
            </div>
            <p style="color: #666; font-size: 13px; margin-top: 20px;">
              * Vui lòng đăng nhập và thay đổi mật khẩu ngay lập tức để bảo mật tài khoản.
            </p>
          </div>
        `,
      });
      console.log(`✅ Đã gửi mật khẩu mới tới: ${email}`);
    } catch (error) {
      console.error('❌ Lỗi gửi mail mật khẩu:', error);
      throw new InternalServerErrorException('Không thể gửi email mật khẩu mới');
    }
  }

  // 3. Gửi mã OTP (Đã hiệu chỉnh để đẹp hơn)
  async sendOTP(email: string, otp: string) {
    try {
      await this.transporter.sendMail({
        from: '"CGV CINEMAS" <no-reply@cgvcinemas.com>',
        to: email,
        subject: '[CGV CINEMAS] Mã xác thực đăng ký tài khoản',
        html: `
          <div style="font-family: Arial, sans-serif; text-align: center;">
            <h2 style="color: #E71A0F;">XÁC THỰC TÀI KHOẢN</h2>
            <p>Mã OTP của bạn là:</p>
            <h1 style="background: #E71A0F; color: white; display: inline-block; padding: 10px 20px; border-radius: 5px;">${otp}</h1>
            <p>Mã này có hiệu lực trong <b>10 phút</b>. Không chia sẻ mã này với bất kỳ ai.</p>
          </div>
        `,
      });
      console.log(`✅ Đã gửi mã OTP tới: ${email}`);
    } catch (error) {
      console.error('❌ Lỗi gửi mail OTP:', error);
      // Không nên throw lỗi ở đây để tránh làm gián đoạn quá trình register nếu chỉ lỗi mail
    }
  }
}
