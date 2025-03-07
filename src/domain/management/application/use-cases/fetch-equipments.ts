import { Either, right } from '@/core/either';
import { Injectable } from '@nestjs/common';
import { EquipmentType } from '../../enterprise/entities/equipment';
import { EquipmentRepository } from '../repositories/equipment-repository';
import { EquipmentDetails } from '../../enterprise/entities/value-objects/equipment-with-details';

interface FetchEquipmentsUseCaseRequest {
  page: number;
  status?: "broken" | "available" | "loaned";
  type?: EquipmentType
  search?: string
  cooperatorId?: string
}

type FetchEquipmentsUseCaseReponse = Either<
  null,
  {
    equipments: EquipmentDetails[];
  }
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
      equipments,
    });
  }
}
