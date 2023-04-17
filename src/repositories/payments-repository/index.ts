import { prisma } from '@/config';
import { PaymentData } from '@/services/payments-service';

async function findPaymentByTicketId(ticketId: number) {
  return prisma.payment.findFirst({
    where: { ticketId },
  });
}

async function createPaymentStatus(paymentInfo: PaymentData, ticketTypeValue: number, cardLastDigits: string) {
  return prisma.payment.create({
    data: {
      ticketId: paymentInfo.ticketId,
      value: ticketTypeValue,
      cardIssuer: paymentInfo.cardData.issuer,
      cardLastDigits: cardLastDigits,
    },
  });
}

const paymentRepository = {
  findPaymentByTicketId,
  createPaymentStatus,
};

export default paymentRepository;
