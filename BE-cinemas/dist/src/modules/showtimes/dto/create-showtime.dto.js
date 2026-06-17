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
exports.UpdateShowtimeDto = exports.CreateShowtimeDto = void 0;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
class CreateShowtimeDto {
}
exports.CreateShowtimeDto = CreateShowtimeDto;
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'movie_id không được để trống' }),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], CreateShowtimeDto.prototype, "movie_id", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'room_id không được để trống' }),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], CreateShowtimeDto.prototype, "room_id", void 0);
__decorate([
    (0, class_validator_1.IsISO8601)({}, { message: 'start_time phải đúng định dạng ISO8601 (VD: 2026-05-25T19:00:00)' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'start_time không được để trống' }),
    __metadata("design:type", String)
], CreateShowtimeDto.prototype, "start_time", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0, { message: 'price_base không được âm' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'price_base không được để trống' }),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], CreateShowtimeDto.prototype, "price_base", void 0);
class UpdateShowtimeDto {
}
exports.UpdateShowtimeDto = UpdateShowtimeDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], UpdateShowtimeDto.prototype, "movie_id", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], UpdateShowtimeDto.prototype, "room_id", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsISO8601)({}, { message: 'start_time phải đúng định dạng ISO8601' }),
    __metadata("design:type", String)
], UpdateShowtimeDto.prototype, "start_time", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], UpdateShowtimeDto.prototype, "price_base", void 0);
//# sourceMappingURL=create-showtime.dto.js.map