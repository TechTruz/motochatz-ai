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
