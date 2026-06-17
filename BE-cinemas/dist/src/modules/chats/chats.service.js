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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const openai_1 = __importDefault(require("openai"));
let ChatService = class ChatService {
    constructor(configService) {
        this.configService = configService;
        this.openai = new openai_1.default({
            apiKey: this.configService.get('OPENAI_API_KEY'),
        });
    }
    async getChatResponse(userMessage) {
        const model = this.configService.get('OPENAI_MODEL');
        try {
            const completion = await this.openai.chat.completions.create({
                model: model,
                messages: [
                    {
                        role: 'system',
                        content: `Bạn là trợ lý ảo của rạp phim CGV Hải Phòng. 
            Dữ liệu rạp: Hiện đang chiếu 'Doraemon' và 'Lật Mặt 7'. 
            Giá vé: 75.000đ - 120.000đ. 
            Hãy trả lời khách hàng cực kỳ thân thiện.`,
                    },
                    { role: 'user', content: userMessage },
                ],
            });
            return completion.choices[0].message?.content;
        }
        catch (error) {
            return 'AI đang bận, Linh thử lại sau nhé!';
        }
    }
};
exports.ChatService = ChatService;
exports.ChatService = ChatService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], ChatService);
//# sourceMappingURL=chats.service.js.map