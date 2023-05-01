import { Response } from 'express';
import httpStatus from 'http-status';
import { AuthenticatedRequest } from '@/middlewares';
import hotelsService from '@/services/hotels-service';

export async function getHotels(req: AuthenticatedRequest, res: Response) {
  const userId = req.userId;
  try {
    const hotels = await hotelsService.getHotels(userId);
    return res.status(httpStatus.OK).send(hotels);
  } catch (error) {
    if (error.name === 'NotFoundError') {
      res.sendStatus(httpStatus.NOT_FOUND);
    } else if (error.name === 'NotPaidError') {
      res.sendStatus(httpStatus.PAYMENT_REQUIRED);
    } else {
      res.sendStatus(httpStatus.BAD_REQUEST);
    }
  }
}

export async function getHotelById(req: AuthenticatedRequest, res: Response) {
  const hotelId = Number(req.params);
  const userId = req.userId;
  try {
    const hotelInfo = await hotelsService.getHotelById(hotelId, userId);
    return res.status(httpStatus.OK).send(hotelInfo);
  } catch (error) {
    if (error.name === 'RequestError') {
      res.sendStatus(httpStatus.BAD_REQUEST);
    } else if (error.name === 'NotFoundError') {
      res.sendStatus(httpStatus.NOT_FOUND);
    } else if (error.name === 'NotPaidError') {
      res.sendStatus(httpStatus.PAYMENT_REQUIRED);
    } else if (error.name === 'UnauthorizedError') {
      res.sendStatus(httpStatus.UNAUTHORIZED);
    }
  }
}
