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
exports.CreatePaymentDto = void 0;
const class_validator_1 = require("class-validator");
class CreatePaymentDto {
    constructor() {
        this.language = 'vn';
    }
}
exports.CreatePaymentDto = CreatePaymentDto;
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'ID đơn hàng không được để trống' }),
    (0, class_validator_1.IsNumber)({}, { message: 'ID đơn hàng phải là số' }),
    __metadata("design:type", Number)
], CreatePaymentDto.prototype, "bookingId", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'Số tiền không được để trống' }),
    (0, class_validator_1.IsNumber)({}, { message: 'Số tiền phải là số' }),
    __metadata("design:type", Number)
], CreatePaymentDto.prototype, "amount", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreatePaymentDto.prototype, "bankCode", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreatePaymentDto.prototype, "paymentMethod", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], CreatePaymentDto.prototype, "foods", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(['vn', 'en'], { message: 'Ngôn ngữ hỗ trợ: vn hoặc en' }),
    __metadata("design:type", String)
], CreatePaymentDto.prototype, "language", void 0);
//# sourceMappingURL=create-payment.dto.js.map