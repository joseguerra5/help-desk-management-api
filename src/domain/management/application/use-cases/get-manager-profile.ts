import { Either, left, right } from '@/core/either';
import { Injectable } from '@nestjs/common';
import { ResourceNotFoundError } from './errors/resource-not-found-error';
import { Manager } from '../../enterprise/entities/manager';
import { ManagerRepository } from '../repositories/manager-repository';

interface GetManagerProfileUseCaseRequest {
  managerId: string;
}

type GetManagerProfileUseCaseReponse = Either<
  ResourceNotFoundError,
  {
    manager: Manager;
  }
>;

@Injectable()
export class GetManagerProfileUseCase {
  constructor(private managerRepository: ManagerRepository) { }
  async execute({
    managerId,
  }: GetManagerProfileUseCaseRequest): Promise<GetManagerProfileUseCaseReponse> {
    const manager = await this.managerRepository.findById(managerId);

    if (!manager) {
      throw left(new ResourceNotFoundError('User', managerId));
    }

    return right({
      manager,
    });
  }
}
