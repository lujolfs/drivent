import { Ticket, TicketType } from '@prisma/client';
import ticketRepository from '@/repositories/tickets-repository';
import enrollmentRepository from '@/repositories/enrollment-repository';
import { notFoundError } from '@/errors';

async function getTicketTypes(): Promise<TicketType[]> {
  const ticketTypes = await ticketRepository.findAllTypes();
  return ticketTypes;
}

async function getOneTicket(userId: number) {
  const enrollmentId = await enrollmentRepository.findWithAddressByUserId(userId);
  if (!enrollmentId) throw notFoundError();
  const userTicket = await ticketRepository.findTicketByEnrollmentId(enrollmentId.id);
  if (!userTicket) throw notFoundError();
  return userTicket;
}

const ticketsService = {
  getTicketTypes,
  getOneTicket,
};

export default ticketsService;
