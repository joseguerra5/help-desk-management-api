import { Either, right } from '@/core/either';
import { Injectable } from '@nestjs/common';
import { EquipmentType } from '../../enterprise/entities/equipment';
import { EquipmentRepository, FindManyEquipments } from '../repositories/equipment-repository';

interface FetchEquipmentsUseCaseRequest {
  page: number;
  status?: "broken" | "available" | "loaned";
  type?: EquipmentType
  search?: string
  cooperatorId?: string
}

type FetchEquipmentsUseCaseReponse = Either<
  null,
  FindManyEquipments
>;

@Injectable()
export class FetchEquipmentsUseCase {
  constructor(private equipmentRepository: EquipmentRepository) { }
  async execute({
    page,
    type,
    search,
    status,
    cooperatorId
  }: FetchEquipmentsUseCaseRequest): Promise<FetchEquipmentsUseCaseReponse> {
    const equipments = await this.equipmentRepository.findManyBySearchParms(
      { page, status, type, search, cooperatorId },
    );

    return right({
      data: equipments.data,
      meta: {
        pageIndex: equipments.meta.pageIndex,
        perPage: equipments.meta.perPage,
        totalCount: equipments.meta.totalCount
      }
    });
  }
}
