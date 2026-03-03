import type { Request, Response } from 'express';
import { GetManyChatsSchema } from '@schemas/chat.schema.js';
import validateData from '@utils/validator.js';
import ChatService from '@services/chat.service.js';
import { OffsetPaginationDTO, ResponsePayloadDTO } from '@dtos/api.dto.js';
import { GetManyChatsDataDTO, CreateChatDataDTO } from '@dtos/chat.dto.js';

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

// export declare function getManyChatMessagesController(
//     req: Request,
//     res: Response
// ): Promise<Response<any, Record<string, any>>>;
//
export async function createChatController(req: Request, res: Response) {
    const { chat } = await ChatService.createChat({
        userId: req.tokenPayload?.sub as string,
        garageId: req.tokenPayload?.garageId as string,
    });

    const createChatData = new CreateChatDataDTO(chat);

    const responsePayload = new ResponsePayloadDTO(createChatData.getObject());

    return res.status(201).json(responsePayload.getObject());
}
//
// export declare function streamChatController(
//     req: Request,
//     res: Response
// ): Promise<Response<any, Record<string, any>>>;
