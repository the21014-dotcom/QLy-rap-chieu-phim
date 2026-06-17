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
exports.StatisticsController = void 0;
const common_1 = require("@nestjs/common");
const statistics_service_1 = require("./statistics.service");
const jwt_auth_guard_1 = require("../../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../../auth/guards/roles.guard");
const roles_decorator_1 = require("../../auth/decorators/roles.decorator");
const statistic_query_dto_1 = require("./dto/statistic-query.dto");
let StatisticsController = class StatisticsController {
    constructor(statisticsService) {
        this.statisticsService = statisticsService;
    }
    async getSummary() {
        return await this.statisticsService.getSummaryStats();
    }
    async getCinemasBreakdown() {
        return await this.statisticsService.getCinemasBreakdown();
    }
    async getWeeklyRevenue() {
        return await this.statisticsService.getWeeklyRevenue();
    }
    async getTopMovies() {
        return await this.statisticsService.getTopMovies();
    }
    async getRevenueByPeriod(query) {
        return await this.statisticsService.getRevenueByPeriod(query.startDate, query.endDate);
    }
};
exports.StatisticsController = StatisticsController;
__decorate([
    (0, common_1.Get)('summary'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], StatisticsController.prototype, "getSummary", null);
__decorate([
    (0, common_1.Get)('cinemas-breakdown'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], StatisticsController.prototype, "getCinemasBreakdown", null);
__decorate([
    (0, common_1.Get)('revenue-weekly'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], StatisticsController.prototype, "getWeeklyRevenue", null);
__decorate([
    (0, common_1.Get)('top-movies'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], StatisticsController.prototype, "getTopMovies", null);
__decorate([
    (0, common_1.Get)('revenue-period'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [statistic_query_dto_1.StatisticQueryDto]),
    __metadata("design:returntype", Promise)
], StatisticsController.prototype, "getRevenueByPeriod", null);
exports.StatisticsController = StatisticsController = __decorate([
    (0, common_1.Controller)('statistics'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('ADMIN'),
    __metadata("design:paramtypes", [statistics_service_1.StatisticsService])
], StatisticsController);
//# sourceMappingURL=statistics.controller.js.map