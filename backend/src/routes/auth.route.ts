import { Router } from 'express';
import {
    registerController,
    loginController,
    refreshController,
    revokeTokenController,
} from '@controllers/auth.controller.js';
import {
    requireRefreshToken,
    requireAccessToken,
} from '@middlewares/auth.middleware.js';

const router = Router();

router.post('/register', registerController);
router.post('/login', loginController);
router.get('/refresh', requireRefreshToken, refreshController);
router.delete(
    '/token',
    requireRefreshToken,
    requireAccessToken,
    revokeTokenController
);

export default router;
