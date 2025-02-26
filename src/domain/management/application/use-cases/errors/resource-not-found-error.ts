import { UseCaseError } from '@/core/error/use-case-error';

export class ResourceNotFoundError extends Error implements UseCaseError {
  constructor(entity: string, identifier: string) {
    super(`${entity} ${identifier} not found, try again later.`);
  }
}
