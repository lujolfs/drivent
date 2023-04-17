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

export type PaymentData = {
  ticketId: number;
  cardData: {
    issuer: string;
    number: number;
    name: string;
    expirationDate: Date;
    cvv: number;
  };
};

async function createPayment(payInfo: PaymentData, userId: number) {
  if (!payInfo.cardData || !payInfo.ticketId) throw requestError(httpStatus.BAD_REQUEST, httpStatus['400_MESSAGE']);
  const ticketById = await ticketRepository.findTicketById(payInfo.ticketId);
  if (!ticketById) throw notFoundError();
  const ticketTypeById = await ticketRepository.findTicketTypeById(ticketById.ticketTypeId);
  if (!ticketTypeById) throw notFoundError();
  const userByTicketId = await enrollmentRepository.findEnrollment(ticketById.enrollmentId);
  if (userByTicketId.User.id !== userId) throw unauthorizedError();
  const lastFourDigits = payInfo.cardData.number.toString().slice(-4);
  const createPayment = await paymentRepository.createPaymentStatus(payInfo, ticketTypeById.price, lastFourDigits);
  if (!createPayment) throw requestError(httpStatus.BAD_REQUEST, httpStatus['400_MESSAGE']);
  const paymentByTicketId = await paymentRepository.findPaymentByTicketId(payInfo.ticketId);
  return paymentByTicketId;
}

const paymentsService = {
  getPaymentByTicketId,
  createPayment,
};

export default paymentsService;
