import { prisma } from '@/config';

async function findHotelById(hotelId: number) {
  return prisma.hotel.findUnique({
    where: { id: hotelId },
  });
}

async function findHotels() {
  return prisma.hotel.findMany();
}

const hotelRepository = {
  findHotelById,
  findHotels,
};

export default hotelRepository;
