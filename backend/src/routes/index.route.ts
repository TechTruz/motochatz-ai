import { Router } from 'express';
import authRoutes from '@routes/auth.route.js';
import documentRoutes from '@routes/document.route.js';
import streamRoutes from '@routes/stream.route.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/documents', documentRoutes);
router.use('/stream', streamRoutes);

export default router;
