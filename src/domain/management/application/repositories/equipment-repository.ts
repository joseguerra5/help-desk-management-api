import { PaginationEquipmentsParams } from '@/core/repositories/pagination-param';
import { Equipment } from '../../enterprise/entities/equipment';
import { EquipmentDetails } from '../../enterprise/entities/value-objects/equipment-with-details';

export interface FindManyEquipments {
  data: EquipmentDetails[],
  meta: {
    totalCount: number,
    pageIndex: number,
    perPage: number,
  }
}

export interface Count {
  status: "loaned" | "available"
}

export abstract class EquipmentRepository {
  abstract create(equipment: Equipment): Promise<void>;
  abstract count(params: Count): Promise<number>;

  abstract save(equipment: Equipment): Promise<void>;
  abstract findById(id: string): Promise<Equipment | null>;
  abstract findBySerialNumber(id: string): Promise<Equipment | null>;
  abstract findManyByCooperatorId(cooperatorId: string): Promise<Equipment[]>;
  abstract findManyBySearchParms(params: PaginationEquipmentsParams): Promise<FindManyEquipments>;
}
