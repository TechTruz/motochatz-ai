import { Router } from 'express';
import {
    registerController,
    loginController,
    refreshController,
} from '@controllers/auth.controller.js';
import { requireRefreshToken } from '@middlewares/auth.middleware.js';

/**
 * @todo Implement all the routes
 * - [x] POST /api/auth/register
 * - [x] POST /api/auth/login
 * - [x] POST /api/auth/refresh
 * - [ ] DELETE /api/auth/token
 */
const router = Router();

router.post('/register', registerController);
router.post('/login', loginController);
router.get('/refresh', requireRefreshToken, refreshController);
// router.delete('/token');

export default router;
