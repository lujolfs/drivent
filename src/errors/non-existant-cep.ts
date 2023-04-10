import { ApplicationError } from '@/protocols';

export function nonExistentCep(details: string[]): ApplicationNonExistentCep {
  return {
    name: 'NonExistentCEP',
    message: 'This CEP is valid but it does not exist. Please, try again.',
    details,
  };
}

type ApplicationNonExistentCep = ApplicationError & {
  details: string[];
};
