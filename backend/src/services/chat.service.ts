import type { GetManyChatsPayload } from '@schemas/chat.schema.js';
import Chat from '@models/chat.js';
import type { ChatData } from '@/@types/chat.js';

class ChatService {
    static async getManyChats(payload: GetManyChatsPayload): Promise<{
        chats: ChatData[];
        total: number;
    }> {
        // Implement
    }
}

export default ChatService;
