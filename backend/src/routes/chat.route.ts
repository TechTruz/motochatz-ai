import { Router } from 'express';
import {
    getManyChatsController,
    getManyChatMessagesController,
    createChatController,
} from '@controllers/chat.controller.js';
import { requireAccessToken, authorize } from '@middlewares/auth.middleware.js';

/**
 * @todo Implement all chat routes
 * - [x] GET /api/chats
 * - [x] GET /api/chats/:chatId/messages
 * - [x] POST /api/chats
 */
const router = Router();

router.get(
    '/',
    requireAccessToken,
    authorize({
        ownerQueryParam: 'garageId',
    }),
    getManyChatsController
);
router.get('/:id/messages', requireAccessToken, getManyChatMessagesController);
router.post('/', requireAccessToken, createChatController);

export default router;
