import { Either, right } from '@/core/either';
import { Injectable } from '@nestjs/common';
import { LoanRecordRepository } from '../repositories/loan-record-repository';

type CountLoanCheckinUseCaseReponse = Either<
  null,
  {
    currentMonthAmount,
    previousMonthAmount,
  }
>;

@Injectable()
export class CountLoanCheckInUseCase {
  constructor(private loanRecordRepository: LoanRecordRepository) { }
  async execute(): Promise<CountLoanCheckinUseCaseReponse> {
    const toDay = new Date();

    const firstDayCurrentMonth = new Date(toDay.getFullYear(), toDay.getMonth(), 1);

    const firstDayPreviousMonth = new Date(toDay.getFullYear(), toDay.getMonth() - 1, 1);

    const lastDayPreviousMonth = new Date(toDay.getFullYear(), toDay.getMonth(), 0);


    const currentMonthAmount = await this.loanRecordRepository.count({
      from: firstDayCurrentMonth,
      status: 'CHECK_IN',
    });

    const previousMonthAmount = await this.loanRecordRepository.count({
      from: firstDayPreviousMonth,
      to: lastDayPreviousMonth,
      status: 'CHECK_IN',
    });


    return right({
      currentMonthAmount,
      previousMonthAmount,
    });
  }
}
