import { UseCaseError } from '@/core/error/use-case-error';

export class TwoFactorAuthMethodRequiredError extends Error implements UseCaseError {
  constructor() {
    super(`Two-factor authentication method is required, please enable.`);
  }
}
