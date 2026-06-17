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
exports.ShowtimesController = void 0;
const common_1 = require("@nestjs/common");
const showtimes_service_1 = require("./showtimes.service");
const create_showtime_dto_1 = require("./dto/create-showtime.dto");
const jwt_auth_guard_1 = require("../../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../../auth/guards/roles.guard");
const roles_decorator_1 = require("../../auth/decorators/roles.decorator");
const seats_service_1 = require("../seats/seats.service");
function ok(data, message = 'Thành công') {
    return { message, data };
}
let ShowtimesController = class ShowtimesController {
    constructor(showtimesService, seatsService) {
        this.showtimesService = showtimesService;
        this.seatsService = seatsService;
    }
    async findByMovie(movieId, date, city) {
        const data = await this.showtimesService.findByMovie(movieId, date, city);
        return ok(data, 'Lấy suất chiếu theo phim thành công');
    }
    async findByCinema(cinemaId, date) {
        const data = await this.showtimesService.findByCinema(cinemaId, date);
        return ok(data, 'Lấy suất chiếu theo rạp thành công');
    }
    async getRoomLayout(id) {
        const data = await this.showtimesService.getRoomLayout(id);
        return ok(data, 'Lấy sơ đồ ghế thành công');
    }
    async findAll() {
        const data = await this.showtimesService.findAll();
        return ok(data, 'Lấy danh sách suất chiếu thành công');
    }
    async create(dto) {
        const data = await this.showtimesService.create(dto);
        return ok(data, 'Tạo suất chiếu thành công');
    }
    async update(id, dto) {
        const data = await this.showtimesService.update(id, dto);
        return ok(data, 'Cập nhật suất chiếu thành công');
    }
    async remove(id) {
        await this.showtimesService.remove(id);
        return { message: 'Xóa suất chiếu thành công' };
    }
    findOne(id) {
        return this.showtimesService.findOne(id);
    }
    getSeatsByShowtime(showtimeId) {
        return this.seatsService.findByShowtime(showtimeId);
    }
    holdSeats(showtimeId, seatIds) {
        return this.seatsService.holdSeats(showtimeId, seatIds);
    }
    releaseSeats(showtimeId, seatIds) {
        return this.seatsService.releaseSeats(showtimeId, seatIds);
    }
};
exports.ShowtimesController = ShowtimesController;
__decorate([
    (0, common_1.Get)('movie/:movieId'),
    __param(0, (0, common_1.Param)('movieId', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Query)('date')),
    __param(2, (0, common_1.Query)('city')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String, String]),
    __metadata("design:returntype", Promise)
], ShowtimesController.prototype, "findByMovie", null);
__decorate([
    (0, common_1.Get)('cinema/:cinemaId'),
    __param(0, (0, common_1.Param)('cinemaId', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Query)('date')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String]),
    __metadata("design:returntype", Promise)
], ShowtimesController.prototype, "findByCinema", null);
__decorate([
    (0, common_1.Get)('layout/:id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], ShowtimesController.prototype, "getRoomLayout", null);
__decorate([
    (0, common_1.Get)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('ADMIN'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ShowtimesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('ADMIN'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_showtime_dto_1.CreateShowtimeDto]),
    __metadata("design:returntype", Promise)
], ShowtimesController.prototype, "create", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('ADMIN'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, create_showtime_dto_1.UpdateShowtimeDto]),
    __metadata("design:returntype", Promise)
], ShowtimesController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('ADMIN'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], ShowtimesController.prototype, "remove", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], ShowtimesController.prototype, "findOne", null);
__decorate([
    (0, common_1.Get)(':id/seats'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], ShowtimesController.prototype, "getSeatsByShowtime", null);
__decorate([
    (0, common_1.Post)(':id/hold'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)('seatIds')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Array]),
    __metadata("design:returntype", void 0)
], ShowtimesController.prototype, "holdSeats", null);
__decorate([
    (0, common_1.Post)(':id/release'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)('seatIds')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Array]),
    __metadata("design:returntype", void 0)
], ShowtimesController.prototype, "releaseSeats", null);
exports.ShowtimesController = ShowtimesController = __decorate([
    (0, common_1.Controller)('showtimes'),
    __metadata("design:paramtypes", [showtimes_service_1.ShowtimesService, seats_service_1.SeatsService])
], ShowtimesController);
//# sourceMappingURL=showtimes.controller.js.map