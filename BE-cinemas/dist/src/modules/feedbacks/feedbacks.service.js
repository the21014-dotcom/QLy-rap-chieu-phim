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
exports.FeedbacksService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
let FeedbacksService = class FeedbacksService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createFeedback(currentUserId, role, dto) {
        const roleName = (role && typeof role === 'object')
            ? role.name
            : (role || '');
        const targetUserId = (roleName.toUpperCase() === 'ADMIN' && dto.user_id)
            ? Number(dto.user_id)
            : currentUserId;
        if (roleName.toUpperCase() !== 'ADMIN') {
            const hasBooked = await this.prisma.booking.findFirst({
                where: {
                    user_id: targetUserId,
                    status: 'SUCCESS',
                    showtime: { movie_id: dto.movie_id },
                },
            });
            if (!hasBooked) {
                throw new common_1.BadRequestException('Bạn cần mua vé xem phim này trước khi để lại đánh giá.');
            }
            const existingFeedback = await this.prisma.feedback.findFirst({
                where: { user_id: targetUserId, movie_id: dto.movie_id },
            });
            if (existingFeedback) {
                throw new common_1.BadRequestException('Mỗi phim bạn chỉ có thể đánh giá một lần.');
            }
        }
        return await this.prisma.feedback.create({
            data: {
                user_id: targetUserId,
                movie_id: dto.movie_id,
                content: dto.content,
                rating: dto.rating,
            },
            include: {
                user: { select: { full_name: true, avatar: true } }
            }
        });
    }
    async getMovieFeedbacks(movieId) {
        return await this.prisma.feedback.findMany({
            where: { movie_id: movieId },
            include: {
                user: { select: { id: true, full_name: true, avatar: true } },
            },
            orderBy: { created_at: 'desc' },
        });
    }
    async getAllFeedbacks() {
        return this.prisma.feedback.findMany({
            include: {
                user: { select: { full_name: true, email: true, avatar: true } },
                movie: { select: { title: true } },
            },
            orderBy: { created_at: 'desc' },
        });
    }
    async getFeedbackDetail(id) {
        const feedback = await this.prisma.feedback.findUnique({
            where: { id },
            include: {
                user: { select: { full_name: true, avatar: true } },
                movie: { select: { title: true } }
            }
        });
        if (!feedback)
            throw new common_1.NotFoundException('Không tìm thấy đánh giá này');
        return feedback;
    }
    async updateFeedback(id, userId, role, dto) {
        const feedback = await this.prisma.feedback.findUnique({ where: { id } });
        if (!feedback)
            throw new common_1.NotFoundException('Không tìm thấy đánh giá');
        if (feedback.user_id !== userId && role !== 'ADMIN') {
            throw new common_1.ForbiddenException('Bạn không có quyền chỉnh sửa đánh giá này');
        }
        return await this.prisma.feedback.update({
            where: { id },
            data: {
                content: dto.content,
                rating: dto.rating,
            },
        });
    }
    async removeFeedback(id, userId, role) {
        const feedback = await this.prisma.feedback.findUnique({ where: { id } });
        if (!feedback)
            throw new common_1.NotFoundException('Đánh giá không tồn tại');
        if (role !== 'ADMIN' && feedback.user_id !== userId) {
            throw new common_1.ForbiddenException('Bạn không có quyền xóa đánh giá này');
        }
        return await this.prisma.feedback.delete({ where: { id } });
    }
};
exports.FeedbacksService = FeedbacksService;
exports.FeedbacksService = FeedbacksService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], FeedbacksService);
//# sourceMappingURL=feedbacks.service.js.map