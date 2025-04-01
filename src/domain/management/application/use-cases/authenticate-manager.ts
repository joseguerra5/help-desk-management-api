import { Either, left, right } from '@/core/either';
import { Injectable } from '@nestjs/common';
import { CredentialDoNotMatchError } from './errors/credentials-not-match';
import { HashComparer } from '../cryptography/hash-comparer';
import { ManagerRepository } from '../repositories/manager-repository';
import { TwoFactorAuthRequiredError } from './errors/two-factor-auth-required-error';
import { TwoFactorAuthMethodRequiredError } from './errors/two-factor-auth-method-error';
import { Encrypter } from '../cryptography/encrypter';

interface AuthenticateManagerUseCaseRequest {
  email: string;
  password: string;
}

type AuthenticateManagerUseCaseReponse = Either<
  CredentialDoNotMatchError | TwoFactorAuthRequiredError | TwoFactorAuthMethodRequiredError,
  { accessToken: string }
>;

@Injectable()
export class AuthenticateManagerUseCase {
  constructor(
    private managerRepository: ManagerRepository,
    private hashCompare: HashComparer,
    private encrypter: Encrypter,
  ) { }
  async execute({
    password,
    email,
  }: AuthenticateManagerUseCaseRequest): Promise<AuthenticateManagerUseCaseReponse> {
    const manager = await this.managerRepository.findByEmail(email);

    if (!manager) {
      return left(new CredentialDoNotMatchError());
    }

    const isPasswordValid = await this.hashCompare.compare(
      password,
      manager.password,
    );

    if (!isPasswordValid) {
      return left(new CredentialDoNotMatchError());
    }

    const accessToken = await this.encrypter.encrypt({
      sub: manager.id.toString(),
      isTwoFactorAuthenticated: false,
      isTwoFactorAuthenticationEnabled: manager.isTwoFactorAuthenticationEnabled
    });

    return right({
      accessToken,
    });

  }
}
