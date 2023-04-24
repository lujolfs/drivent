import httpStatus from 'http-status';
import { notFoundError, notPaidError, requestError, unauthorizedError } from '@/errors';
import hotelRepository from '@/repositories/hotel-repository';
import enrollmentRepository from '@/repositories/enrollment-repository';
import ticketRepository from '@/repositories/tickets-repository';

async function getHotels(userId: number) {
  if (!userId) throw unauthorizedError();
  const checkEnrollment = await enrollmentRepository.findById(userId);
  if (!checkEnrollment) throw notFoundError();
  const checkTicket = await ticketRepository.findTicketByEnrollmentId(checkEnrollment.id);
  if (!checkTicket) throw notFoundError();
  if (
    checkTicket.status !== 'PAID' ||
    checkTicket.TicketType.isRemote === true ||
    checkTicket.TicketType.includesHotel === false
  )
    throw notPaidError();
  const hotels = await hotelRepository.findHotels();
  if (!hotels) throw notFoundError();
  return hotels;
}

async function getHotelById(hotelId: number, userId: number) {
  if (!userId) throw unauthorizedError();
  if (!hotelId) throw requestError(httpStatus.BAD_REQUEST, httpStatus['400_MESSAGE']);
  const checkEnrollment = await enrollmentRepository.findById(userId);
  if (!checkEnrollment) throw notFoundError();
  const checkTicket = await ticketRepository.findTicketByEnrollmentId(checkEnrollment.id);
  if (!checkTicket) throw unauthorizedError();
  if (
    checkTicket.status !== 'PAID' ||
    checkTicket.TicketType.isRemote === true ||
    checkTicket.TicketType.includesHotel === false
  )
    throw notPaidError();
  const hotelCheck = await hotelRepository.findHotelById(hotelId);
  if (!hotelCheck) throw notFoundError();
  return hotelCheck;
}

const hotelsService = {
  getHotels,
  getHotelById,
};

export default hotelsService;
