import { TicketType } from '@prisma/client';
import ticketRepository from '@/repositories/tickets-repository';
import enrollmentRepository from '@/repositories/enrollment-repository';
import { notFoundError, couldntCreateError } from '@/errors';

async function createTicket(userId: number, ticketTypeId: number) {
  const enrollment = await enrollmentRepository.findByUserId(userId);
  if (!enrollment) throw notFoundError();
  const ticketCreation = await ticketRepository.createTicket(ticketTypeId, enrollment.id);
  if (!ticketCreation) throw couldntCreateError();
  const userTicket = await ticketRepository.findTicketByEnrollmentId(enrollment.id);
  if (!userTicket) throw notFoundError();
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
