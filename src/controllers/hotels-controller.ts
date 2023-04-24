import { Response } from 'express';
import httpStatus from 'http-status';
import { AuthenticatedRequest } from '@/middlewares';
import hotelsService from '@/services/hotels-service';

export async function getHotels(req: AuthenticatedRequest, res: Response) {
  try {
    const hotels = await hotelsService.getHotels();
    return res.send(hotels);
  } catch (error) {
    if (error.name === 'NotFoundError') {
      res.sendStatus(httpStatus.NOT_FOUND);
    } else {
      res.sendStatus(httpStatus.BAD_REQUEST);
    }
  }
}

export async function getHotelById(req: AuthenticatedRequest, res: Response) {
  const hotelId = Number(req.params);
  try {
    const hotelInfo = await hotelsService.getHotelById(hotelId);
    return res.status(httpStatus.OK).send(hotelInfo);
  } catch (error) {
    if (error.name === 'RequestError') {
      res.sendStatus(httpStatus.BAD_REQUEST);
    } else if (error.name === 'NotFoundError') {
      res.sendStatus(httpStatus.NOT_FOUND);
    } else {
      res.sendStatus(httpStatus.UNAUTHORIZED);
    }
  }
}
