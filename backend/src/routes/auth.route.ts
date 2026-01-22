import { Router } from 'express';
import { registerController } from '@controllers/auth.controller.js';
import { validateData } from '@middlewares/validationMiddleware.js';
import { registerSchema } from '@schemas/auth.schema.js';

/**
 * @todo Implement all the routes
 * - [ ] POST /api/auth/register
 * - [ ] POST /api/auth/login
 * - [ ] POST /api/auth/refresh
 * - [ ] DELETE /api/auth/token
 */
const router = Router();

router.post('/register', validateData(registerSchema), registerController);
// router.post('/login');
// router.post('/refresh');
// router.delete('/token');

export default router;
