import { UseCaseError } from '@/core/error/use-case-error';

export class TwoFactorAuthInvalidError extends Error implements UseCaseError {
  constructor() {
    super(`Two-factor code authentication is invalid.`);
  }
}
