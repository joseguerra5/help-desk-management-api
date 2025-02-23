import { PaginationParams } from "@/core/repositories/pagination-param";
import { LoanRecord } from "../../enterprise/entities/loan-record";

export abstract class LoanRecordRepository {
  abstract create(loanRecord: LoanRecord): Promise<void>
  abstract save(loanRecord: LoanRecord): Promise<void>
  abstract findById(id: string): Promise<LoanRecord | null>
  abstract findManyByCooperatorId(cooperatorId: string, params: PaginationParams): Promise<LoanRecord[]>
}