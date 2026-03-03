import { startSession, Types } from 'mongoose';
import type { GetManyChatsPayload } from '@schemas/chat.schema.js';
import Chat from '@models/chat.js';
import type { ChatData } from '@/@types/chat.js';

class ChatService {
    static async getManyChats(payload: GetManyChatsPayload): Promise<{
        chats: ChatData[];
        total: number;
    }> {
        const session = await startSession();

        const { chats, total } = await session.withTransaction(async () => {
            const filters = {
                garage: new Types.ObjectId(payload.garageId),
                ...(payload.status !== 'ALL' && { status: payload.status }),
            };

            const chats: ChatData[] = await Chat.aggregate()
                .match(filters)
                .addFields({
                    chatId: '$_id',
                    userId: 'users.$_id',
                    userFirstName: 'users.firstName',
                    userLastName: 'users.lastName',
                })
                .project({
                    _id: 0,
                    __v: 0,
                    garage: 0,
                    user: 0,
                })
                .sort({
                    [payload.sort.includes('chatId')
                        ? '_id'
                        : payload.sort.includes('-')
                          ? (payload.sort.split('-')[1] as string)
                          : (payload.sort as string)]: payload.sort.includes(
                        '-'
                    )
                        ? 'desc'
                        : 'asc',
                })
                .skip(payload.limit * (payload.page - 1))
                .limit(payload.limit)
                .exec();

            const total = await Chat.find(filters).countDocuments();

            return {
                chats,
                total,
            };
        });

        return {
            chats,
            total,
        };
    }
}

export default ChatService;
