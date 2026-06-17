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
exports.BannersService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
let BannersService = class BannersService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findActive() {
        return await this.prisma.banner.findMany({
            where: { is_active: true },
            include: {
                movie: {
                    select: {
                        id: true,
                        title: true,
                        rating: true,
                        release_date: true,
                    },
                },
            },
            orderBy: [
                { priority: 'desc' },
                { created_at: 'desc' },
            ],
        });
    }
    async findAll() {
        try {
            return await this.prisma.banner.findMany({
                include: {
                    movie: {
                        select: {
                            id: true,
                            title: true,
                        },
                    },
                },
                orderBy: {
                    created_at: 'desc',
                },
            });
        }
        catch (error) {
            throw new common_1.InternalServerErrorException('Lỗi khi truy vấn danh sách banner');
        }
    }
    async findOne(id) {
        const banner = await this.prisma.banner.findUnique({
            where: { id },
            include: {
                movie: {
                    select: {
                        id: true,
                        title: true,
                        poster_url: true,
                        landscape_url: true,
                    },
                },
            },
        });
        if (!banner) {
            throw new common_1.NotFoundException(`Banner với ID #${id} không tồn tại`);
        }
        return banner;
    }
    async create(data) {
        return await this.prisma.banner.create({
            data,
        });
    }
    async update(id, data) {
        await this.findOne(id);
        return await this.prisma.banner.update({
            where: { id },
            data: {
                ...data,
                updated_at: new Date(),
            },
        });
    }
    async remove(id) {
        await this.findOne(id);
        return await this.prisma.banner.delete({
            where: { id },
        });
    }
    async toggleStatus(id) {
        const banner = await this.findOne(id);
        return await this.prisma.banner.update({
            where: { id },
            data: { is_active: !banner.is_active },
        });
    }
};
exports.BannersService = BannersService;
exports.BannersService = BannersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], BannersService);
//# sourceMappingURL=banners.service.js.map