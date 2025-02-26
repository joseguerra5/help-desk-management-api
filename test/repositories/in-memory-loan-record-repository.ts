import {
  PaginationLoanRecordParams
} from '@/core/repositories/pagination-param';
import {
  Count,
  LoanRecordRepository,
} from '@/domain/management/application/repositories/loan-record-repository';
import { LoanRecord } from '@/domain/management/enterprise/entities/loan-record';

export class InMemoryLoanRecordRepository implements LoanRecordRepository {
  public items: LoanRecord[] = [];
  async count({ from, status }: Count): Promise<number> {
    const amount = this.items.filter((item) => {
      const matchesStatus = status ? item.type === status : true;
      const matchesDate = from
        ? new Date(item.ocurredAt) >= new Date(from)
        : true;
      return matchesDate && matchesStatus;
    }).length;

    return amount;
  }

  async findManyByCooperatorId(
    cooperatorId: string,
    { page, status }: PaginationLoanRecordParams,
  ): Promise<LoanRecord[]> {
    let filteredItems = this.items;

    if (cooperatorId) {
      filteredItems = filteredItems.filter(
        (item) => item.cooperatorId.toString() === cooperatorId,
      );
    }

    if (status) {
      filteredItems = filteredItems.filter((item) => item.type === status);
    }

    // Ordenação por data de criação antes da paginação
    filteredItems = filteredItems.sort(
      (a, b) => b.ocurredAt.getTime() - a.ocurredAt.getTime(),
    );

    // Paginação
    const startIndex = (page - 1) * 20;
    const endIndex = page * 20;
    filteredItems.slice(startIndex, endIndex);

    return filteredItems;
  }

  async save(loanrecord: LoanRecord): Promise<void> {
    const itemIndex = this.items.findIndex((item) =>
      item.id.equals(loanrecord.id),
    );

    this.items[itemIndex] = loanrecord;
  }

  async findById(id: string): Promise<LoanRecord | null> {
    const loanrecord = this.items.find((item) => item.id.toString() === id);

    if (!loanrecord) {
      return null;
    }

    return loanrecord;
  }

  async create(loanrecord: LoanRecord): Promise<void> {
    this.items.push(loanrecord);
  }
}
