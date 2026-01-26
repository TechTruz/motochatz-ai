import { Router } from 'express';
import {
    registerController,
    loginController,
} from '@controllers/auth.controller.js';

/**
 * @todo Implement all the routes
 * - [x] POST /api/auth/register
 * - [WIP] POST /api/auth/login
 * - [ ] POST /api/auth/refresh
 * - [ ] DELETE /api/auth/token
 */
const router = Router();

router.post('/register', registerController);
router.post('/login', loginController);
// router.post('/refresh');
// router.delete('/token');

export default router;
