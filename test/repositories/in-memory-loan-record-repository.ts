import {
  PaginationLoanRecordParams
} from '@/core/repositories/pagination-param';
import {
  Count,
  FindManyLoanRecords,
  LoanRecordRepository,
} from '@/domain/management/application/repositories/loan-record-repository';
import { Equipment } from '@/domain/management/enterprise/entities/equipment';
import { LoanRecord } from '@/domain/management/enterprise/entities/loan-record';
import { Manager } from '@/domain/management/enterprise/entities/manager';
import { LoanRecordDetails } from '@/domain/management/enterprise/entities/value-objects/loan-record-details';
import { InMemoryCooperatorRepository } from './in-memory-cooperator-repository';
import { InMemoryManagerRepository } from './in-memory-manager-repository';

export class InMemoryLoanRecordRepository implements LoanRecordRepository {
  constructor(
    private inMemoryCooperatorRepository: InMemoryCooperatorRepository,
    private inMemoryManagerRepository: InMemoryManagerRepository

  ) { }
  public items: LoanRecord[] = [];

  async findByIdWithDetails(id: string): Promise<LoanRecordDetails | null> {
    const loanRecord = this.items.find((item) => item.id.toString() === id);

    if (!loanRecord) {
      return null;
    }

    const cooperator = this.inMemoryCooperatorRepository.items.find((cooperator) => {
      return cooperator.id.equals(loanRecord.cooperatorId)
    })

    if (!cooperator) {
      throw new Error('Cooperator not found')
    }

    const manager = this.inMemoryManagerRepository.items.find((manager) => {
      return manager.id.equals(loanRecord.madeBy)
    })

    if (!manager) {
      throw new Error('Manager not found')
    }

    return LoanRecordDetails.create({
      type: loanRecord.type,
      ocurredAt: loanRecord.ocurredAt,
      loanRecordId: loanRecord.id,
      madeBy: Manager.create({
        email: manager.email,
        employeeId: manager.employeeId.toString(),
        name: manager.name,
        password: manager.password,
        userName: manager.userName,
        createdAt: manager.createdAt
      }),
      cooperator: {
        id: cooperator.id,
        name: cooperator.name,
        userName: cooperator.userName,
        employeeId: cooperator.employeeId,
        departureDate: cooperator.departureDate,
      },
      equipments: loanRecord.equipments.map(Equipment.create),
      attachment: loanRecord.attachment
        ? {
          url: loanRecord.attachment.attachmentId,
          title: loanRecord.attachment.attachmentId,
        }
        : null,
    });
  }

  async findMany({ page, status }: PaginationLoanRecordParams): Promise<FindManyLoanRecords> {
    let filteredItems = this.items;

    if (status) {
      filteredItems = filteredItems.filter((item) => item.type === status);
    }

    filteredItems = filteredItems.sort(
      (a, b) => b.ocurredAt.getTime() - a.ocurredAt.getTime(),
    );

    const startIndex = (page - 1) * 20;
    const endIndex = page * 20;
    filteredItems.slice(startIndex, endIndex);



    return {
      data: filteredItems.map((loanRecord) => {
        const cooperator = this.inMemoryCooperatorRepository.items.find((cooperator) =>
          cooperator.id.equals(loanRecord.cooperatorId)
        );

        if (!cooperator) {
          throw new Error('Cooperator not found');
        }

        const manager = this.inMemoryManagerRepository.items.find((manager) =>
          manager.id.equals(loanRecord.madeBy)
        );

        if (!manager) {
          throw new Error('Manager not found');
        }

        return LoanRecordDetails.create({
          type: loanRecord.type,
          ocurredAt: loanRecord.ocurredAt,
          loanRecordId: loanRecord.id,
          madeBy: Manager.create({
            email: manager.email,
            employeeId: manager.employeeId.toString(),
            name: manager.name,
            password: manager.password,
            userName: manager.userName,
            createdAt: manager.createdAt
          }),
          cooperator: {
            id: cooperator.id,
            name: cooperator.name,
            userName: cooperator.userName,
            employeeId: cooperator.employeeId,
            departureDate: cooperator.departureDate,
          },
          equipments: loanRecord.equipments.map(Equipment.create),
          attachment: {
            url: loanRecord.attachment.attachmentId,
            title: loanRecord.attachment.attachmentId,
          }
        });
      }),
      meta: {
        pageIndex: page,
        perPage: 20,
        totalCount: this.items.length
      }
    };
  }
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
