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
exports.GenerateRoomSeatsDto = exports.UpdateSeatDto = exports.CreateSeatDto = void 0;
const class_validator_1 = require("class-validator");
const client_1 = require("@prisma/client");
class CreateSeatDto {
}
exports.CreateSeatDto = CreateSeatDto;
__decorate([
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], CreateSeatDto.prototype, "room_id", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateSeatDto.prototype, "row", void 0);
__decorate([
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], CreateSeatDto.prototype, "number", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(client_1.SeatType),
    __metadata("design:type", String)
], CreateSeatDto.prototype, "type", void 0);
__decorate([
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], CreateSeatDto.prototype, "price_extra", void 0);
class UpdateSeatDto {
}
exports.UpdateSeatDto = UpdateSeatDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateSeatDto.prototype, "row", void 0);
__decorate([
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], UpdateSeatDto.prototype, "number", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(client_1.SeatType),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateSeatDto.prototype, "type", void 0);
__decorate([
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], UpdateSeatDto.prototype, "price_extra", void 0);
class GenerateRoomSeatsDto {
}
exports.GenerateRoomSeatsDto = GenerateRoomSeatsDto;
__decorate([
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], GenerateRoomSeatsDto.prototype, "rows", void 0);
__decorate([
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], GenerateRoomSeatsDto.prototype, "cols", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], GenerateRoomSeatsDto.prototype, "room_type", void 0);
//# sourceMappingURL=create-seat.dto.js.map