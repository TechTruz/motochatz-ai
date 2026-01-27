import { Router } from 'express';
import {
    registerController,
    loginController,
    refreshController,
} from '@controllers/auth.controller.js';

/**
 * @todo Implement all the routes
 * - [x] POST /api/auth/register
 * - [x] POST /api/auth/login
 * - [WIP] POST /api/auth/refresh
 * - [ ] DELETE /api/auth/token
 */
const router = Router();

router.post('/register', registerController);
router.post('/login', loginController);
router.post('/refresh', refreshController);
// router.delete('/token');

export default router;
