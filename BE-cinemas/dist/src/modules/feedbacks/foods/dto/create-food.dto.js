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
exports.CreateFoodDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
class CreateFoodDto {
}
exports.CreateFoodDto = CreateFoodDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Bắp Rang Bơ Vị Phô Mai', description: 'Tên món ăn' }),
    (0, class_validator_1.IsString)({ message: 'Tên món ăn phải là chuỗi ký tự' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Tên món ăn không được để trống' }),
    __metadata("design:type", String)
], CreateFoodDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 55000, description: 'Giá tiền' }),
    (0, class_validator_1.IsNumber)({}, { message: 'Giá tiền phải là số' }),
    (0, class_validator_1.Min)(0, { message: 'Giá tiền không được nhỏ hơn 0' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Giá tiền không được để trống' }),
    __metadata("design:type", Number)
], CreateFoodDto.prototype, "price", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'https://example.com/popcorn.jpg',
        description: 'Đường dẫn hình ảnh',
        required: false
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: 'URL hình ảnh phải là chuỗi' }),
    __metadata("design:type", String)
], CreateFoodDto.prototype, "image_url", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: true, description: 'Trạng thái kinh doanh', default: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)({ message: 'Trạng thái phải là kiểu Boolean' }),
    __metadata("design:type", Boolean)
], CreateFoodDto.prototype, "is_available", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Combo', description: 'Phân loại món ăn' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateFoodDto.prototype, "category", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Mô tả chi tiết', description: 'Chi tiết thành phần' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateFoodDto.prototype, "description", void 0);
//# sourceMappingURL=create-food.dto.js.map