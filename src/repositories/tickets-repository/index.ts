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

async function findTicketById(ticketId: number) {
  return prisma.ticket.findFirst({
    where: { id: ticketId },
  });
}

async function findTicketTypeById(ticketTypeId: number) {
  return prisma.ticketType.findUnique({
    where: { id: ticketTypeId },
  });
}

async function findTicketByEnrollmentId(enrollmentId: number) {
  return prisma.ticket.findFirst({
    where: { enrollmentId },
    include: {
      TicketType: true,
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
  findTicketById,
  findTicketByEnrollmentId,
  findTicketTypeById,
  createTicket,
  updateTicketStatus,
};

export default ticketRepository;
