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
exports.PromotionsController = void 0;
const common_1 = require("@nestjs/common");
const promotions_service_1 = require("./promotions.service");
const create_promotion_dto_1 = require("./dto/create-promotion.dto");
const jwt_auth_guard_1 = require("../../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../../auth/guards/roles.guard");
const roles_decorator_1 = require("../../auth/decorators/roles.decorator");
let PromotionsController = class PromotionsController {
    constructor(promotionsService) {
        this.promotionsService = promotionsService;
    }
    async findAll() {
        return await this.promotionsService.findAll();
    }
    async create(createPromotionDto) {
        return await this.promotionsService.create(createPromotionDto);
    }
    async update(id, updateData) {
        return await this.promotionsService.update(id, updateData);
    }
    async remove(id) {
        return await this.promotionsService.remove(id);
    }
    async validate(body) {
        if (!body.code)
            throw new common_1.BadRequestException('Vui lòng nhập mã khuyến mãi');
        return await this.promotionsService.validatePromotion(body.code, body.amount || 0);
    }
};
exports.PromotionsController = PromotionsController;
__decorate([
    (0, common_1.Get)(),
    (0, roles_decorator_1.Roles)('ADMIN', 'STAFF', 'USER'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PromotionsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)('ADMIN'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_promotion_dto_1.CreatePromotionDto]),
    __metadata("design:returntype", Promise)
], PromotionsController.prototype, "create", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, roles_decorator_1.Roles)('ADMIN'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], PromotionsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, roles_decorator_1.Roles)('ADMIN'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], PromotionsController.prototype, "remove", null);
__decorate([
    (0, common_1.Post)('validate'),
    (0, roles_decorator_1.Roles)('USER', 'ADMIN', 'STAFF'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PromotionsController.prototype, "validate", null);
exports.PromotionsController = PromotionsController = __decorate([
    (0, common_1.Controller)('promotions'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [promotions_service_1.PromotionsService])
], PromotionsController);
//# sourceMappingURL=promotions.controller.js.map