import { Router } from 'express';
import {
    getManyDocumentsController,
    getSignedUrlController,
} from '@controllers/document.controller.js';
import { requireAccessToken, authorize } from '@middlewares/auth.middleware.js';

const router = Router();

router.get(
    '/',
    requireAccessToken,
    authorize({
        ownerQueryParam: 'garageId',
    }),
    getManyDocumentsController
);
router.get('/signed-url', requireAccessToken, getSignedUrlController);

export default router;
