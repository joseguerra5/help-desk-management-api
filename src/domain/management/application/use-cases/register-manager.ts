import { Either, left, right } from '@/core/either';
import { Manager } from '../../enterprise/entities/manager';
import { AlreadyExistsError } from './errors/already-exist-error';
import { Injectable } from '@nestjs/common';
import { HashGenerator } from '../cryptography/hash-generator';
import { ManagerRepository } from '../repositories/manager-repository';
import { CredentialDoNotMatchError } from './errors/credentials-not-match';

interface RegisterManagerUseCaseRequest {
  name: string;
  userName: string;
  employeeId: string;
  email: string;
  password: string;
  passwordConfirmation: string;
}

type RegisterManagerUseCaseReponse = Either<
  AlreadyExistsError | CredentialDoNotMatchError,
  {
    manager: Manager;
  }
>;

@Injectable()
export class RegisterManagerUseCase {
  constructor(
    private managerRepository: ManagerRepository,
    private hashGenerator: HashGenerator,
  ) { }
  async execute({
    name,
    userName,
    employeeId,
    email,
    password,
    passwordConfirmation,
  }: RegisterManagerUseCaseRequest): Promise<RegisterManagerUseCaseReponse> {
    const managerWithSameEmail =
      await this.managerRepository.findByEmail(email);

    if (managerWithSameEmail) {
      return left(new AlreadyExistsError('Manager', email));
    }

    const managerWithSameEmployeeId =
      await this.managerRepository.findByEmployeeId(employeeId);

    if (managerWithSameEmployeeId) {
      return left(new AlreadyExistsError('Manager', employeeId));
    }

    if (password !== passwordConfirmation) {
      return left(new CredentialDoNotMatchError());
    }

    const passwordHash = await this.hashGenerator.hash(password);

    const manager = Manager.create({
      email,
      employeeId,
      name,
      password: passwordHash,
      userName,
    });

    await this.managerRepository.create(manager);

    return right({
      manager,
    });
  }
}
