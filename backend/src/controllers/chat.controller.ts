import type { Request, Response } from 'express';
import {
    CreateChatSchema,
    GetManyChatsSchema,
    GetManyChatMessagesSchema,
    StreamChatSchema,
} from '@schemas/chat.schema.js';
import validateData from '@utils/validator.js';
import ChatService from '@services/chat.service.js';
import {
    OffsetPaginationDTO,
    CursorPaginationDTO,
    ResponsePayloadDTO,
} from '@dtos/api.dto.js';
import {
    GetManyChatsDataDTO,
    CreateChatDataDTO,
    GetManyChatMessagesDTO,
} from '@dtos/chat.dto.js';
import Logger from '@utils/logger.js';
import { CustomError } from '@errors/CustomError.js';

export async function getManyChatsController(req: Request, res: Response) {
    const data = validateData(GetManyChatsSchema, req.query);
    const { chats, total } = await ChatService.getManyChats(data);

    const getManyChatsData = new GetManyChatsDataDTO(chats);
    const offsetPagination = new OffsetPaginationDTO({
        limit: data.limit,
        total,
        count: chats.length,
        page: data.page,
    });

    const responsePayload = new ResponsePayloadDTO(
        getManyChatsData.getObject(),
        offsetPagination.getObject()
    );

    return res.status(200).json(responsePayload.getObject());
}

export async function getManyChatMessagesController(
    req: Request,
    res: Response
) {
    const data = validateData(GetManyChatMessagesSchema, {
        chatId: req.params?.id as string,
        ...req.query,
    });

    const { messages, meta } = await ChatService.getManyChatMessages(data);

    const getManyChatMessagesData = new GetManyChatMessagesDTO(messages);
    const cursorPagination = new CursorPaginationDTO(meta);
    const responsePayload = new ResponsePayloadDTO(
        getManyChatMessagesData.getObject(),
        cursorPagination.getObject()
    );

    return res.status(200).json(responsePayload.getObject());
}

export async function createChatController(req: Request, res: Response) {
    const data = validateData(CreateChatSchema, {
        userId: req.tokenPayload?.sub,
        garageId: req.tokenPayload?.garageId,
    });

    const { chat } = await ChatService.createChat(data);

    const createChatData = new CreateChatDataDTO(chat);
    const responsePayload = new ResponsePayloadDTO(createChatData.getObject());

    return res.status(201).json(responsePayload.getObject());
}

export async function streamChatController(req: Request, res: Response) {
    const data = validateData(StreamChatSchema, {
        chatId: req.query?.chatId as string,
        message: req.body?.message as string,
    });

    res.set({
        'Content-Type': 'text/event-stream; charset=utf-8',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
        'X-Accel-Buffering': 'no',
    });
    res.flushHeaders();

    const abortController = new AbortController();
    const aiResponseStream = ChatService.getChatResponse(
        data,
        abortController.signal
    );

    req.on('close', () => {
        if (!abortController.signal.aborted) {
            abortController.abort();
        }
    });

    aiResponseStream.on('error', (err: Error | CustomError) => {
        let errorDetails = {
            code: 502,
            message: err.message,
        };

        if (err instanceof CustomError) {
            errorDetails = {
                code: err.statusCode,
                message: err.message,
            };
        } else {
            Logger.error('SSE error:', err);
            Logger.error('SSE error stack:', err.stack);
        }

        if (!abortController.signal.aborted) {
            abortController.abort();
        }

        res.write(`event: error\n`);
        res.write(`data: ${JSON.stringify(errorDetails)}\n\n`);
        res.end();
    });

    aiResponseStream.pipe(res);
}
