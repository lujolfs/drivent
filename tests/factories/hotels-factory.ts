import faker from '@faker-js/faker';
import { Room } from '@prisma/client';
import { prisma } from '@/config';

export async function createHotel() {
  return prisma.hotel.create({
    data: {
      name: faker.company.companyName(),
      image: faker.image.imageUrl(),
      createdAt: faker.date.past(),
      updatedAt: faker.date.recent(),
    },
  });
}

export async function createRoom(hotelId: number) {
  return prisma.room.create({
    data: {
      name: faker.company.companyName(),
      capacity: faker.datatype.number(10),
      hotelId,
      createdAt: faker.date.past(),
      updatedAt: faker.date.recent(),
    },
  });
}
