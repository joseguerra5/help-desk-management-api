import { ManagerRepository } from '@/domain/management/application/repositories/manager-repository';
import { Manager } from '@/domain/management/enterprise/entities/manager';

export class InMemoryManagerRepository implements ManagerRepository {
  public items: Manager[] = [];
  async findMany(): Promise<Manager[]> {
    const manager = this.items

    return manager;
  }

  async save(manager: Manager): Promise<void> {
    const itemIndex = this.items.findIndex((item) =>
      item.id.equals(manager.id),
    );

    this.items[itemIndex] = manager;
  }

  async findById(id: string): Promise<Manager | null> {
    const manager = this.items.find((item) => item.id.toString() === id);

    if (!manager) {
      return null;
    }

    return manager;
  }

  async create(manager: Manager): Promise<void> {
    this.items.push(manager);
  }
  async findByEmail(email: string): Promise<Manager | null> {
    const manager = this.items.find((item) => item.email === email);

    if (!manager) {
      return null;
    }

    return manager;
  }
  async findByEmployeeId(id: string): Promise<Manager | null> {
    const manager = this.items.find(
      (item) => item.employeeId.toString() === id,
    );

    if (!manager) {
      return null;
    }

    return manager;
  }
}
