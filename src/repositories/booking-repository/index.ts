import { prisma } from '@/config';

async function getBooking(userId: number) {
  return prisma.booking.findFirst({
    where: { userId },
    include: { Room: true },
  });
}

async function getBookingById(bookingId: number) {
  return prisma.booking.findUnique({
    where: { id: bookingId },
  });
}

async function createBooking(userId: number, roomId: number) {
  return prisma.booking.create({
    data: {
      userId,
      roomId,
    },
  });
}

async function countBookings(roomId: number) {
  return prisma.booking.count({
    where: { roomId },
  });
}

async function getAllBookings() {
  return prisma.booking.findMany({});
}

async function updateBooking(bookingId: number, roomId: number) {
  return prisma.booking.update({
    where: {
      id: bookingId,
    },
    data: {
      roomId,
    },
  });
}

const bookingRepository = {
  getBooking,
  createBooking,
  countBookings,
  getAllBookings,
  updateBooking,
  getBookingById,
};

export default bookingRepository;
