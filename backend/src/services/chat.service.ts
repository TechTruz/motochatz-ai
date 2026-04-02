import { startSession, Types } from 'mongoose';
import { PassThrough, Readable } from 'stream';
import { fetchEventSource } from '@microsoft/fetch-event-source';
import type {
    CreateChatPayload,
    GetManyChatMessagesPayload,
    GetManyChatsPayload,
    StreamChatPayload,
} from '@schemas/chat.schema.js';
import Chat from '@models/chat.js';
import User from '@models/user.js';
import Message from '@models/message.js';
import Document from '@models/document.js';
import type { ChatData, CreateChatData, MessageData } from '@/@types/chat.js';
import Garage from '@models/garage.js';
import NotFoundError from '@errors/NotFoundError.js';
import BadGatewayError from '@errors/BadGatewayError.js';
import Logger from '@utils/logger.js';

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

    static async getManyChatMessages(payload: GetManyChatMessagesPayload) {
        const session = await startSession();

        const { messages, total, totalWithCursor } =
            await session.withTransaction(async () => {
                const messageCursor = payload.cursor
                    ? await Message.findById(payload.cursor)
                    : null;

                const filters = {
                    chat: new Types.ObjectId(payload.chatId),
                    ...(messageCursor && {
                        createdAt: {
                            [payload.sort.includes('-') ? '$lt' : '$gt']:
                                messageCursor.createdAt,
                        },
                    }),
                };

                const messages: MessageData[] = await Message.aggregate()
                    .match(filters)
                    .addFields({
                        messageId: '$_id',
                        userId: 'users.$_id',
                        userFirstName: 'users.firstName',
                        userLastName: 'users.lastName',
                        referencedDocuments: {
                            $map: {
                                input: '$referencedDocuments',
                                as: 'doc',
                                in: {
                                    documentId: '$$doc._id',
                                    documentUrl: '$$doc.documentUrl',
                                },
                            },
                        },
                    })
                    .project({
                        _id: 0,
                        __v: 0,
                        user: 0,
                        chat: 0,
                    })
                    .sort({
                        [payload.sort.includes('-')
                            ? (payload.sort.split('-')[1] as string)
                            : (payload.sort as string)]: payload.sort.includes(
                            '-'
                        )
                            ? 'desc'
                            : 'asc',
                    })
                    .limit(payload.limit)
                    .exec();

                const total = await Message.find({
                    chat: filters.chat,
                }).countDocuments();

                const totalWithCursor =
                    await Message.find(filters).countDocuments();

                return {
                    messages,
                    total,
                    totalWithCursor,
                };
            });

        // Pagination metadata
        const meta: {
            total: number;
            latestCursor: string | null;
            oldestCursor: string | null;
            sort: string;
            count: number;
            hasNextPage: boolean;
            hasPrevPage: boolean;
        } = {
            total,
            latestCursor: null,
            oldestCursor: null,
            sort: payload.sort,
            count: messages.length,
            hasNextPage: totalWithCursor > messages.length,
            hasPrevPage: total > totalWithCursor,
        };

        if (meta.count !== 0) {
            if (payload.sort.includes('-')) {
                meta.latestCursor = messages[0]?.messageId.toString() ?? null;
                meta.oldestCursor =
                    messages[meta.count - 1]?.messageId.toString() ?? null;
            } else {
                meta.latestCursor =
                    messages[meta.count - 1]?.messageId.toString() ?? null;
                meta.oldestCursor = messages[0]?.messageId.toString() ?? null;
            }
        }

        return {
            messages,
            meta,
        };
    }

    static getChatResponse(
        payload: StreamChatPayload,
        signal?: AbortSignal
    ): Readable {
        const passThrough = new PassThrough();

        (async () => {
            try {
                const chat = await Chat.findOne({
                    _id: new Types.ObjectId(payload.chatId),
                    status: {
                        $in: ['ONGOING'],
                    },
                    remainingQuota: {
                        $gt: 0,
                    },
                });

                if (!chat) {
                    passThrough.destroy(
                        new NotFoundError({
                            message: 'Chat does not exist',
                        })
                    );

                    return;
                }

                const messages = await Message.find(
                    { chat: chat._id },
                    { content: 1, user: 1, createdAt: 1 }
                )
                    .sort({ createdAt: -1 })
                    .limit(10);

                const messageHistory = messages.map((msg) => {
                    return {
                        role: msg.user ? 'USER' : 'ASSISTANT',
                        message: msg.content,
                        createdAt: msg.createdAt,
                    };
                });

                await Message.insertOne({
                    chat: chat._id,
                    user: chat.user?._id,
                    content: payload.message,
                    referencedDocuments: [],
                });

                const requestBody = {
                    query: payload.message,
                    history: messageHistory,
                };

                let chatResponse = '';

                await fetchEventSource(
                    `${process.env.AI_SERVER_URL}/chat/stream`,
                    {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'X-API-Key': process.env.AI_API_KEY,
                        },
                        body: JSON.stringify(requestBody),
                        signal: signal ?? null,
                        openWhenHidden: true,
                        onopen: async (response) => {
                            if (!response.ok) {
                                const errorBody = await response.text();

                                Logger.error(
                                    `AI server responded with ${response.status} ${response.statusText}: ${errorBody}`
                                );

                                passThrough.destroy(
                                    new BadGatewayError({
                                        message:
                                            'There is a problem with upstream AI server',
                                    })
                                );
                            }
                        },
                        onmessage: (msg) => {
                            if (msg.event === 'message') {
                                const responseChunk = JSON.parse(msg.data);
                                chatResponse += `${responseChunk.content}`;
                            } else if (msg.event === 'status') {
                                const statusUpdate = JSON.parse(msg.data);

                                if (statusUpdate.status === 'ANSWERED') {
                                    let referencedDocuments: {
                                        documentId: Types.ObjectId;
                                        documentUrl: string;
                                    }[] = [];

                                    if (
                                        statusUpdate.documentReferenceId &&
                                        statusUpdate.documentReferenceId
                                            .length > 0
                                    ) {
                                        Document.find({
                                            _id: {
                                                $in: statusUpdate.documentReferenceId.map(
                                                    (id: string) =>
                                                        new Types.ObjectId(id)
                                                ),
                                            },
                                        })
                                            .exec()
                                            .then((docs) => {
                                                referencedDocuments = docs.map(
                                                    (doc) => {
                                                        return {
                                                            documentId: doc._id,
                                                            documentUrl:
                                                                doc.documentUrl,
                                                        };
                                                    }
                                                );
                                            })
                                            .catch((err) => {
                                                Logger.error(err);
                                                throw new Error(
                                                    'Failed when querying documents for chat response references'
                                                );
                                            });
                                    }

                                    Message.insertOne({
                                        content: chatResponse,
                                        referencedDocuments:
                                            referencedDocuments.map((doc) => {
                                                return new Types.ObjectId(
                                                    doc.documentId
                                                );
                                            }),
                                    }).catch((err) => {
                                        Logger.error(err);
                                        throw new Error(
                                            'Failed to insert AI chat response to the database'
                                        );
                                    });

                                    msg.data = JSON.stringify({
                                        status: statusUpdate.status,
                                        timestamp: statusUpdate.timestamp,
                                        referencedDocuments,
                                    });
                                }
                            }

                            let sseString = '';
                            if (msg.id) {
                                sseString += `id: ${msg.id}\n`;
                            }

                            if (msg.event) {
                                sseString += `event: ${msg.event}\n`;
                            }

                            sseString += `data: ${msg.data}\n\n`;
                            passThrough.write(sseString);
                        },
                        onclose: () => {
                            passThrough.end();
                        },
                        onerror: (err) => {
                            if (err instanceof TypeError) {
                                const badGatewayError = new BadGatewayError({
                                    message:
                                        'There is a problem with upstream AI server',
                                });

                                passThrough.destroy(badGatewayError);
                                throw badGatewayError;
                            }

                            passThrough.destroy(err);
                            throw err;
                        },
                    }
                );
            } catch (error) {
                passThrough.destroy(error as Error);
            }
        })();

        return passThrough;
    }
}

export default ChatService;
