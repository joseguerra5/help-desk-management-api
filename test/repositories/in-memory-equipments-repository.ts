import { EquipmentRepository } from '@/domain/management/application/repositories/equipment-repository';
import { Equipment } from '@/domain/management/enterprise/entities/equipment';

export class InMemoryEquipmentRepository implements EquipmentRepository {
  public items: Equipment[] = [];

  async findBySerialNumber(id: string): Promise<Equipment | null> {
    const manager = this.items.find(
      (item) => item.serialNumber.toString() === id,
    );

    if (!manager) {
      return null;
    }

    return manager;
  }

  async findManyByCooperatorId(cooperatorId: string): Promise<Equipment[]> {
    const equipments = this.items.filter(
      (item) => item.cooperatorId.toString() === cooperatorId,
    );

    return equipments;
  }

  async save(equipment: Equipment): Promise<void> {
    const itemIndex = this.items.findIndex((item) =>
      item.id.equals(equipment.id),
    );

    this.items[itemIndex] = equipment;
  }

  async findById(id: string): Promise<Equipment | null> {
    const equipment = this.items.find((item) => item.id.toString() === id);

    if (!equipment) {
      return null;
    }

    return equipment;
  }

  async create(equipment: Equipment): Promise<void> {
    this.items.push(equipment);
  }
}
