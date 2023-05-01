import faker from '@faker-js/faker';
import httpStatus from 'http-status';
import * as jwt from 'jsonwebtoken';
import supertest from 'supertest';

import { TicketStatus, Room } from '@prisma/client';
import {
  createEnrollmentWithAddress,
  createTicket,
  createTicketType,
  createTicketTypeHotel,
  createUser,
  createHotel,
  createRoom,
  createTicketTypeNoHotel,
} from '../factories';
import { cleanDb, generateValidToken } from '../helpers';
import app, { init } from '@/app';

beforeAll(async () => {
  await init();
  await cleanDb();
});

const server = supertest(app);

describe('GET /hotels', () => {
  it('should respond with status 401 if no token is given', async () => {
    const response = await server.get('/hotels');

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it('should respond with status 401 if given token is not valid', async () => {
    const token = faker.lorem.word();

    const response = await server.get('/hotels').set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it('should respond with status 401 if there is no session for given token', async () => {
    const userWithoutSession = await createUser();
    const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);

    const response = await server.get('/hotels').set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  describe('when token is valid', () => {
    it('should respond with status 404 when user doesnt have an enrollment yet', async () => {
      const token = await generateValidToken();

      const response = await server.get('/hotels').set('Authorization', `Bearer ${token}`);

      expect(response.status).toEqual(httpStatus.NOT_FOUND);
    });

    it('should respond with status 404 when user doesnt have a ticket yet', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      await createEnrollmentWithAddress(user);

      const response = await server.get('/hotels').set('Authorization', `Bearer ${token}`);

      expect(response.status).toEqual(httpStatus.NOT_FOUND);
    });

    it('should respond with status 402 when user havent paid for ticket yet', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketType();
      await createTicket(enrollment.id, ticketType.id, TicketStatus.RESERVED);
      const response = await server.get('/hotels').set('Authorization', `Bearer ${token}`);

      expect(response.status).toEqual(httpStatus.PAYMENT_REQUIRED);
    });

    it('should respond with status 402 when ticket type is remote', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketType();
      await createTicket(enrollment.id, ticketType.id, TicketStatus.RESERVED);

      const response = await server.get('/hotels').set('Authorization', `Bearer ${token}`);

      expect(response.status).toEqual(httpStatus.PAYMENT_REQUIRED);
    });

    it('should respond with status 402 when ticket does not include hotel', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketType();
      await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
      const response = await server.get('/hotels').set('Authorization', `Bearer ${token}`);

      expect(response.status).toEqual(httpStatus.PAYMENT_REQUIRED);
    });

    it('should respond with status 200 and with hotels data', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketTypeHotel();
      await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
      const hotel = await createHotel();

      const response = await server.get('/hotels').set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(httpStatus.OK);
      expect(response.body).toEqual([
        {
          id: expect.any(Number),
          name: hotel.name,
          image: hotel.image,
          createdAt: hotel.createdAt.toISOString(),
          updatedAt: hotel.updatedAt.toISOString(),
        },
      ]);
    });
  });
});

describe('GET /hotels/:hotelId', () => {
  it('should respond with status 401 if no token is given', async () => {
    const response = await server.get('/hotels');

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it('should respond with status 401 if given token is not valid', async () => {
    const token = faker.lorem.word();

    const response = await server.get('/hotels/:hotelId').set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it('should respond with status 401 if there is no session for given token', async () => {
    const userWithoutSession = await createUser();
    const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);

    const response = await server.get('/hotels/:hotelId').set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  describe('when token is valid', () => {
    it('should respond with status 404 when selected hotel doesnt exist yet', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const hotelId = 100;

      const response = await server.get('/hotels/' + hotelId).set('Authorization', `Bearer ${token}`);

      expect(response.status).toEqual(httpStatus.NOT_FOUND);
    });

    it('should respond with status 404 when user doesnt have a ticket yet', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      await createEnrollmentWithAddress(user);
      const hotelId = 1;
      const response = await server.get('/hotels/' + hotelId).set('Authorization', `Bearer ${token}`);

      expect(response.status).toEqual(httpStatus.NOT_FOUND);
    });

    it('should respond with status 402 when user havent paid for ticket yet', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketType();
      await createTicket(enrollment.id, ticketType.id, TicketStatus.RESERVED);
      const hotelId = 1;
      const response = await server.get('/hotels/' + hotelId).set('Authorization', `Bearer ${token}`);

      expect(response.status).toEqual(httpStatus.PAYMENT_REQUIRED);
    });

    it('should respond with status 402 when ticket type is remote', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketType();
      await createTicket(enrollment.id, ticketType.id, TicketStatus.RESERVED);
      const hotelId = 1;

      const response = await server.get('/hotels/' + hotelId).set('Authorization', `Bearer ${token}`);

      expect(response.status).toEqual(httpStatus.PAYMENT_REQUIRED);
    });

    it('should respond with status 402 when ticket does not include hotel', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketType();
      await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
      const hotelId = 1;
      const response = await server.get('/hotels/' + hotelId).set('Authorization', `Bearer ${token}`);

      expect(response.status).toEqual(httpStatus.PAYMENT_REQUIRED);
    });

    it('should respond with status 200 and with hotels data', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketTypeHotel();
      await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
      const hotel = await createHotel();
      const hotelId = hotel.id;
      await createRoom(hotelId);

      const response = await server.get('/hotels/' + hotelId).set('Authorization', `Bearer ${token}`);

      expect(response.status).toEqual(httpStatus.OK);
    });
  });
});
