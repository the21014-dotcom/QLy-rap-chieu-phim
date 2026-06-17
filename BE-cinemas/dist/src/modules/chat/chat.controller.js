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
exports.ChatController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const chat_service_1 = require("./chat.service");
const chat_dto_1 = require("./dto/chat.dto");
const jwt_auth_guard_1 = require("../../auth/guards/jwt-auth.guard");
let ChatController = class ChatController {
    constructor(chatService) {
        this.chatService = chatService;
    }
    async handleChat(chatDto) {
        const reply = await this.chatService.getChatResponse(chatDto.message, chatDto.userId, chatDto.sessionId);
        return reply;
    }
    async rateMovie(rateDto, req) {
        const userId = req.user?.id;
        return this.chatService.rateMovie(userId, rateDto);
    }
    async searchMovie(searchDto) {
        return this.chatService.searchMovies(searchDto.keyword, searchDto.limit);
    }
    async getQuickActions(userId) {
        return this.chatService.getQuickActions(userId);
    }
    async getNowShowing() {
        return this.chatService.getNowShowingMovies();
    }
    async getSuggestions(userId) {
        return this.chatService.getMovieSuggestions(userId);
    }
};
exports.ChatController = ChatController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({
        summary: 'Gửi tin nhắn chat',
        description: 'Xử lý tin nhắn của người dùng và trả về phản hồi từ AI',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Phản hồi thành công',
        type: chat_dto_1.ChatResponseDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Dữ liệu đầu vào không hợp lệ',
    }),
    (0, swagger_1.ApiResponse)({
        status: 503,
        description: 'Dịch vụ AI không khả dụng',
    }),
    __param(0, (0, common_1.Body)(new common_1.ValidationPipe({ transform: true, whitelist: true }))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [chat_dto_1.ChatDto]),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "handleChat", null);
__decorate([
    (0, common_1.Post)('rate-movie'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Đánh giá phim',
        description: 'Người dùng đã đăng nhập có thể đánh giá phim',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Đánh giá thành công',
    }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: 'Chưa đăng nhập',
    }),
    __param(0, (0, common_1.Body)(new common_1.ValidationPipe({ transform: true, whitelist: true }))),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [chat_dto_1.RateMovieDto, Object]),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "rateMovie", null);
__decorate([
    (0, common_1.Post)('search-movie'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({
        summary: 'Tìm kiếm phim',
        description: 'Tìm kiếm phim theo từ khóa',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Kết quả tìm kiếm',
    }),
    __param(0, (0, common_1.Body)(new common_1.ValidationPipe({ transform: true, whitelist: true }))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [chat_dto_1.SearchMovieDto]),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "searchMovie", null);
__decorate([
    (0, common_1.Get)('quick-actions'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({
        summary: 'Lấy các hành động nhanh',
        description: 'Trả về danh sách các gợi ý hành động cho người dùng',
    }),
    (0, swagger_1.ApiQuery)({ name: 'userId', required: false, type: Number }),
    __param(0, (0, common_1.Query)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "getQuickActions", null);
__decorate([
    (0, common_1.Get)('now-showing'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({
        summary: 'Lấy danh sách phim đang chiếu',
        description: 'Trả về danh sách phim đang chiếu hôm nay',
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "getNowShowing", null);
__decorate([
    (0, common_1.Get)('suggestions'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({
        summary: 'Gợi ý phim cá nhân hóa',
        description: 'Trả về danh sách phim gợi ý cho người dùng (nếu đăng nhập)',
    }),
    (0, swagger_1.ApiQuery)({ name: 'userId', required: false, type: Number }),
    __param(0, (0, common_1.Query)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "getSuggestions", null);
exports.ChatController = ChatController = __decorate([
    (0, swagger_1.ApiTags)('Chat'),
    (0, common_1.Controller)('chat'),
    __metadata("design:paramtypes", [chat_service_1.ChatService])
], ChatController);
//# sourceMappingURL=chat.controller.js.map