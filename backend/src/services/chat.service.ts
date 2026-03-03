import { startSession, Types } from 'mongoose';
import type {
    CreateChatPayload,
    GetManyChatsPayload,
} from '@schemas/chat.schema.js';
import Chat from '@models/chat.js';
import User from '@/models/user.js';
import type { ChatData, CreateChatData } from '@/@types/chat.js';
import Garage from '@/models/garage.js';
import NotFoundError from '@/errors/NotFoundError.js';

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

    static async createChat(
        payload: CreateChatPayload
    ): Promise<{ chat: CreateChatData }> {
        const session = await startSession();

        const { chat } = await session.withTransaction(async () => {
            const [user, garage] = await Promise.all([
                User.findById(payload.userId),
                Garage.findById(payload.garageId),
            ]);

            if (!user) {
                throw new NotFoundError({
                    message: 'User does not exist',
                });
            } else if (!garage) {
                throw new NotFoundError({
                    message: 'Garage does not exist',
                });
            }

            const chat = await new Chat({
                garage: new Types.ObjectId(payload.garageId),
                user: new Types.ObjectId(payload.userId),
            }).save({ session });

            return {
                chat: {
                    chatId: chat._id.toString(),
                    remainingQuota: chat.remainingQuota,
                    createdAt: chat.createdAt,
                    updatedAt: chat.updatedAt,
                },
            };
        });

        return {
            chat,
        };
    }
}

export default ChatService;
