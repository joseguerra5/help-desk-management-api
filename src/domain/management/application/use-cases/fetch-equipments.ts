import { Either, right } from '@/core/either';
import { Injectable } from '@nestjs/common';
import { Equipment, EquipmentType } from '../../enterprise/entities/equipment';
import { EquipmentRepository } from '../repositories/equipment-repository';

interface FetchEquipmentsUseCaseRequest {
  page: number;
  status?: "broken" | "available" | "loaned";
  type?: EquipmentType
  search?: string
}

type FetchEquipmentsUseCaseReponse = Either<
  null,
  {
    equipments: Equipment[];
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
  }: FetchEquipmentsUseCaseRequest): Promise<FetchEquipmentsUseCaseReponse> {
    const equipments = await this.equipmentRepository.findManyBySearchParms(
      { page, status, type, search },
    );

    return right({
      equipments,
    });
  }
}
