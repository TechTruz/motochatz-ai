import type { ChatData, CreateChatData, MessageData } from '@/@types/chat.js';

export class GetManyChatsDataDTO {
    private readonly chats: ChatData[];

    constructor(chats: ChatData[]) {
        this.chats = chats;
    }

    getObject() {
        return this.chats;
    }
}

export class CreateChatDataDTO {
    private readonly chat: CreateChatData;

    constructor(chat: CreateChatData) {
        this.chat = chat;
    }

    getObject() {
        return this.chat;
    }
}

export class GetManyChatMessagesDTO {
    private readonly messages: MessageData[];

    constructor(messages: MessageData[]) {
        this.messages = messages;
    }

    getObject() {
        return this.messages;
    }
}
