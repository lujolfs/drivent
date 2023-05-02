import faker from '@faker-js/faker';
import { prisma } from '@/config';

export async function createBooking(userId: number, roomId: number) {
  return await prisma.booking.create({
    data: {
      userId,
      roomId,
    },
  });
}

export async function createManyBookings(
  dummyUserId1: number,
  dummyUserId2: number,
  dummyUserId3: number,
  roomId: number,
) {
  return await prisma.booking.createMany({
    data: [
      { userId: dummyUserId1, roomId },
      { userId: dummyUserId2, roomId },
      { userId: dummyUserId3, roomId },
    ],
  });
}

export async function createTwoBookings(dummyUserId1: number, dummyUserId2: number, roomId: number) {
  return await prisma.booking.createMany({
    data: [
      { userId: dummyUserId1, roomId },
      { userId: dummyUserId2, roomId },
    ],
  });
}
