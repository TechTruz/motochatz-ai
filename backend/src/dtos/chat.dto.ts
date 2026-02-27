import type { ChatData } from '@/@types/chat.js';

export class GetManyChatsDataDTO {
    private readonly chats: ChatData[];

    constructor(chats: ChatData[]) {
        this.chats = chats;
    }

    getObject() {
        return this.chats;
    }
}
