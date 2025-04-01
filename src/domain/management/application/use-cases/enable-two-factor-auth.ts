import { Either, left, right } from '@/core/either';
import { Injectable } from '@nestjs/common';
import { ManagerRepository } from '../repositories/manager-repository';
import { ResourceNotFoundError } from './errors/resource-not-found-error';
import { TwoFactorAuthenticationCodeValidation } from '../auth/two-factor-auth-code-valid';
import { TwoFactorAuthInvalidError } from './errors/two-factor-invalid-error';
import { Encrypter } from '../cryptography/encrypter';

interface EnableTwoFactorAuthUseCaseRequest {
  managerId: string;
  code: string
}

type EnableTwoFactorAuthUseCaseReponse = Either<
  TwoFactorAuthInvalidError,
  { accessToken: string }
>;

@Injectable()
export class EnableTwoFactorAuthUseCase {
  constructor(
    private managerRepository: ManagerRepository,
    private twoFactorVerifier: TwoFactorAuthenticationCodeValidation,
    private encrypter: Encrypter,

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


    const accessToken = await this.encrypter.encrypt({
      sub: manager.id.toString(),
      isTwoFactorAuthenticated: true,
    });

    return right({ accessToken, })
  }
}
