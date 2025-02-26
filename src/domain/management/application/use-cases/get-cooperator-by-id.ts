import { Either, left, right } from '@/core/either';
import { Injectable } from '@nestjs/common';
import { Cooperator } from '../../enterprise/entities/cooperator';
import { CooperatorRepository } from '../repositories/cooperator-repository';
import { ResourceNotFoundError } from './errors/resource-not-found-error';

interface GetCooperatorByIdUseCaseRequest {
  cooperatorId: string;
}

type GetCooperatorByIdUseCaseReponse = Either<
  ResourceNotFoundError,
  {
    cooperator: Cooperator;
  }
>;

@Injectable()
export class GetCooperatorByIdUseCase {
  constructor(private cooperatorRepository: CooperatorRepository) { }
  async execute({
    cooperatorId,
  }: GetCooperatorByIdUseCaseRequest): Promise<GetCooperatorByIdUseCaseReponse> {
    const cooperator = await this.cooperatorRepository.findById(cooperatorId);

    if (!cooperator) {
      throw left(new ResourceNotFoundError('Cooperator', cooperatorId));
    }

    return right({
      cooperator,
    });
  }
}
