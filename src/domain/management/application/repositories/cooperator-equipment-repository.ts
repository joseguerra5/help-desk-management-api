import { CooperatorEquipment } from '../../enterprise/entities/cooperator-equipment';

export abstract class CooperatorEquipmentRepository {
  abstract findManyByCooperatorId(
    cooperatorId: string,
  ): Promise<CooperatorEquipment[]>;
  abstract deleteManyByCooperatorId(cooperatorId: string): Promise<void>;
  abstract createMany(equipments: CooperatorEquipment[]): Promise<void>;
  abstract deleteMany(equipments: CooperatorEquipment[]): Promise<void>;
}
