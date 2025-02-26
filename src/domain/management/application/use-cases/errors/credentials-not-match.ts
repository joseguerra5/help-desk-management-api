import { UseCaseError } from '@/core/error/use-case-error';

export class CredentialDoNotMatchError extends Error implements UseCaseError {
  constructor() {
    super('Credentials do not match, please verify your credentials');
  }
}
