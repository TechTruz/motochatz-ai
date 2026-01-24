import { Router } from 'express';
import { registerController } from '@controllers/auth.controller.js';

/**
 * @todo Implement all the routes
 * - [x] POST /api/auth/register
 * - [ ] POST /api/auth/login
 * - [ ] POST /api/auth/refresh
 * - [ ] DELETE /api/auth/token
 */
const router = Router();

router.post('/register', registerController);
// router.post('/login');
// router.post('/refresh');
// router.delete('/token');

export default router;
