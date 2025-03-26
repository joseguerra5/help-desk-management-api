import { Either, right } from '@/core/either';
import { Injectable } from '@nestjs/common';
import { EquipmentRepository } from '../repositories/equipment-repository';
import { CooperatorEquipmentRepository } from '../repositories/cooperator-equipment-repository';

type CountEquipmentsAvailableAndLoanedUseCaseReponse = Either<
  null,
  {
    currentLoanedAmount: number,
    totalAmount: number,
  }
>;

@Injectable()
export class CountEquipmentsAvailableAndLoanedUseCase {
  constructor(
    private equipmentRepository: EquipmentRepository,
    private cooperatorEquipmentRepository: CooperatorEquipmentRepository,
  ) { }
  async execute(): Promise<CountEquipmentsAvailableAndLoanedUseCaseReponse> {
    const currentLoanedAmount = await this.cooperatorEquipmentRepository.count({
      status: "loaned"
    });

    const totalAmount = await this.equipmentRepository.count({
      status: "available"
    });


    return right({
      currentLoanedAmount,
      totalAmount,
    });
  }
}
