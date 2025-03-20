import { Either, left, right } from '@/core/either';
import { Injectable } from '@nestjs/common';
import { ResourceNotFoundError } from './errors/resource-not-found-error';
import { LoanRecordRepository } from '../repositories/loan-record-repository';
import { LoanRecordDetails } from '../../enterprise/entities/value-objects/loan-record-details';

interface GetLoanRecordByIdUseCaseRequest {
  loanRecordId: string;
}

type GetloanRecordByIdUseCaseReponse = Either<
  ResourceNotFoundError,
  {
    loanRecord: LoanRecordDetails;
  }
>;

@Injectable()
export class GetLoanRecordByIdUseCase {
  constructor(private loanRecordRepository: LoanRecordRepository) { }
  async execute({
    loanRecordId,
  }: GetLoanRecordByIdUseCaseRequest): Promise<GetloanRecordByIdUseCaseReponse> {
    const loanRecord = await this.loanRecordRepository.findByIdWithDetails(loanRecordId);

    if (!loanRecord) {
      throw left(new ResourceNotFoundError('Loan Record', loanRecordId));
    }

    return right({
      loanRecord,
    });
  }
}
