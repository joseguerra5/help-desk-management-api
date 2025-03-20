import { PaginationLoanRecordParams } from '@/core/repositories/pagination-param';
import { LoanRecord, RecordType } from '../../enterprise/entities/loan-record';
import { LoanRecordDetails } from '../../enterprise/entities/value-objects/loan-record-details';

export interface Count {
  from?: Date;
  status?: RecordType;
}

export interface FindManyLoanRecords {
  data: LoanRecordDetails[],
  meta: {
    totalCount: number,
    pageIndex: number,
    perPage: number,
  }
}

export abstract class LoanRecordRepository {
  abstract create(loanRecord: LoanRecord): Promise<void>;
  abstract save(loanRecord: LoanRecord): Promise<void>;
  abstract count(params: Count): Promise<number>;
  abstract findById(id: string): Promise<LoanRecord | null>;
  abstract findByIdWithDetails(id: string): Promise<LoanRecordDetails | null>;
  abstract findMany(params: PaginationLoanRecordParams): Promise<FindManyLoanRecords>;
  abstract findManyByCooperatorId(
    cooperatorId: string,
    params: PaginationLoanRecordParams,
  ): Promise<LoanRecord[]>;
}
