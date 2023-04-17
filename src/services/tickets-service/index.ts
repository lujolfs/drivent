import { Ticket, TicketType } from '@prisma/client';
import ticketRepository from '@/repositories/tickets-repository';
import enrollmentRepository from '@/repositories/enrollment-repository';
import { notFoundError, invalidDataError } from '@/errors';

async function createTicket(userId: number, ticketTypeId: number): Promise<Ticket> {
  const enrollmentId = await enrollmentRepository.findWithAddressByUserId(userId);
  if (!enrollmentId.id) throw notFoundError();
  const createTicket = await ticketRepository.createTicket(ticketTypeId, enrollmentId.id);
  if (!createTicket) throw notFoundError();
  const userTicket = await ticketRepository.findTicketByEnrollmentId(enrollmentId.id);
  return userTicket;
}

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
  createTicket,
};

export default ticketsService;
