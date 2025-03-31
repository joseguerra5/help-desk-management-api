import { Either, left, right } from '@/core/either';
import { Injectable } from '@nestjs/common';
import { ManagerRepository } from '../repositories/manager-repository';
import { ResourceNotFoundError } from './errors/resource-not-found-error';
import { TwoFactorAuthenticationSecret } from '../auth/two-factor-secret-generator';

interface GenerateSecretToTwoFactorAuthUseCaseRequest {
  managerId: string;
}

type GenerateSecretToTwoFactorAuthUseCaseReponse = Either<
  ResourceNotFoundError,
  {
    otpAuthUrl: string;
  }
>;

@Injectable()
export class GenerateSecretToTwoFactorAuthUseCase {
  constructor(
    private managerRepository: ManagerRepository,
    private twoFactorGenerator: TwoFactorAuthenticationSecret,
  ) { }
  async execute({
    managerId
  }: GenerateSecretToTwoFactorAuthUseCaseRequest): Promise<GenerateSecretToTwoFactorAuthUseCaseReponse> {
    const manager = await this.managerRepository.findById(managerId)

    if (!manager) {
      return left(new ResourceNotFoundError('Manager', managerId));
    }

    const { otpAuthUrl, secret } = await this.twoFactorGenerator.generateTwoFactorAuthenticationSecret(manager)

    manager.twoFactorAuthenticationSecret = secret;

    await this.managerRepository.save(manager);

    //front end pega o otpAuth e transforma em QR code para registrar no app
    return right({ otpAuthUrl })
  }
}
