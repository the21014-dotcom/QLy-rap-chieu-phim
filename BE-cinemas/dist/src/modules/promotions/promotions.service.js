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
exports.PromotionsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const client_1 = require("@prisma/client");
let PromotionsService = class PromotionsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll() {
        return await this.prisma.promotion.findMany({
            orderBy: { created_at: 'desc' }
        });
    }
    async findOne(id) {
        const promo = await this.prisma.promotion.findUnique({ where: { id } });
        if (!promo)
            throw new common_1.NotFoundException('Mã khuyến mãi không tồn tại');
        return promo;
    }
    async create(dto) {
        const existing = await this.prisma.promotion.findUnique({ where: { code: dto.code } });
        if (existing)
            throw new common_1.BadRequestException('Mã khuyến mãi này đã tồn tại');
        return await this.prisma.promotion.create({
            data: {
                ...dto,
                start_date: new Date(dto.start_date),
                end_date: new Date(dto.end_date)
            }
        });
    }
    async update(id, data) {
        return await this.prisma.promotion.update({
            where: { id },
            data: {
                ...data,
                ...(data.start_date && { start_date: new Date(data.start_date) }),
                ...(data.end_date && { end_date: new Date(data.end_date) }),
            }
        });
    }
    async remove(id) {
        return await this.prisma.promotion.delete({ where: { id } });
    }
    async validatePromotion(code, currentOrderAmount) {
        const promo = await this.prisma.promotion.findUnique({ where: { code } });
        if (!promo || !promo.is_active) {
            throw new common_1.BadRequestException('Mã khuyến mãi không tồn tại hoặc đã bị vô hiệu hóa');
        }
        const now = new Date();
        if (now < promo.start_date || now > promo.end_date) {
            throw new common_1.BadRequestException('Mã khuyến mãi đã hết hạn sử dụng');
        }
        if (promo.usage_limit && promo.used_count >= promo.usage_limit) {
            throw new common_1.BadRequestException('Mã khuyến mãi đã hết lượt sử dụng');
        }
        if (currentOrderAmount < promo.min_order_value) {
            throw new common_1.BadRequestException(`Đơn hàng tối thiểu ${promo.min_order_value.toLocaleString()}đ để dùng mã này`);
        }
        let discountAmount = 0;
        if (promo.discount_type === client_1.DiscountType.PERCENT) {
            discountAmount = currentOrderAmount * (promo.discount_value / 100);
            if (promo.max_discount && discountAmount > promo.max_discount) {
                discountAmount = promo.max_discount;
            }
        }
        else {
            discountAmount = promo.discount_value;
        }
        return {
            id: promo.id,
            code: promo.code,
            discount_amount: Math.round(discountAmount),
            final_amount: Math.max(0, currentOrderAmount - Math.round(discountAmount))
        };
    }
};
exports.PromotionsService = PromotionsService;
exports.PromotionsService = PromotionsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PromotionsService);
//# sourceMappingURL=promotions.service.js.map