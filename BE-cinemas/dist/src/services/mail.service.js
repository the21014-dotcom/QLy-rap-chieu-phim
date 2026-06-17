"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MailService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const nodemailer = __importStar(require("nodemailer"));
let MailService = class MailService {
    constructor(configService) {
        this.configService = configService;
        this.transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: this.configService.get('MAIL_USER'),
                pass: this.configService.get('MAIL_PASS'),
            },
        });
    }
    async sendTicketEmail(bookingData) {
    }
    async sendNewPassword(email, newPass) {
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
        }
        catch (error) {
            console.error('❌ Lỗi gửi mail mật khẩu:', error);
            throw new common_1.InternalServerErrorException('Không thể gửi email mật khẩu mới');
        }
    }
    async sendOTP(email, otp) {
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
        }
        catch (error) {
            console.error('❌ Lỗi gửi mail OTP:', error);
        }
    }
};
exports.MailService = MailService;
exports.MailService = MailService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], MailService);
//# sourceMappingURL=mail.service.js.map