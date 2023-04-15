import { Ticket, TicketType } from '@prisma/client';
import { prisma } from '@/config';

async function createTicket(ticketTypeId: number, enrollmentId: number) {
  return prisma.ticket.create({
    data: {
      status: 'RESERVED',
      ticketTypeId,
      enrollmentId,
    },
    include: {
      TicketType: true,
    },
  });
}

async function findAllTypes() {
  return prisma.ticketType.findMany();
}

async function findTicketByEnrollmentId(enrollmentId: number) {
  return prisma.ticket.findFirst({
    where: { enrollmentId },
    include: {
      TicketType: true,
    },
  });
}

const ticketRepository = {
  findAllTypes,
  findTicketByEnrollmentId,
  createTicket,
};

export default ticketRepository;
