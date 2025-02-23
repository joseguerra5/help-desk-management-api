import { PaginationParams } from "@/core/repositories/pagination-param"
import { LoanRecordRepository } from "@/domain/management/application/repositories/loan-record-repository"
import { LoanRecord } from "@/domain/management/enterprise/entities/loan-record"

export class InMemoryLoanRecordRepository implements LoanRecordRepository {
  public items: LoanRecord[] = []

  async findManyByCooperatorId(cooperatorId: string, { page }: PaginationParams): Promise<LoanRecord[]> {
    const loanrecords = this.items.filter(
      (item) => item.cooperatorId.toString() === cooperatorId
    ).slice((page - 1) * 20, page * 20)

    return loanrecords
  }


  async save(loanrecord: LoanRecord): Promise<void> {
    const itemIndex = this.items.findIndex((item) => item.id.equals(loanrecord.id))

    this.items[itemIndex] = loanrecord
  }

  async findById(id: string): Promise<LoanRecord | null> {
    const loanrecord = this.items.find((item) => item.id.toString() === id)

    if (!loanrecord) {
      return null
    }

    return loanrecord
  }

  async create(loanrecord: LoanRecord): Promise<void> {
    this.items.push(loanrecord)
  }

}