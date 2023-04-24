import httpStatus from 'http-status';
import { notFoundError, requestError } from '@/errors';
import hotelRepository from '@/repositories/hotel-repository';

async function getHotels() {
  const hotels = await hotelRepository.findHotels();
  if (!hotels) throw notFoundError();
  return hotels;
}

async function getHotelById(hotelId: number) {
  if (!hotelId) throw requestError(httpStatus.BAD_REQUEST, httpStatus['400_MESSAGE']);
  const hotelCheck = await hotelRepository.findHotelById(hotelId);
  if (!hotelCheck) throw notFoundError();
  return hotelCheck;
}

const hotelsService = {
  getHotels,
  getHotelById,
};

export default hotelsService;
