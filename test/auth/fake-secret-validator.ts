import { TwoFactorAuthenticationCodeValidation } from '@/domain/management/application/auth/two-factor-auth-code-valid';
import { Manager } from '@/domain/management/enterprise/entities/manager';

export class FakeSecretValidator implements TwoFactorAuthenticationCodeValidation {
  async isTwoFactorAuthenticationCodeValid(manager: Manager, twoFactorAuthenticationCode: string): Promise<boolean> {
    return manager.twoFactorAuthenticationSecret === twoFactorAuthenticationCode
  }
}
