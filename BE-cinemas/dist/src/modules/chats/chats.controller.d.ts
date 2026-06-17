import { ChatService } from './chats.service';
export declare class ChatController {
    private readonly chatService;
    constructor(chatService: ChatService);
    handleChat(message: string): Promise<{
        reply: string;
    }>;
}
