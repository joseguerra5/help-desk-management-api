import { Either, left, right } from '@/core/either';
import { Injectable } from '@nestjs/common';
import { Cooperator } from '../../enterprise/entities/cooperator';
import { ResourceNotFoundError } from './errors/resource-not-found-error';
import { CooperatorRepository } from '../repositories/cooperator-repository';

interface RegisterDepartureDateUseCaseRequest {
  departureDate: Date;
  cooperatorId: string;
}

type RegisterDepartureDateUseCaseReponse = Either<
  ResourceNotFoundError,
  {
    cooperator: Cooperator;
  }
>;

@Injectable()
export class RegisterDepartureDateUseCase {
  constructor(private cooperatorRepository: CooperatorRepository) {}
  async execute({
    cooperatorId,
    departureDate,
  }: RegisterDepartureDateUseCaseRequest): Promise<RegisterDepartureDateUseCaseReponse> {
    const cooperator = await this.cooperatorRepository.findById(cooperatorId);

    if (!cooperator) {
      return left(new ResourceNotFoundError('Cooperator', cooperatorId));
    }

    cooperator.departureDate = departureDate;
    await this.cooperatorRepository.save(cooperator);

    return right({
      cooperator,
    });
  }
}
