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
exports.ChatResponseDto = exports.SearchMovieDto = exports.RateMovieDto = exports.ChatDto = exports.MessageType = void 0;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const swagger_1 = require("@nestjs/swagger");
var MessageType;
(function (MessageType) {
    MessageType["TEXT"] = "TEXT";
    MessageType["VOICE"] = "VOICE";
    MessageType["IMAGE"] = "IMAGE";
})(MessageType || (exports.MessageType = MessageType = {}));
class ChatDto {
    constructor() {
        this.messageType = MessageType.TEXT;
        this.language = 'vi';
    }
}
exports.ChatDto = ChatDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Nội dung tin nhắn của người dùng',
        example: 'Cho mình hỏi lịch chiếu phim Doraemon hôm nay?',
    }),
    (0, class_validator_1.IsString)({ message: 'Tin nhắn phải là chuỗi văn bản' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Tin nhắn không được để trống' }),
    (0, class_validator_1.Length)(1, 1000, { message: 'Tin nhắn phải từ 1-1000 ký tự' }),
    __metadata("design:type", String)
], ChatDto.prototype, "message", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'ID của người dùng (nếu đã đăng nhập)',
        example: 1,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsNumber)({}, { message: 'User ID phải là số' }),
    (0, class_validator_1.Min)(1, { message: 'User ID phải lớn hơn 0' }),
    __metadata("design:type", Number)
], ChatDto.prototype, "userId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Loại tin nhắn',
        enum: MessageType,
        default: MessageType.TEXT,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(MessageType, { message: 'Loại tin nhắn không hợp lệ' }),
    __metadata("design:type", String)
], ChatDto.prototype, "messageType", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'ID phiên chat (để lưu lịch sử)',
        example: 'session-123',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: 'Session ID phải là chuỗi' }),
    __metadata("design:type", String)
], ChatDto.prototype, "sessionId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Ngôn ngữ của tin nhắn',
        example: 'vi',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: 'Ngôn ngữ phải là chuỗi' }),
    __metadata("design:type", String)
], ChatDto.prototype, "language", void 0);
class RateMovieDto {
}
exports.RateMovieDto = RateMovieDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'ID phim cần đánh giá',
        example: 1,
    }),
    (0, class_validator_1.IsNumber)({}, { message: 'Movie ID phải là số' }),
    (0, class_validator_1.Min)(1, { message: 'Movie ID không hợp lệ' }),
    __metadata("design:type", Number)
], RateMovieDto.prototype, "movieId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Điểm đánh giá (1-5 sao)',
        example: 5,
    }),
    (0, class_validator_1.IsNumber)({}, { message: 'Rating phải là số' }),
    (0, class_validator_1.Min)(1, { message: 'Rating tối thiểu là 1 sao' }),
    (0, class_validator_1.Max)(5, { message: 'Rating tối đa là 5 sao' }),
    __metadata("design:type", Number)
], RateMovieDto.prototype, "rating", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Nội dung đánh giá',
        example: 'Phim rất hay, khuyến khích mọi người xem!',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: 'Content phải là chuỗi' }),
    (0, class_validator_1.Length)(0, 500, { message: 'Nội dung tối đa 500 ký tự' }),
    __metadata("design:type", String)
], RateMovieDto.prototype, "content", void 0);
class SearchMovieDto {
    constructor() {
        this.limit = 10;
    }
}
exports.SearchMovieDto = SearchMovieDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Từ khóa tìm kiếm',
        example: 'Doraemon',
    }),
    (0, class_validator_1.IsString)({ message: 'Từ khóa phải là chuỗi' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Từ khóa không được để trống' }),
    __metadata("design:type", String)
], SearchMovieDto.prototype, "keyword", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Số lượng kết quả trả về',
        default: 10,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsNumber)({}, { message: 'Limit phải là số' }),
    (0, class_validator_1.Min)(1, { message: 'Limit tối thiểu là 1' }),
    (0, class_validator_1.Max)(50, { message: 'Limit tối đa là 50' }),
    __metadata("design:type", Number)
], SearchMovieDto.prototype, "limit", void 0);
class ChatResponseDto {
}
exports.ChatResponseDto = ChatResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Nội dung phản hồi' }),
    __metadata("design:type", String)
], ChatResponseDto.prototype, "reply", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Loại phản hồi' }),
    __metadata("design:type", String)
], ChatResponseDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Dữ liệu bổ sung' }),
    __metadata("design:type", Object)
], ChatResponseDto.prototype, "data", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Gợi ý câu hỏi tiếp theo' }),
    __metadata("design:type", Array)
], ChatResponseDto.prototype, "suggestions", void 0);
//# sourceMappingURL=chat.dto.js.map