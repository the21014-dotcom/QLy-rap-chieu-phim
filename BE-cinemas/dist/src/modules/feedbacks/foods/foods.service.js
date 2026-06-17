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
exports.FoodsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../../prisma/prisma.service");
const client_1 = require("@prisma/client");
let FoodsService = class FoodsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(createFoodDto) {
        try {
            const { category, price, ...otherData } = createFoodDto;
            return await this.prisma.food.create({
                data: {
                    ...otherData,
                    price: Number(price),
                    category: category || client_1.FoodCategory.COMBO,
                },
            });
        }
        catch (error) {
            console.error('Lỗi Create Food:', error);
            throw new common_1.InternalServerErrorException('Không thể tạo món ăn. Vui lòng kiểm tra lại dữ liệu đầu vào.');
        }
    }
    async findAll() {
        try {
            return await this.prisma.food.findMany({
                orderBy: { id: 'desc' },
            });
        }
        catch (error) {
            throw new common_1.InternalServerErrorException('Lỗi khi tải danh sách món ăn');
        }
    }
    async findOne(id) {
        const food = await this.prisma.food.findUnique({
            where: { id },
        });
        if (!food) {
            throw new common_1.NotFoundException(`Không tìm thấy món ăn với ID ${id}`);
        }
        return food;
    }
    async update(id, updateFoodDto) {
        await this.findOne(id);
        try {
            const { category, price, ...otherData } = updateFoodDto;
            return await this.prisma.food.update({
                where: { id },
                data: {
                    ...otherData,
                    price: price !== undefined ? Number(price) : undefined,
                    category: category ? category : undefined,
                },
            });
        }
        catch (error) {
            console.error('Lỗi Update Food:', error);
            throw new common_1.InternalServerErrorException('Cập nhật thông tin món ăn thất bại');
        }
    }
    async remove(id) {
        await this.findOne(id);
        try {
            return await this.prisma.food.delete({
                where: { id },
            });
        }
        catch (error) {
            throw new common_1.InternalServerErrorException('Không thể xóa món ăn này vì nó đã có trong lịch sử đặt hàng.');
        }
    }
};
exports.FoodsService = FoodsService;
exports.FoodsService = FoodsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], FoodsService);
//# sourceMappingURL=foods.service.js.map