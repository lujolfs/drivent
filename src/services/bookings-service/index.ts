import bookingRepository from '@/repositories/booking-repository';
import enrollmentRepository from '@/repositories/enrollment-repository';
import { forbiddenError, notFoundError } from '@/errors';
import ticketRepository from '@/repositories/tickets-repository';
import roomRepository from '@/repositories/room-repository';

async function getBooking(userId: number) {
  const booking = await bookingRepository.getBooking(userId);
  if (!booking) throw notFoundError();
  const bookingInfo = { id: booking.id, Room: booking.Room };
  return bookingInfo;
}

async function createBooking(userId: number, roomId: number) {
  const room = await roomRepository.findRoomById(roomId);
  if (!room) {
    throw notFoundError();
  }

  const enrollment = await enrollmentRepository.findByUserId(userId);
  if (!enrollment) {
    throw forbiddenError();
  }

  const ticket = await ticketRepository.findTicketByEnrollmentId(enrollment.id);
  if (!ticket || ticket.TicketType.isRemote || ticket.status !== 'PAID' || !ticket.TicketType.includesHotel) {
    throw forbiddenError();
  }

  const countBookings = await bookingRepository.countBookings(roomId);
  if (countBookings >= room.capacity) {
    throw forbiddenError();
  }

  const createBooking = await bookingRepository.createBooking(userId, roomId);
  const bookingId = createBooking.id;
  return bookingId;
}

export default {
  getBooking,
  createBooking,
};
