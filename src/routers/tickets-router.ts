import { Router } from 'express';
import { authenticateToken } from '@/middlewares';
import { getTicketTypes, getUserTicket, createUserTicket } from '@/controllers/tickets-controller';

const ticketsRouter = Router();
ticketsRouter.all('/*', authenticateToken);
ticketsRouter.get('/types', getTicketTypes);
ticketsRouter.get('/', getUserTicket);
ticketsRouter.post('/', createUserTicket);

export { ticketsRouter };
