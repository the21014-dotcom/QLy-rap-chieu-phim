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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const bcrypt = __importStar(require("bcrypt"));
const prisma_service_1 = require("../prisma/prisma.service");
const register_dto_1 = require("./dto/register.dto");
const jwt_1 = require("@nestjs/jwt");
const mail_service_1 = require("../services/mail.service");
let AuthController = class AuthController {
    constructor(prisma, jwtService, mailService) {
        this.prisma = prisma;
        this.jwtService = jwtService;
        this.mailService = mailService;
    }
    async register(body, res) {
        const email = body.email.toLowerCase();
        const { password, full_name, phone } = body;
        const existingUser = await this.prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            throw new common_1.BadRequestException('Email này đã được sử dụng!');
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        try {
            const defaultRole = await this.prisma.role.findFirst({ where: { name: 'USER' } });
            await this.prisma.user.create({
                data: {
                    email,
                    password: hashedPassword,
                    full_name,
                    phone,
                    otp_code: otp,
                    otp_exp: new Date(Date.now() + 10 * 60000),
                    role_id: defaultRole?.id || 1,
                    is_verified: false,
                },
            });
            await this.mailService.sendOTP(email, otp);
            return res.status(common_1.HttpStatus.CREATED).json({
                statusCode: 201,
                message: 'Đăng ký thành công. Vui lòng kiểm tra email để lấy mã OTP!',
            });
        }
        catch (error) {
            throw new common_1.BadRequestException('Dữ liệu không hợp lệ hoặc lỗi hệ thống!');
        }
    }
    async verifyOtp(body) {
        const user = await this.prisma.user.findUnique({ where: { email: body.email } });
        if (!user || String(user.otp_code) !== String(body.otp)) {
            throw new common_1.BadRequestException('Mã OTP không chính xác!');
        }
        if (new Date() > user.otp_exp) {
            throw new common_1.BadRequestException('Mã OTP đã hết hạn!');
        }
        await this.prisma.user.update({
            where: { email: body.email },
            data: { is_verified: true, otp_code: null },
        });
        return { message: 'Xác thực tài khoản thành công!' };
    }
    async login(body, res) {
        const email = body.email?.toLowerCase();
        const { password } = body;
        if (!email || !password) {
            throw new common_1.BadRequestException('Vui lòng nhập đầy đủ email và mật khẩu!');
        }
        const user = await this.prisma.user.findUnique({
            where: { email },
            include: { role: true }
        });
        if (!user) {
            throw new common_1.UnauthorizedException('Email hoặc mật khẩu không chính xấc!');
        }
        if (!user.is_verified) {
            throw new common_1.UnauthorizedException('Tài khoản chưa được kích hoạt OTP!');
        }
        const isPasswordMatching = await bcrypt.compare(password, user.password);
        if (!isPasswordMatching) {
            throw new common_1.UnauthorizedException('Email hoặc mật khẩu không chính xác!');
        }
        const payload = {
            sub: user.id,
            email: user.email,
            role: user.role
        };
        return res.status(common_1.HttpStatus.OK).json({
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
    async forgotPassword(body) {
        const user = await this.prisma.user.findUnique({ where: { email: body.email } });
        if (!user)
            throw new common_1.BadRequestException('Email không tồn tại!');
        const newPassword = Math.random().toString(36).slice(-8);
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await this.prisma.user.update({
            where: { email: body.email },
            data: { password: hashedPassword },
        });
        await this.mailService.sendNewPassword(body.email, newPassword);
        return { message: 'Mật khẩu mới đã được gửi vào email của bạn!' };
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, common_1.Post)('register'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [register_dto_1.RegisterDto, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "register", null);
__decorate([
    (0, common_1.Post)('verify-otp'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "verifyOtp", null);
__decorate([
    (0, common_1.Post)('login'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "login", null);
__decorate([
    (0, common_1.Post)('forgot-password'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "forgotPassword", null);
exports.AuthController = AuthController = __decorate([
    (0, common_1.Controller)('auth'),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        jwt_1.JwtService,
        mail_service_1.MailService])
], AuthController);
//# sourceMappingURL=auth.controller.js.map