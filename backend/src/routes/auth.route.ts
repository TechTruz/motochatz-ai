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

/**
 * @todo Implement all the auth routes
 * - [x] POST /api/auth/register
 * - [x] POST /api/auth/login
 * - [x] GET /api/auth/refresh
 * - [x] DELETE /api/auth/token
 */
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
