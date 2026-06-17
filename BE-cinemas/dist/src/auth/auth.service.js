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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const mail_service_1 = require("../services/mail.service");
const bcrypt = __importStar(require("bcrypt"));
const jwt_1 = require("@nestjs/jwt");
let AuthService = class AuthService {
    constructor(prisma, mailService, jwtService) {
        this.prisma = prisma;
        this.mailService = mailService;
        this.jwtService = jwtService;
    }
    async login(user) {
        console.log('User đăng nhập:', user);
        const payload = {
            email: user.email,
            sub: user.id,
            role: user.role
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
    async register(data) {
        const { email, password, full_name, phone } = data;
        const userExists = await this.prisma.user.findUnique({ where: { email }, include: { role: true } });
        if (userExists)
            throw new common_1.BadRequestException('Email đã tồn tại!');
        const hashedPassword = await bcrypt.hash(password, 10);
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExp = new Date();
        otpExp.setMinutes(otpExp.getMinutes() + 10);
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
        await this.mailService.sendOTP(email, otp);
        return { message: 'Đăng ký thành công! Vui lòng kiểm tra email để nhận mã OTP.' };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        mail_service_1.MailService,
        jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map