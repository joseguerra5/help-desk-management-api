import { CooperatorRepository } from "@/domain/management/application/repositories/cooperator-repository";
import { Cooperator } from "@/domain/management/enterprise/entities/cooperator";

export class InMemoryCooperatorRepository implements CooperatorRepository {
  public items: Cooperator[] = []

  async save(cooperator: Cooperator): Promise<void> {
    const itemIndex = this.items.findIndex((item) => item.id.equals(cooperator.id))

    this.items[itemIndex] = cooperator
  }

  async findById(id: string): Promise<Cooperator | null> {
    const cooperator = this.items.find((item) => item.id.toString() === id)

    if (!cooperator) {
      return null
    }

    return cooperator
  }

  async create(cooperator: Cooperator): Promise<void> {
    this.items.push(cooperator)
  }
  async findByEmail(email: string): Promise<Cooperator | null> {
    const cooperator = this.items.find((item) => item.email === email)

    if (!cooperator) {
      return null
    }

    return cooperator
  }
  async findByEmployeeId(id: string): Promise<Cooperator | null> {
    const cooperator = this.items.find((item) => item.employeeId.toString() === id)

    if (!cooperator) {
      return null
    }

    return cooperator
  }
}