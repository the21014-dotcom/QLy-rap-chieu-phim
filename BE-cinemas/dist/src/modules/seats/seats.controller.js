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
exports.SeatsController = void 0;
const common_1 = require("@nestjs/common");
const seats_service_1 = require("./seats.service");
const jwt_auth_guard_1 = require("../../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../../auth/guards/roles.guard");
const roles_decorator_1 = require("../../auth/decorators/roles.decorator");
const create_seat_dto_1 = require("./dto/create-seat.dto");
let SeatsController = class SeatsController {
    constructor(seatsService) {
        this.seatsService = seatsService;
    }
    getSeatsByRoom(roomId) {
        return this.seatsService.findByRoom(roomId);
    }
    getSeatsByShowtime(showtimeId) {
        return this.seatsService.findByShowtime(showtimeId);
    }
    create(createSeatDto) {
        return this.seatsService.create(createSeatDto);
    }
    generateRoomSeats(roomId, dto) {
        return this.seatsService.generateSeatsForRoom(roomId, dto);
    }
    updateSeat(id, updateSeatDto) {
        return this.seatsService.update(id, updateSeatDto);
    }
    clearRoomSeats(roomId) {
        return this.seatsService.deleteByRoom(roomId);
    }
    holdSeats(showtimeId, seatIds) {
        return this.seatsService.holdSeats(showtimeId, seatIds);
    }
    releaseSeats(showtimeId, seatIds) {
        return this.seatsService.releaseSeats(showtimeId, seatIds);
    }
};
exports.SeatsController = SeatsController;
__decorate([
    (0, common_1.Get)('room/:roomId'),
    __param(0, (0, common_1.Param)('roomId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], SeatsController.prototype, "getSeatsByRoom", null);
__decorate([
    (0, common_1.Get)('showtime/:showtimeId'),
    __param(0, (0, common_1.Param)('showtimeId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], SeatsController.prototype, "getSeatsByShowtime", null);
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('ADMIN'),
    __param(0, (0, common_1.Body)(common_1.ValidationPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_seat_dto_1.CreateSeatDto]),
    __metadata("design:returntype", void 0)
], SeatsController.prototype, "create", null);
__decorate([
    (0, common_1.Post)('room/:roomId/generate'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('ADMIN'),
    __param(0, (0, common_1.Param)('roomId', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)(common_1.ValidationPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, create_seat_dto_1.GenerateRoomSeatsDto]),
    __metadata("design:returntype", void 0)
], SeatsController.prototype, "generateRoomSeats", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('ADMIN'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)(common_1.ValidationPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, create_seat_dto_1.UpdateSeatDto]),
    __metadata("design:returntype", void 0)
], SeatsController.prototype, "updateSeat", null);
__decorate([
    (0, common_1.Delete)('room/:roomId'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('ADMIN'),
    __param(0, (0, common_1.Param)('roomId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], SeatsController.prototype, "clearRoomSeats", null);
__decorate([
    (0, common_1.Post)('showtime/:showtimeId/hold'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('showtimeId', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)('seatIds')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Array]),
    __metadata("design:returntype", void 0)
], SeatsController.prototype, "holdSeats", null);
__decorate([
    (0, common_1.Post)('showtime/:showtimeId/release'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('showtimeId', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)('seatIds')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Array]),
    __metadata("design:returntype", void 0)
], SeatsController.prototype, "releaseSeats", null);
exports.SeatsController = SeatsController = __decorate([
    (0, common_1.Controller)('seats'),
    __metadata("design:paramtypes", [seats_service_1.SeatsService])
], SeatsController);
//# sourceMappingURL=seats.controller.js.map