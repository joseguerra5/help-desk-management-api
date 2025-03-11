import { Either, right } from '@/core/either';
import { Injectable } from '@nestjs/common';
import { LoanRecord, RecordType } from '../../enterprise/entities/loan-record';
import { LoanRecordRepository } from '../repositories/loan-record-repository';

interface FetchLoanRecordByCooperatorIdUseCaseRequest {
  cooperatorId: string;
  page: number;
  status?: RecordType;
}

type FetchLoanRecordByCooperatorIdUseCaseReponse = Either<
  null,
  {
    loanRecords: LoanRecord[];
  }
>;

@Injectable()
export class FetchLoanRecordByCooperatorIdUseCase {
  constructor(private loanRecordRepository: LoanRecordRepository) { }
  async execute({
    page,
    cooperatorId,
    status,
  }: FetchLoanRecordByCooperatorIdUseCaseRequest): Promise<FetchLoanRecordByCooperatorIdUseCaseReponse> {
    const loanRecords = await this.loanRecordRepository.findManyByCooperatorId(
      cooperatorId,
      { page, status },
    );

    return right({
      loanRecords,
    });
  }
}
