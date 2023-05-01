import bookingRepository from '@/repositories/booking-repository';
import { notFoundError } from '@/errors';

async function getBooking(userId: number) {
  const booking = await bookingRepository.getBooking(userId);
  if (!booking) {
    throw notFoundError();
  }
  const bookingInfo = { id: booking.id, Room: booking.Room };
  return bookingInfo;
}

export default {
  getBooking,
};
