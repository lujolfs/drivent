import { prisma } from '@/config';

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
};

export default ticketRepository;
