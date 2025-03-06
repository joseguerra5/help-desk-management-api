import { Either, left, right } from '@/core/either';
import { Injectable } from '@nestjs/common';
import { CooperatorRepository } from '../repositories/cooperator-repository';
import { ResourceNotFoundError } from './errors/resource-not-found-error';
import { CooperatorDetails } from '../../enterprise/entities/value-objects/cooperator-with-details';

interface GetCooperatorByIdUseCaseRequest {
  cooperatorId: string;
}

type GetCooperatorByIdUseCaseReponse = Either<
  ResourceNotFoundError,
  {
    cooperator: CooperatorDetails;
  }
>;

@Injectable()
export class GetCooperatorByIdUseCase {
  constructor(private cooperatorRepository: CooperatorRepository) { }
  async execute({
    cooperatorId,
  }: GetCooperatorByIdUseCaseRequest): Promise<GetCooperatorByIdUseCaseReponse> {
    const cooperator = await this.cooperatorRepository.findByIdWithDetails(cooperatorId);

    if (!cooperator) {
      throw left(new ResourceNotFoundError('Cooperator', cooperatorId));
    }

    return right({
      cooperator,
    });
  }
}
