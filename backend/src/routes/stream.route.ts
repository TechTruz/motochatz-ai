import { Router } from 'express';
import { requireAccessToken } from '@middlewares/auth.middleware.js';
import { ingestDocumentController } from '@controllers/document.controller.js';
import { streamChatController } from '@controllers/chat.controller.js';

/**
 * @todo Implement all the stream routes
 * - [x] GET /api/stream/ingest
 * - [ ] GET /api/stream/chat
 */
const router = Router();

router.get('/ingest', requireAccessToken, ingestDocumentController);
router.post('/chat', requireAccessToken, streamChatController);

export default router;
