import { ApplicationError } from '@/protocols';

export function notPaidError(): ApplicationError {
  return {
    name: 'NotPaidError',
    message: 'Payment is required.',
  };
}
