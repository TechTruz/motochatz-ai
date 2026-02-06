import { Router } from 'express';
import {
    // getManyDocuments,
    getSignedUrlController,
} from '@controllers/document.controller.js';
import { requireAccessToken } from '@middlewares/auth.middleware.js';

/**
 * @todo Implement all the document routes
 * - [x] GET /api/documents/signed-url
 * - [ ] GET /api/documents
 */
const router = Router();

// router.get('/', requireAccessToken, getManyDocuments);
router.get('/signed-url', requireAccessToken, getSignedUrlController);

export default router;
