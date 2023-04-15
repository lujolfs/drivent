import { Router } from 'express';
import { authenticateToken } from '@/middlewares';
import { getTicketTypes, getUserTicket } from '@/controllers/tickets-controller';

const ticketsRouter = Router();

ticketsRouter.get('/types', authenticateToken, getTicketTypes);
ticketsRouter.get('/', authenticateToken, getUserTicket);

export { ticketsRouter };
