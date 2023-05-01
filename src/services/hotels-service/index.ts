import httpStatus from 'http-status';
import { notFoundError, notPaidError, requestError, unauthorizedError } from '@/errors';
import hotelRepository from '@/repositories/hotel-repository';
import enrollmentRepository from '@/repositories/enrollment-repository';
import ticketRepository from '@/repositories/tickets-repository';

async function getHotels(userId: number) {
  const enrollment = await enrollmentRepository.findByUserId(userId);
  if (!enrollment) throw notFoundError();
  const ticket = await ticketRepository.findTicketByEnrollmentId(enrollment.id);
  if (!ticket) throw notFoundError();
  if (ticket.status !== 'PAID') throw notPaidError();
  if (ticket.TicketType.isRemote) throw notPaidError();
  const hotels = await hotelRepository.findHotels();
  return hotels;
}

async function getHotelById(hotelId: number, userId: number) {
  const enrollment = await enrollmentRepository.findByUserId(userId);
  if (!enrollment) throw notFoundError();
  const ticket = await ticketRepository.findTicketByEnrollmentId(enrollment.id);
  if (!ticket) throw notFoundError();
  if (ticket.status !== 'PAID') throw notPaidError();
  if (ticket.TicketType.isRemote) throw notPaidError();
  const hotelRooms = await hotelRepository.findHotelById(hotelId);
  if (!hotelRooms) throw notFoundError();
  return hotelRooms;
}

const hotelsService = {
  getHotels,
  getHotelById,
};

export default hotelsService;
