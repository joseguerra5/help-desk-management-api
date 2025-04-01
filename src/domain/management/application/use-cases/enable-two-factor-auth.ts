import { Either, left, right } from '@/core/either';
import { Injectable } from '@nestjs/common';
import { ManagerRepository } from '../repositories/manager-repository';
import { ResourceNotFoundError } from './errors/resource-not-found-error';
import { TwoFactorAuthenticationCodeValidation } from '../auth/two-factor-auth-code-valid';
import { TwoFactorAuthInvalidError } from './errors/two-factor-invalid-error';

interface EnableTwoFactorAuthUseCaseRequest {
  managerId: string;
  code: string
}

type EnableTwoFactorAuthUseCaseReponse = Either<
  TwoFactorAuthInvalidError,
  { success: true }
>;

@Injectable()
export class EnableTwoFactorAuthUseCase {
  constructor(
    private managerRepository: ManagerRepository,
    private twoFactorVerifier: TwoFactorAuthenticationCodeValidation,
  ) { }
  async execute({
    managerId,
    code
  }: EnableTwoFactorAuthUseCaseRequest): Promise<EnableTwoFactorAuthUseCaseReponse> {
    const manager = await this.managerRepository.findById(managerId)

    if (!manager) {
      return left(new ResourceNotFoundError('Manager', managerId));
    }

    const isValid = await this.twoFactorVerifier.isTwoFactorAuthenticationCodeValid(manager, code);

    if (!isValid) {
      return left(new TwoFactorAuthInvalidError())
    }
    manager.isTwoFactorAuthenticationEnabled = true;
    await this.managerRepository.save(manager);

    return right({ success: true })
  }
}
