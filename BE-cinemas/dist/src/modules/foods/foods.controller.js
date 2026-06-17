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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FoodsController = void 0;
const common_1 = require("@nestjs/common");
const foods_service_1 = require("./foods.service");
const create_food_dto_1 = require("./dto/create-food.dto");
let FoodsController = class FoodsController {
    constructor(foodsService) {
        this.foodsService = foodsService;
    }
    async create(createFoodDto) {
        return {
            message: "Tạo món ăn thành công",
            data: await this.foodsService.create(createFoodDto)
        };
    }
    async getAllFoods() {
        const data = await this.foodsService.findAll();
        return {
            message: "Lấy danh sách món ăn thành công",
            data: data
        };
    }
    async getFoodById(id) {
        const data = await this.foodsService.findOne(id);
        return {
            message: "Lấy thông tin món ăn thành công",
            data: data
        };
    }
    async update(id, updateData) {
        return {
            message: "Cập nhật thành công",
            data: await this.foodsService.update(id, updateData)
        };
    }
    async remove(id) {
        await this.foodsService.remove(id);
        return { message: "Xóa món ăn thành công" };
    }
};
exports.FoodsController = FoodsController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_food_dto_1.CreateFoodDto]),
    __metadata("design:returntype", Promise)
], FoodsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], FoodsController.prototype, "getAllFoods", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], FoodsController.prototype, "getFoodById", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], FoodsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], FoodsController.prototype, "remove", null);
exports.FoodsController = FoodsController = __decorate([
    (0, common_1.Controller)('foods'),
    __metadata("design:paramtypes", [foods_service_1.FoodsService])
], FoodsController);
//# sourceMappingURL=foods.controller.js.map