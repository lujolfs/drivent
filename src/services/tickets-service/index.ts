import { TicketType } from '@prisma/client';
import ticketRepository from '@/repositories/tickets-repository';

async function getTicketTypes(): Promise<TicketType[]> {
  const ticketTypes = await ticketRepository.findAllTypes();
  return ticketTypes;
}

const ticketsService = {
  getTicketTypes,
};

export default ticketsService;
