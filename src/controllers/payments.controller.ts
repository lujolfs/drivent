import { NextFunction, Response } from 'express';
import httpStatus from 'http-status';
import { AuthenticatedRequest } from '@/middlewares';
import paymentsService from '@/services/payments-service';
import ticketsService from '@/services/tickets-service';

export async function getPaymentByTicketId(req: AuthenticatedRequest, res: Response) {
  const ticketId = +req.query.ticketId;
  const userId = req.userId;
  try {
    const paymentInfo = await paymentsService.getPaymentByTicketId(ticketId, userId);
    return res.status(httpStatus.OK).send(paymentInfo);
  } catch (error) {
    if (error.name === 'RequestError') {
      res.sendStatus(httpStatus.BAD_REQUEST);
    } else if (error.name === 'NotFoundError') {
      res.sendStatus(httpStatus.NOT_FOUND);
    } else if (error.name === 'UnauthorizedError') {
      res.sendStatus(httpStatus.UNAUTHORIZED);
    }
  }
}

export async function payTicket(req: AuthenticatedRequest, res: Response) {
  const payInfo = req.body;
  const userId = req.userId;
  try {
    const createPayment = await paymentsService.createPayment(payInfo, userId);
    await ticketsService.updateTicketStatus(req.body.ticketId);
    res.status(httpStatus.OK).send(createPayment);
  } catch (error) {
    if (error.name === 'RequestError') {
      res.sendStatus(httpStatus.BAD_REQUEST);
    } else if (error.name === 'NotFoundError') {
      res.sendStatus(httpStatus.NOT_FOUND);
    } else if (error.name === 'UnauthorizedError') {
      res.sendStatus(httpStatus.UNAUTHORIZED);
    }
  }
}
