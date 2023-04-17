import { Router } from 'express';
import { getPaymentByTicketId, payTicket } from '@/controllers/payments.controller';
import { authenticateToken } from '@/middlewares';

const paymentsRouter = Router();
paymentsRouter.all('/*', authenticateToken);
paymentsRouter.get('/', getPaymentByTicketId);
paymentsRouter.post('/process', payTicket);

export { paymentsRouter };
