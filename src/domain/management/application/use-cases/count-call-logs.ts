import { Either, right } from '@/core/either';
import { Injectable } from '@nestjs/common';
import { CallLogRepository } from '../repositories/call-log-repository';

type CountCallLogsUseCaseReponse = Either<
  null,
  {
    currentMonthAmount: number,
    previousMonthAmount: number,
  }
>;

@Injectable()
export class CountCallLogsUseCase {
  constructor(private callLogRepository: CallLogRepository) { }
  async execute(): Promise<CountCallLogsUseCaseReponse> {
    const toDay = new Date();

    const firstDayCurrentMonth = new Date(toDay.getFullYear(), toDay.getMonth(), 1);

    const firstDayPreviousMonth = new Date(toDay.getFullYear(), toDay.getMonth() - 1, 1);

    const lastDayPreviousMonth = new Date(toDay.getFullYear(), toDay.getMonth(), 0);


    const currentMonthAmount = await this.callLogRepository.count({
      from: firstDayCurrentMonth,
    });


    const previousMonthAmount = await this.callLogRepository.count({
      from: firstDayPreviousMonth,
      to: lastDayPreviousMonth,
    });


    return right({
      currentMonthAmount,
      previousMonthAmount,
    });
  }
}
