import { Either, right } from '@/core/either'
import { Injectable } from '@nestjs/common'
import { LoanRecord } from '../../enterprise/entities/loan-record'
import { LoanRecordRepository } from '../repositories/loan-record-repository'

interface FetchLoanRecordUseCaseRequest {
  cooperatorId: string
  page: number
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
  ) {}
  async execute({
    page,
    cooperatorId,
  }: FetchLoanRecordUseCaseRequest): Promise<FetchLoanRecordUseCaseReponse> {
    const loanRecords =
      await this.loanRecordRepository.findManyByCooperatorId(
        cooperatorId,
        { page },
      )

    return right({
      loanRecords,
    })
  }
}
