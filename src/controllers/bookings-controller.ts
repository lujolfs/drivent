import { NextFunction, Response } from 'express';
import httpStatus from 'http-status';
import { AuthenticatedRequest } from '@/middlewares';
import bookingsService from '@/services/bookings-service';

export async function getBooking(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const { userId } = req;
  try {
    const booking = await bookingsService.getBooking(userId);
    return res.status(httpStatus.OK).send(booking);
  } catch (error) {
    next(error);
  }
}

/* export async function createBooking(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    const { userId } = req;
    try {
        const bookingCreation = await bookingsService.createBooking(userId);
        return res.status(httpStatus.OK).send(bookingCreation.bookingId);
    } catch (error) {
        next(error);
    }
}

export async function updateBooking(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    const { userId } = req;
    const { bookingId } = req.params;
    try {
        const bookingEdit = await bookingsService.updateBooking(userId, bookingId);
        return res.status(httpStatus.OK).send(bookingEdit.bookingId);
    } catch (error) {
        next(error);
    }
} */
