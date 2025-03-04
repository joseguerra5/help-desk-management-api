import { PaginationEquipmentsParams } from '@/core/repositories/pagination-param';
import { EquipmentRepository } from '@/domain/management/application/repositories/equipment-repository';
import { Equipment } from '@/domain/management/enterprise/entities/equipment';

export class InMemoryEquipmentRepository implements EquipmentRepository {
  public items: Equipment[] = [];
  async findManyBySearchParms({ page, search, status, type }: PaginationEquipmentsParams): Promise<Equipment[]> {
    let filteredItems = this.items;

    if (status === "broken") {
      filteredItems = filteredItems.filter(
        (item) => item.brokenAt !== null,
      );
    } else if (status === 'available') {
      filteredItems = filteredItems.filter(
        (item) => item.cooperatorId === null && item.brokenAt === null,
      );
    } else if (status === 'loaned') {
      filteredItems = filteredItems.filter(
        (item) => item.cooperatorId !== null && item.brokenAt === null,
      );
    }


    if (search) {
      filteredItems = filteredItems.filter(
        (item) =>
          item.serialNumber.toLowerCase().includes(search.toLowerCase()) ||
          item.name.toLowerCase().includes(search.toLowerCase()),
      );
    }

    if (type) {
      filteredItems = filteredItems.filter(
        (item) => item.type === type,
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
