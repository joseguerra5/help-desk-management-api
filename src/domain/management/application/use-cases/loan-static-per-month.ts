import { Either, right } from '@/core/either';
import { Injectable } from '@nestjs/common';
import { CredentialDoNotMatchError } from './errors/credentials-not-match';
import { LoanRecordRepository } from '../repositories/loan-record-repository';

type LoanStaticPerMonthUseCaseReponse = Either<
  CredentialDoNotMatchError,
  {
    month: string,
    loansMade: number,
    loansReturned: number
  }[]
>;

@Injectable()
export class LoanStaticPerMonthUseCase {
  constructor(private loanRecordRepository: LoanRecordRepository) { }
  async execute(): Promise<LoanStaticPerMonthUseCaseReponse> {
    const toDay = new Date();

    const last12Months: { month: string; start: Date; end: Date }[] = []

    for (let i = 11; i >= 0; i--) {
      const date = new Date(toDay.getFullYear(), toDay.getMonth() - i, 1)

      const start = new Date(Date.UTC(date.getFullYear(), date.getMonth(), 1, 0, 0, 0, 0));

      const end = new Date(Date.UTC(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59, 999));



      last12Months.push({
        month: `${String(date.getMonth() + 1).padStart(2, "0")}-${date.getFullYear()}`,
        start,
        end,
      })
    }

    const statistics = await Promise.all(
      last12Months.map(
        async ({ month, end, start }) => {
          const loansMade = await this.loanRecordRepository.count({ from: start, to: end, status: "CHECK_OUT" })
          const loansReturned = await this.loanRecordRepository.count({ from: start, to: end, status: "CHECK_IN" })

          return { month, loansMade, loansReturned }
        }
      )
    )


    return right(
      statistics
    );
  }
}
