import { PaginationLoanRecordParams, PaginationParams } from "@/core/repositories/pagination-param";
import { LoanRecord, RecordType } from "../../enterprise/entities/loan-record";

export interface Count {
  from?: Date
  status?: RecordType
}

export abstract class LoanRecordRepository {
  abstract create(loanRecord: LoanRecord): Promise<void>
  abstract save(loanRecord: LoanRecord): Promise<void>
  abstract count(params: Count): Promise<number>
  abstract findById(id: string): Promise<LoanRecord | null>
  abstract findManyByCooperatorId(cooperatorId: string, params: PaginationLoanRecordParams): Promise<LoanRecord[]>
}