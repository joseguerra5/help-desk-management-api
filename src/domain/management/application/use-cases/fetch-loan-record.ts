import { Either, right } from '@/core/either'
import { Injectable } from '@nestjs/common'
import { LoanRecord, RecordType } from '../../enterprise/entities/loan-record'
import { LoanRecordRepository } from '../repositories/loan-record-repository'

interface FetchLoanRecordUseCaseRequest {
  cooperatorId: string
  page: number
  status?: RecordType
}

type FetchLoanRecordUseCaseReponse = Either<
  null,
  {
    loanRecords: LoanRecord[]
  }
>

@Injectable()
export class FetchLoanRecordUseCase {
  constructor(
    private loanRecordRepository: LoanRecordRepository,
  ) { }
  async execute({
    page,
    cooperatorId,
    status
  }: FetchLoanRecordUseCaseRequest): Promise<FetchLoanRecordUseCaseReponse> {
    const loanRecords =
      await this.loanRecordRepository.findManyByCooperatorId(
        cooperatorId,
        { page, status },
      )

    return right({
      loanRecords,
    })
  }
}
