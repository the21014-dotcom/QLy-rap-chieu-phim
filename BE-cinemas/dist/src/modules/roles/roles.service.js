"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RolesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
let RolesService = class RolesService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll() {
        return this.prisma.role.findMany({
            include: {
                _count: {
                    select: { permissions: true }
                }
            }
        });
    }
    async findOne(id) {
        const role = await this.prisma.role.findUnique({
            where: { id },
            include: {
                permissions: true
            }
        });
        if (!role) {
            throw new common_1.NotFoundException(`Role với ID ${id} không tồn tại`);
        }
        return role;
    }
    async create(data) {
        return this.prisma.role.create({
            data
        });
    }
    async update(id, data) {
        await this.findOne(id);
        return this.prisma.role.update({
            where: { id },
            data
        });
    }
    async remove(id) {
        const role = await this.prisma.role.findUnique({
            where: { id },
            include: { _count: { select: { users: true } } }
        });
        if (!role)
            throw new common_1.NotFoundException('Không tìm thấy vai trò');
        if (role._count.users > 0) {
            throw new Error('Không thể xóa vai trò đang có người dùng sử dụng');
        }
        return this.prisma.role.delete({
            where: { id }
        });
    }
};
exports.RolesService = RolesService;
exports.RolesService = RolesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], RolesService);
//# sourceMappingURL=roles.service.js.map