import { Router } from 'express';
import { transactionRoutes } from './feature/presentation/routes/transaction.routes';

const router = Router();

// Feature routes
router.use('/transaction', transactionRoutes);

export default router;
