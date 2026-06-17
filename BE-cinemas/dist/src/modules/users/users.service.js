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
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const bcrypt = __importStar(require("bcrypt"));
let UsersService = class UsersService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(dto) {
        const roleNameSearch = dto.roleName.toUpperCase().trim();
        const role = await this.prisma.role.findUnique({
            where: { name: roleNameSearch },
        });
        if (!role) {
            console.error(`Role not found: [${roleNameSearch}]`);
            throw new common_1.NotFoundException(`Vai trò ${roleNameSearch} không tồn tại trong DB`);
        }
        const hashedPassword = await bcrypt.hash(dto.password, 10);
        const existingUser = await this.prisma.user.findUnique({ where: { email: dto.email } });
        if (existingUser) {
            throw new common_1.BadRequestException('Email này đã được đăng ký trong hệ thống');
        }
        return this.prisma.user.create({
            data: {
                email: dto.email,
                password: hashedPassword,
                full_name: dto.full_name,
                phone: dto.phone,
                avatar: dto.avatar,
                is_verified: dto.is_verified || false,
                role_id: role.id,
            },
            include: { role: true }
        });
    }
    async findAll(roleName, search) {
        let mappedRole = roleName;
        if (roleName === 'Khách hàng')
            mappedRole = 'CUSTOMER';
        if (roleName === 'Nhân viên')
            mappedRole = 'STAFF';
        return this.prisma.user.findMany({
            where: {
                role: roleName ? { name: roleName } : undefined,
                OR: search ? [
                    { email: { contains: search } },
                    { full_name: { contains: search } }
                ] : undefined,
            },
            include: {
                role: true,
                _count: { select: { bookings: true } }
            },
            orderBy: { created_at: 'desc' }
        });
    }
    async update(id, updateUserDto) {
        const user = await this.prisma.user.findUnique({ where: { id } });
        if (!user)
            throw new common_1.NotFoundException(`Không tìm thấy người dùng có ID #${id}`);
        if (updateUserDto.password) {
            updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
        }
        if (updateUserDto.roleName) {
            const role = await this.prisma.role.findUnique({
                where: { name: updateUserDto.roleName },
            });
            if (role) {
                updateUserDto.role_id = role.id;
            }
            delete updateUserDto.roleName;
        }
        return this.prisma.user.update({
            where: { id },
            data: updateUserDto,
        });
    }
    async remove(id) {
        const user = await this.prisma.user.findUnique({ where: { id } });
        if (!user)
            throw new common_1.NotFoundException(`Không tìm thấy người dùng có ID #${id}`);
        return this.prisma.user.delete({
            where: { id },
        });
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], UsersService);
//# sourceMappingURL=users.service.js.map