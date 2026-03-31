export interface ChatData {
    chatId: string;
    userId: string;
    userFirstName: string;
    userLastName: string | null;
    status: 'ALL' | 'ONGOING' | 'ENDED';
    remainingQuota: number;
    createdAt: Date;
    updatedAt: Date;
}

export interface CreateChatData {
    chatId: string;
    remainingQuota: number;
    createdAt: Date;
    updatedAt: Date;
}

interface ReferencedDocuments {
    documentId: string;
    documentUrl: string;
}

export interface MessageData {
    messageId: string;
    chatId: string;
    userId: string | null;
    userFirstName: string | null;
    userLastName: string | null;
    content: string | null;
    referencedDocuments: ReferencedDocuments[] | null;
    createdAt: Date;
    updatedAt: Date;
}
