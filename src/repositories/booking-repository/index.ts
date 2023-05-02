import { prisma } from '@/config';

async function getBooking(userId: number) {
  return prisma.booking.findFirst({
    where: { userId },
    include: { Room: true },
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

const bookingRepository = {
  getBooking,
  createBooking,
  countBookings,
  getAllBookings,
};

export default bookingRepository;
