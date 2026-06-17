import { ConfigService } from '@nestjs/config';
export declare class ChatService {
    private configService;
    private openai;
    constructor(configService: ConfigService);
    getChatResponse(userMessage: string): Promise<string>;
}
