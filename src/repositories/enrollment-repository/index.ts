import { Enrollment } from '@prisma/client';
import { prisma } from '@/config';

async function findByUserId(userId: number) {
  return prisma.enrollment.findFirst({
    where: { userId },
  });
}

async function findWithAddressByUserId(userId: number) {
  return prisma.enrollment.findFirst({
    where: { userId },
    include: {
      Address: true,
    },
  });
}

async function findEnrollment(enrollmentId: number) {
  return prisma.enrollment.findUnique({
    where: { id: enrollmentId },
    include: {
      User: true,
    },
  });
}

async function upsert(
  userId: number,
  createdEnrollment: CreateEnrollmentParams,
  updatedEnrollment: UpdateEnrollmentParams,
) {
  return prisma.enrollment.upsert({
    where: {
      userId,
    },
    create: createdEnrollment,
    update: updatedEnrollment,
  });
}

export type CreateEnrollmentParams = Omit<Enrollment, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateEnrollmentParams = Omit<CreateEnrollmentParams, 'userId'>;

const enrollmentRepository = {
  findByUserId,
  findWithAddressByUserId,
  findEnrollment,
  upsert,
};

export default enrollmentRepository;
