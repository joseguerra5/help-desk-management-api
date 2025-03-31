import { UseCaseError } from '@/core/error/use-case-error';

export class TwoFactorAuthRequiredError extends Error implements UseCaseError {
  constructor() {
    super(`Two-factor authentication is required.`);
  }
}
