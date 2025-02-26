import { Equipment } from '../../enterprise/entities/equipment';

export abstract class EquipmentRepository {
  abstract create(equipment: Equipment): Promise<void>;
  abstract save(equipment: Equipment): Promise<void>;
  abstract findById(id: string): Promise<Equipment | null>;
  abstract findBySerialNumber(id: string): Promise<Equipment | null>;
  abstract findManyByCooperatorId(cooperatorId: string): Promise<Equipment[]>;
}
