import { Either, right } from '@/core/either';
import { Injectable } from '@nestjs/common';
import { CredentialDoNotMatchError } from './errors/credentials-not-match';
import { LoanRecordRepository } from '../repositories/loan-record-repository';

type CountLoanCheckinUseCaseReponse = Either<
  CredentialDoNotMatchError,
  {
    amount: number;
  }
>;

@Injectable()
export class CountLoanCheckInUseCase {
  constructor(private loanRecordRepository: LoanRecordRepository) {}
  async execute(): Promise<CountLoanCheckinUseCaseReponse> {
    const toDay = new Date();
    const last30Days = new Date().setDate(toDay.getDate() - 30);

    const amount = await this.loanRecordRepository.count({
      from: new Date(last30Days),
      status: 'CHECK_IN',
    });
    return right({
      amount,
    });
  }
}
