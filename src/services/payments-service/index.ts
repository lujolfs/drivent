import { Payment } from '@prisma/client';
import httpStatus from 'http-status';
import { notFoundError, requestError, unauthorizedError } from '@/errors';
import paymentRepository from '@/repositories/payments-repository';
import enrollmentRepository from '@/repositories/enrollment-repository';
import ticketRepository from '@/repositories/tickets-repository';

async function getPaymentByTicketId(ticketId: number, userId: number): Promise<Payment> {
  if (!ticketId) throw requestError(httpStatus.BAD_REQUEST, httpStatus['400_MESSAGE']);
  const ticketById = await ticketRepository.findTicketById(ticketId);
  if (!ticketById) throw notFoundError();
  const enrollmentByUser = await enrollmentRepository.findByUserId(userId);
  if (enrollmentByUser.id !== ticketById.enrollmentId) throw unauthorizedError();
  const paymentByTicketId = await paymentRepository.findPaymentByTicketId(ticketId);
  return paymentByTicketId;
}

const paymentsService = {
  getPaymentByTicketId,
};

export default paymentsService;
