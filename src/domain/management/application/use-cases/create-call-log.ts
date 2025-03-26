import { Either, left, right } from '@/core/either';
import { Injectable } from '@nestjs/common';
import { CooperatorRepository } from '../repositories/cooperator-repository';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { CallLog, CallType } from '../../enterprise/entities/callLog';
import { ResourceNotFoundError } from './errors/resource-not-found-error';
import { CallLogRepository } from '../repositories/call-log-repository';

interface CreateCallLogUseCaseRequest {
  cooperatorId: string;
  madeBy: string;
  type: CallType;
  description: string;
}

type CreateCallLogUseCaseReponse = Either<
  ResourceNotFoundError,
  {
    callLog: CallLog;
  }
>;

@Injectable()
export class CreateCallLogUseCase {
  constructor(
    private cooperatorRepository: CooperatorRepository,
    private CallLogRepository: CallLogRepository,
  ) { }
  async execute({
    cooperatorId,
    madeBy,
    type,
    description,
  }: CreateCallLogUseCaseRequest): Promise<CreateCallLogUseCaseReponse> {
    const cooperatorLog =
      await this.cooperatorRepository.findById(cooperatorId);

    if (!cooperatorLog) {
      return left(new ResourceNotFoundError('Cooperator', cooperatorId));
    }

    const callLog = CallLog.create({
      cooperatorId: new UniqueEntityId(cooperatorId),
      description,
      madeBy: new UniqueEntityId(madeBy),
      type,
    });

    await this.CallLogRepository.create(callLog);

    return right({
      callLog,
    });
  }
}
