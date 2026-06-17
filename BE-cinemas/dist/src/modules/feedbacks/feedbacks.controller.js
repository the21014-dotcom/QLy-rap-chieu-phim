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
exports.FeedbacksController = void 0;
const common_1 = require("@nestjs/common");
const feedbacks_service_1 = require("./feedbacks.service");
const create_feedback_dto_1 = require("./dto/create-feedback.dto");
const jwt_auth_guard_1 = require("../../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../../auth/guards/roles.guard");
const roles_decorator_1 = require("../../auth/decorators/roles.decorator");
const update_feedback_dto_1 = require("./dto/update-feedback.dto");
let FeedbacksController = class FeedbacksController {
    constructor(feedbacksService) {
        this.feedbacksService = feedbacksService;
    }
    async create(req, createFeedbackDto) {
        const userId = req.user.id;
        const userRole = req.user.role?.name || req.user.role;
        return this.feedbacksService.createFeedback(userId, userRole, createFeedbackDto);
    }
    async findAll() {
        return this.feedbacksService.getAllFeedbacks();
    }
    async getByMovie(movieId) {
        return this.feedbacksService.getMovieFeedbacks(movieId);
    }
    async findOne(id) {
        return this.feedbacksService.getFeedbackDetail(id);
    }
    async update(id, req, updateFeedbackDto) {
        const userId = req.user.id;
        const userRole = req.user.role;
        return this.feedbacksService.updateFeedback(id, userId, userRole, updateFeedbackDto);
    }
    async remove(id, req) {
        const userId = req.user.id;
        const userRole = req.user.role;
        return this.feedbacksService.removeFeedback(id, userId, userRole);
    }
};
exports.FeedbacksController = FeedbacksController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_feedback_dto_1.CreateFeedbackDto]),
    __metadata("design:returntype", Promise)
], FeedbacksController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('ADMIN'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], FeedbacksController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('movie/:movieId'),
    __param(0, (0, common_1.Param)('movieId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], FeedbacksController.prototype, "getByMovie", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], FeedbacksController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object, update_feedback_dto_1.UpdateFeedbackDto]),
    __metadata("design:returntype", Promise)
], FeedbacksController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], FeedbacksController.prototype, "remove", null);
exports.FeedbacksController = FeedbacksController = __decorate([
    (0, common_1.Controller)('feedbacks'),
    __metadata("design:paramtypes", [feedbacks_service_1.FeedbacksService])
], FeedbacksController);
//# sourceMappingURL=feedbacks.controller.js.map