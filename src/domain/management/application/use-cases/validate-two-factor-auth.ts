import { Either, left, right } from '@/core/either';
import { Injectable } from '@nestjs/common';
import { CredentialDoNotMatchError } from './errors/credentials-not-match';
import { Encrypter } from '../cryptography/encrypter';
import { ManagerRepository } from '../repositories/manager-repository';
import { TwoFactorAuthenticationCodeValidation } from '../auth/two-factor-auth-code-valid';
import { TwoFactorAuthInvalidError } from './errors/two-factor-invalid-error';

interface ValidateTwoFactorAuthUseCaseRequest {
  id: string;
  code: string;
}

type ValidateTwoFactorAuthUseCaseReponse = Either<
  TwoFactorAuthInvalidError,
  {
    accessToken: string;
  }
>;

@Injectable()
export class ValidateTwoFactorAuthUseCase {
  constructor(
    private managerRepository: ManagerRepository,
    private twoFactorAuthService: TwoFactorAuthenticationCodeValidation,
    private encrypter: Encrypter,
  ) { }
  async execute({
    code,
    id,
  }: ValidateTwoFactorAuthUseCaseRequest): Promise<ValidateTwoFactorAuthUseCaseReponse> {
    const manager = await this.managerRepository.findById(id);

    if (!manager) {
      return left(new CredentialDoNotMatchError());
    }

    const isValidCode = await this.twoFactorAuthService.isTwoFactorAuthenticationCodeValid(
      manager,
      code,
    );

    if (!isValidCode) {
      return left(new TwoFactorAuthInvalidError());
    }

    const accessToken = await this.encrypter.encrypt({
      sub: manager.id.toString(),
      isTwoFactorAuthenticated: true,
    });

    return right({
      accessToken,
    });
  }
}
