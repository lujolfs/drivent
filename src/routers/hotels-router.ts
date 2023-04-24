import { Router } from 'express';
import { getHotels, getHotelById } from '@/controllers/hotels-controller';
import { authenticateToken } from '@/middlewares';

const hotelsRouter = Router();
hotelsRouter.all('/*', authenticateToken);
hotelsRouter.get('/', getHotels);
hotelsRouter.get('/:hotelId', getHotelById);

export { hotelsRouter };
