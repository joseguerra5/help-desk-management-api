import { TwoFactorAuthenticationSecret } from '@/domain/management/application/auth/two-factor-secret-generator';
import { Manager } from '@/domain/management/enterprise/entities/manager';
import { InMemoryManagerRepository } from 'test/repositories/in-memory-manager-repository';

export class FakeSecretGenerator implements TwoFactorAuthenticationSecret {
  constructor(private managerRepository: InMemoryManagerRepository) { }
  async generateTwoFactorAuthenticationSecret(manager: Manager): Promise<{ secret: string; otpAuthUrl: string; }> {
    manager.twoFactorAuthenticationSecret = "test"
    manager.isTwoFactorAuthenticationEnabled = true

    await this.managerRepository.save(manager)

    return {
      otpAuthUrl: "test-url",
      secret: manager.twoFactorAuthenticationSecret
    }
  }
}
