import { NextFunction, Response } from 'express';
import httpStatus from 'http-status';
import { AuthenticatedRequest } from '@/middlewares';
import bookingsService from '@/services/bookings-service';

export async function getBooking(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const { userId } = req;
  try {
    const booking = await bookingsService.getBooking(userId);
    return res.send(booking);
  } catch (error) {
    next(error);
  }
}

export async function createBooking(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const { userId } = req;
  const { roomId } = req.body;
  try {
    const bookingId = await bookingsService.createBooking(userId, roomId);
    return res.status(httpStatus.OK).send({ bookingId: bookingId });
  } catch (error) {
    next(error);
  }
}

export async function updateBooking(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const { userId } = req;
  const { bookingId } = req.params;
  const { roomId } = req.body;
  try {
    const updatedBookingId = await bookingsService.updateBooking(Number(bookingId), roomId, userId);
    return res.status(httpStatus.OK).send({ bookingId: updatedBookingId });
  } catch (error) {
    next(error);
  }
}
