import { Either, right } from '@/core/either';
import { Injectable } from '@nestjs/common';
import { RecordType } from '../../enterprise/entities/loan-record';
import { FindManyLoanRecords, LoanRecordRepository } from '../repositories/loan-record-repository';

interface FetchLoanRecordUseCaseRequest {
  page: number;
  status?: RecordType;
  search?: string;
}

type FetchLoanRecordUseCaseReponse = Either<
  null,
  FindManyLoanRecords
>;

@Injectable()
export class FetchLoanRecordUseCase {
  constructor(private loanRecordRepository: LoanRecordRepository) { }
  async execute({
    page,
    status,
    search
  }: FetchLoanRecordUseCaseRequest): Promise<FetchLoanRecordUseCaseReponse> {
    const loanRecords = await this.loanRecordRepository.findMany(
      { page, status, search }
    );

    return right({
      data: loanRecords.data,
      meta: {
        pageIndex: loanRecords.meta.pageIndex,
        perPage: loanRecords.meta.perPage,
        totalCount: loanRecords.meta.totalCount
      }
    });
  }
}
