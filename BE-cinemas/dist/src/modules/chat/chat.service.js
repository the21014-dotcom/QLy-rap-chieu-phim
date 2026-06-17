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
var ChatService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const prisma_service_1 = require("../../prisma/prisma.service");
const generative_ai_1 = require("@google/generative-ai");
let ChatService = ChatService_1 = class ChatService {
    constructor(configService, prisma) {
        this.configService = configService;
        this.prisma = prisma;
        this.logger = new common_1.Logger(ChatService_1.name);
        this.conversationContexts = new Map();
        this.MAX_CONTEXT_LENGTH = 10;
        const apiKey = this.configService.get('GEMINI_API_KEY');
        if (apiKey) {
            this.genAI = new generative_ai_1.GoogleGenerativeAI(apiKey);
            this.logger.log('✅ Google Generative AI initialized');
        }
        else {
            this.logger.warn('⚠️ GEMINI_API_KEY not found - running in demo mode');
        }
    }
    getErrorMessage(error) {
        return error instanceof Error ? error.message : 'Unknown error';
    }
    async getChatResponse(userMessage, userId, sessionId) {
        try {
            const currentSessionId = sessionId || 'session-' + Date.now();
            if (!this.conversationContexts.has(currentSessionId)) {
                const movieContext = await this.getNowShowingContext();
                this.conversationContexts.set(currentSessionId, {
                    messages: [],
                    movieContext,
                });
            }
            const context = this.conversationContexts.get(currentSessionId);
            context.messages.push({ role: 'user', content: userMessage });
            if (context.messages.length > this.MAX_CONTEXT_LENGTH) {
                context.messages = context.messages.slice(-this.MAX_CONTEXT_LENGTH);
            }
            const prompt = this.buildPrompt(userMessage, context, userId);
            let aiReply;
            let responseType = 'TEXT';
            if (this.genAI) {
                try {
                    const model = this.genAI.getGenerativeModel({
                        model: 'gemini-2.0-flash'
                    });
                    const result = await model.generateContent(prompt);
                    aiReply = result.response.text();
                }
                catch (aiError) {
                    this.logger.error('AI Error: ' + this.getErrorMessage(aiError));
                    aiReply = this.getFallbackResponse(userMessage);
                }
            }
            else {
                aiReply = this.getDemoResponse(userMessage);
            }
            context.messages.push({ role: 'assistant', content: aiReply });
            const intentResult = this.parseIntent(userMessage, aiReply);
            if (intentResult) {
                responseType = intentResult.type;
            }
            const suggestions = this.generateSuggestions(userMessage);
            return {
                reply: aiReply,
                type: responseType,
                data: intentResult?.data,
                suggestions,
            };
        }
        catch (error) {
            this.logger.error('Chat Error: ' + this.getErrorMessage(error));
            throw new common_1.HttpException('Xin lỗi, có lỗi xảy ra. Vui lòng thử lại sau! 🙏', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    buildPrompt(userMessage, context, userId) {
        const now = new Date();
        const dateStr = now.toLocaleDateString('vi-VN', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
        const timeStr = now.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
        const history = context.messages.map((m) => m.role + ': ' + m.content).join('\n');
        let prompt = 'Bạn là trợ lý ảo của rạp chiếu phim CGV. ';
        prompt += 'Ngày hôm nay: ' + dateStr + '\n';
        prompt += 'Giờ hiện tại: ' + timeStr + '\n\n';
        prompt += '## THÔNG TIN PHIM ĐANG CHIẾU:\n';
        prompt += (context.movieContext || 'Liên hệ để biết phim đang chiếu') + '\n\n';
        prompt += '## NGUYÊN TẮC TRẢ LỜI:\n';
        prompt += '1. Trả lời NGẮN GỌN, THÂN THIỆN, dùng icon 🎬🍿\n';
        prompt += '2. Nếu khách hỏi về lịch chiếu -> Truy vấn thông tin\n';
        prompt += '3. Nếu khách hỏi về giá vé -> Nói rõ giá tiền và các loại ghế\n';
        prompt += '4. Nếu khách muốn đặt vé -> Hướng dẫn chọn phim, suất chiếu, chỗ ngồi\n\n';
        prompt += '## LỊCH SỬ CHAT:\n';
        prompt += history + '\n\n';
        prompt += 'Người dùng: ' + userMessage + '\n';
        prompt += 'Trợ lý:';
        return prompt;
    }
    parseIntent(userMessage, aiReply) {
        const lowerMessage = userMessage.toLowerCase();
        if (lowerMessage.includes('lịch') ||
            lowerMessage.includes('suất') ||
            lowerMessage.includes('chiếu') ||
            lowerMessage.includes('mấy giờ')) {
            return { type: 'SHOWTIME_LIST' };
        }
        if (lowerMessage.includes('phim gì') ||
            lowerMessage.includes('có phim') ||
            lowerMessage.includes('đang chiếu')) {
            return { type: 'MOVIE_LIST' };
        }
        if (lowerMessage.includes('đặt vé') ||
            lowerMessage.includes('mua vé') ||
            lowerMessage.includes('book')) {
            return { type: 'BOOKING_INFO' };
        }
        return null;
    }
    generateSuggestions(userMessage) {
        const lowerMessage = userMessage.toLowerCase();
        const suggestions = [];
        if (lowerMessage.includes('phim')) {
            suggestions.push('🎬 Xem lịch chiếu hôm nay');
            suggestions.push('🍿 Mua vé xem phim');
        }
        else if (lowerMessage.includes('lịch') || lowerMessage.includes('suất')) {
            suggestions.push('🎬 Phim đang chiếu');
            suggestions.push('🍿 Đặt vé ngay');
        }
        else if (lowerMessage.includes('giá') || lowerMessage.includes('tiền')) {
            suggestions.push('📅 Lịch chiếu');
            suggestions.push('🎬 Phim hay nhất');
        }
        else {
            suggestions.push('🎬 Phim đang chiếu');
            suggestions.push('📅 Lịch chiếu hôm nay');
            suggestions.push('🍿 Đặt vé xem phim');
            suggestions.push('❓ Liên hệ hỗ trợ');
        }
        return suggestions.slice(0, 4);
    }
    async getNowShowingContext() {
        try {
            const movies = await this.prisma.movie.findMany({
                where: {
                    is_active: true,
                    release_date: { lte: new Date() },
                    OR: [{ end_date: null }, { end_date: { gte: new Date() } }],
                },
                take: 10,
                include: {
                    genres: {
                        include: { genre: true },
                    },
                },
            });
            if (movies.length === 0)
                return 'Không có phim đang chiếu';
            return movies
                .map((m) => {
                const genreNames = m.genres.map((g) => g.genre.name).join(', ') || 'Chưa phân loại';
                return '- "' + m.title + '" (' + m.duration + 'p, ' + m.rating + ') - ' + genreNames;
            })
                .join('\n');
        }
        catch (error) {
            this.logger.error('Error fetching movies: ' + this.getErrorMessage(error));
            return 'Không lấy được danh sách phim';
        }
    }
    async getNowShowingMovies() {
        try {
            const movies = await this.prisma.movie.findMany({
                where: {
                    is_active: true,
                    release_date: { lte: new Date() },
                    OR: [{ end_date: null }, { end_date: { gte: new Date() } }],
                },
                include: {
                    genres: {
                        include: { genre: true },
                    },
                },
                orderBy: { release_date: 'desc' },
                take: 20,
            });
            return { success: true, data: movies };
        }
        catch (error) {
            this.logger.error('Error: ' + this.getErrorMessage(error));
            return { success: false, message: 'Lỗi khi lấy danh sách phim' };
        }
    }
    async searchMovies(keyword, limit = 10) {
        try {
            const movies = await this.prisma.movie.findMany({
                where: {
                    is_active: true,
                    title: { contains: keyword },
                },
                select: {
                    id: true,
                    title: true,
                    poster_url: true,
                    duration: true,
                    rating: true,
                },
                take: limit,
            });
            return { success: true, data: movies, total: movies.length };
        }
        catch (error) {
            this.logger.error('Error: ' + this.getErrorMessage(error));
            return { success: false, message: 'Lỗi khi tìm kiếm phim' };
        }
    }
    async rateMovie(userId, rateDto) {
        try {
            const movie = await this.prisma.movie.findUnique({
                where: { id: rateDto.movieId },
            });
            if (!movie) {
                throw new common_1.HttpException('Phim không tồn tại', common_1.HttpStatus.NOT_FOUND);
            }
            const existingFeedback = await this.prisma.feedback.findFirst({
                where: { user_id: userId, movie_id: rateDto.movieId },
            });
            if (existingFeedback) {
                const updated = await this.prisma.feedback.update({
                    where: { id: existingFeedback.id },
                    data: {
                        rating: rateDto.rating,
                        content: rateDto.content || existingFeedback.content,
                    },
                });
                return { success: true, message: 'Đánh giá đã được cập nhật!', data: updated };
            }
            else {
                const feedback = await this.prisma.feedback.create({
                    data: {
                        user_id: userId,
                        movie_id: rateDto.movieId,
                        rating: rateDto.rating,
                        content: rateDto.content || '',
                    },
                });
                return { success: true, message: 'Cảm ơn bạn đã đánh giá!', data: feedback };
            }
        }
        catch (error) {
            this.logger.error('Error: ' + this.getErrorMessage(error));
            throw new common_1.HttpException('Lỗi khi đánh giá phim', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getMovieSuggestions(userId) {
        try {
            if (!userId) {
                const popularMovies = await this.prisma.feedback.groupBy({
                    by: ['movie_id'],
                    _avg: { rating: true },
                    _count: { movie_id: true },
                    orderBy: { _count: { movie_id: 'desc' } },
                    take: 10,
                });
                const movieIds = popularMovies.map((f) => f.movie_id);
                const movies = await this.prisma.movie.findMany({
                    where: { id: { in: movieIds } },
                    select: {
                        id: true,
                        title: true,
                        poster_url: true,
                        duration: true,
                    },
                });
                return { success: true, data: movies, type: 'popular' };
            }
            const userFeedbacks = await this.prisma.feedback.findMany({
                where: { user_id: userId },
                orderBy: { created_at: 'desc' },
                take: 5,
            });
            if (userFeedbacks.length === 0) {
                return this.getMovieSuggestions();
            }
            const favoriteGenreIds = await this.prisma.movieGenre.groupBy({
                by: ['genre_id'],
                where: {
                    movie_id: { in: userFeedbacks.map((f) => f.movie_id) },
                },
                _count: { genre_id: true },
                orderBy: { _count: { genre_id: 'desc' } },
                take: 3,
            });
            const genreIds = favoriteGenreIds.map((g) => g.genre_id);
            const ratedMovieIds = userFeedbacks.map((f) => f.movie_id);
            const suggestions = await this.prisma.movie.findMany({
                where: {
                    is_active: true,
                    genres: { some: { genre_id: { in: genreIds } } },
                    id: { notIn: ratedMovieIds },
                },
                select: {
                    id: true,
                    title: true,
                    poster_url: true,
                    duration: true,
                    rating: true,
                },
                take: 10,
            });
            return { success: true, data: suggestions, type: 'personalized' };
        }
        catch (error) {
            this.logger.error('Error: ' + this.getErrorMessage(error));
            return { success: false, message: 'Lỗi khi gợi ý phim' };
        }
    }
    async getQuickActions(userId) {
        const actions = [
            { label: '🎬 Phim đang chiếu', intent: 'now_showing' },
            { label: '📅 Lịch chiếu hôm nay', intent: 'today_showtime' },
            { label: '🍿 Mua vé ngay', intent: 'book_ticket' },
            { label: '❓ Liên hệ hỗ trợ', intent: 'support' },
        ];
        if (userId) {
            actions.push({ label: '❤️ Phim yêu thích', intent: 'favorites' });
            actions.push({ label: '📝 Đánh giá của tôi', intent: 'my_reviews' });
        }
        return { success: true, actions };
    }
    getDemoResponse(userMessage) {
        const lowerMessage = userMessage.toLowerCase();
        if (lowerMessage.includes('phim')) {
            return '🍿 Hiện tại CGV đang chiếu những phim rất hay:\n\n• 🎬 Phim Điện Ảnh Doraemon: Nobita và Lâu Đài Dưới Đáy Biển (Phiên bản mới)\n• 🎬 Tây Du Ký Đại Náo - Phim hài hành động\n• 🎬 Phí phông - Phim kinh dị,hồi hộp\n\nBạn muốn xem phim nào nhất?';
        }
        if (lowerMessage.includes('lịch') ||
            lowerMessage.includes('suất') ||
            lowerMessage.includes('chiếu') ||
            lowerMessage.includes('mấy giờ')) {
            return '📅 Lịch chiếu hôm nay:\n\n• Doraemon: 8:40, 10:00, 14:00, 18:00, 19:15, 20:15\n• Ma da Hàn Quốc: 8:45, 15:15, 20:00\n• Phí phông: 10:50, 11:00, 13:00, 15:16, 17:00, 21:15, 22:00\n\nBạn muốn đặt suất nào? 🎬';
        }
        if (lowerMessage.includes('giá') || lowerMessage.includes('tiền')) {
            return '💰 Bảng giá vé CGV:\n\n• Ghế thường: 85.000đ\n• Ghế VIP: 105.000đ\n• Ghế Sweetbox: 350.000đ\n• Suất IMAX: 120.000đ\n\nBạn muốn chọn loại ghế nào?';
        }
        if (lowerMessage.includes('đặt') ||
            lowerMessage.includes('mua') ||
            lowerMessage.includes('book')) {
            return '🍿 Để đặt vé, bạn cần:\n1. Chọn phim muốn xem\n2. Chọn suất chiếu\n3. Chọn chỗ ngồi\n4. Thanh toán\n\nBạn đã sẵn sàng chưa?';
        }
        return 'Xin chào! 👋\n\nMình là trợ lý ảo của CGV. Bạn cần hỗ trợ gì?\n\n🎬 Xem phim đang chiếu\n📅 Lịch chiếu hôm nay\n💰 Giá vé\n🍿 Đặt vé xem phim';
    }
    getFallbackResponse(userMessage) {
        return 'Xin lỗi bạn, hiện tại mình đang gặp chút trục trặc với hệ thống AI. 😢\n\nMình vẫn có thể giúp bạn với những thông tin cơ bản:\n\n🎬 Phim đang chiếu: Doraemon 2024, Lật Mặt 7, Đấu Phá Thương Khung\n📅 Lịch chiếu hôm nay: Nhiều suất từ 10:00 đến 20:00\n💰 Giá vé: Từ 75.000đ đến 120.000đ\n\nBạn muốn biết thêm gì không?';
    }
};
exports.ChatService = ChatService;
exports.ChatService = ChatService = ChatService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService,
        prisma_service_1.PrismaService])
], ChatService);
//# sourceMappingURL=chat.service.js.map