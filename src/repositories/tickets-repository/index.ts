import { Ticket, TicketType, TicketStatus } from '@prisma/client';
import { prisma } from '@/config';

async function createTicket(ticketTypeId: number, enrollmentId: number) {
  return prisma.ticket.create({
    data: {
      status: 'RESERVED',
      ticketTypeId,
      enrollmentId,
    },
  });
}

async function findAllTypes() {
  return prisma.ticketType.findMany();
}

async function findTicketByEnrollmentId(enrollmentId: number): Promise<
  Ticket & {
    TicketType: TicketType;
  }
> {
  return prisma.ticket.findFirst({
    where: { enrollmentId },
    include: { TicketType: true },
  });
}

async function findTicketTypeById(ticketTypeId: number) {
  return prisma.ticketType.findUnique({
    where: { id: ticketTypeId },
  });
}

async function ticketProcessPayment(ticketId: number) {
  return prisma.ticket.update({
    where: {
      id: ticketId,
    },
    data: {
      status: TicketStatus.PAID,
    },
  });
}
async function updateTicketStatus(ticketId: number) {
  return prisma.ticket.update({
    where: { id: ticketId },
    data: { status: 'PAID' },
  });
}

const ticketRepository = {
  findAllTypes,
  findTicketByEnrollmentId,
  findTicketTypeById,
  createTicket,
  updateTicketStatus,
  ticketProcessPayment,
};

export default ticketRepository;
