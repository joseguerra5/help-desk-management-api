import { CooperatorEquipment } from '../../enterprise/entities/cooperator-equipment';

export interface Count {
  status: "available" | "loaned"
}
export abstract class CooperatorEquipmentRepository {
  abstract findManyByCooperatorId(
    cooperatorId: string,
  ): Promise<CooperatorEquipment[]>;
  abstract deleteManyByCooperatorId(cooperatorId: string): Promise<void>;
  abstract createMany(equipments: CooperatorEquipment[]): Promise<void>;
  abstract deleteMany(equipments: CooperatorEquipment[]): Promise<void>;
  abstract count(params: Count): Promise<number>;

}
