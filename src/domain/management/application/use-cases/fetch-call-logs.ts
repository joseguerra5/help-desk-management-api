import { Either, right } from '@/core/either';
import { Injectable } from '@nestjs/common';
import { CallLog } from '../../enterprise/entities/callLog';
import { CallLogRepository } from '../repositories/call-log-repository';

interface FetchCallLogsUseCaseRequest {
  cooperatorId: string;
}

type FetchCallLogsUseCaseReponse = Either<
  null,
  {
    callLogs: CallLog[];
  }
>;

@Injectable()
export class FetchCallLogsUseCase {
  constructor(private callLogRepository: CallLogRepository) { }
  async execute({
    cooperatorId
  }: FetchCallLogsUseCaseRequest): Promise<FetchCallLogsUseCaseReponse> {

    const callLogs = await this.callLogRepository.findManyByCooperatorId(cooperatorId)

    return right({
      callLogs,
    });
  }
}
