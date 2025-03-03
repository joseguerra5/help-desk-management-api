import { DomainEvents } from '@/core/events/domain-events';
import { PaginationCooperatorParams } from '@/core/repositories/pagination-param';
import { CooperatorRepository } from '@/domain/management/application/repositories/cooperator-repository';
import { Cooperator } from '@/domain/management/enterprise/entities/cooperator';

export class InMemoryCooperatorRepository implements CooperatorRepository {
  public items: Cooperator[] = [];

  async findMany({
    page,
    search,
    status,
  }: PaginationCooperatorParams): Promise<Cooperator[]> {
    let filteredItems = this.items;

    if (search) {
      filteredItems = filteredItems.filter(
        (item) =>
          item.employeeId.toLowerCase().includes(search.toLowerCase()) ||
          item.userName.toLowerCase().includes(search.toLowerCase()),
      );
    }

    if (status === 'inactive') {
      filteredItems = filteredItems.filter(
        (item) => item.departureDate !== null,
      );
    } else if (status === 'active') {
      filteredItems = filteredItems.filter(
        (item) => item.departureDate === null,
      );
    }

    // Ordenação por data de criação antes da paginação
    filteredItems = filteredItems.sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime(),
    );

    // Paginação
    const startIndex = (page - 1) * 20;
    const endIndex = page * 20;
    return filteredItems.slice(startIndex, endIndex);
  }

  async save(cooperator: Cooperator): Promise<void> {
    const itemIndex = this.items.findIndex((item) =>
      item.id.equals(cooperator.id),
    );

    this.items[itemIndex] = cooperator;


    DomainEvents.dispatchEventsForAggregate(cooperator.id)
  }

  async findById(id: string): Promise<Cooperator | null> {
    const cooperator = this.items.find((item) => item.id.toString() === id);

    if (!cooperator) {
      return null;
    }

    return cooperator;
  }

  async create(cooperator: Cooperator): Promise<void> {
    this.items.push(cooperator);
  }
  async findByEmail(email: string): Promise<Cooperator | null> {
    const cooperator = this.items.find((item) => item.email === email);

    if (!cooperator) {
      return null;
    }

    return cooperator;
  }
  async findByEmployeeId(id: string): Promise<Cooperator | null> {
    const cooperator = this.items.find(
      (item) => item.employeeId.toString() === id,
    );

    if (!cooperator) {
      return null;
    }

    return cooperator;
  }
}
