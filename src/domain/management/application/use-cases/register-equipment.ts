import { Either, left, right } from '@/core/either';
import { AlreadyExistsError } from './errors/already-exist-error';
import { Injectable } from '@nestjs/common';
import { Equipment } from '../../enterprise/entities/equipment';
import { ResourceNotFoundError } from './errors/resource-not-found-error';
import { EquipmentType } from '../../enterprise/entities/equipment';
import { EquipmentRepository } from '../repositories/equipment-repository';
import { ManagerRepository } from '../repositories/manager-repository';
import { NotAllowedError } from '@/core/errors/not-allowed-error';

interface RegisterEquipmentUseCaseRequest {
  type: EquipmentType;
  name: string;
  serialNumber: string;
  madeBy: string
}

type RegisterEquipmentUseCaseReponse = Either<
  AlreadyExistsError | ResourceNotFoundError | NotAllowedError,
  {
    equipment: Equipment;
  }
>;

@Injectable()
export class RegisterEquipmentUseCase {
  constructor(
    private equipmentRepository: EquipmentRepository,
    private managerRepository: ManagerRepository
  ) { }
  async execute({
    name,
    serialNumber,
    type,
    madeBy
  }: RegisterEquipmentUseCaseRequest): Promise<RegisterEquipmentUseCaseReponse> {
    const manager = await this.managerRepository.findById(madeBy)

    if (!manager) {
      return left(new NotAllowedError());

    }
    const equipmentWithSameSN =
      await this.equipmentRepository.findBySerialNumber(serialNumber);

    if (equipmentWithSameSN) {
      return left(new AlreadyExistsError('Equipment', serialNumber));
    }

    const equipment = Equipment.create({
      name,
      serialNumber,
      type,
    });

    await this.equipmentRepository.create(equipment);

    return right({
      equipment,
    });
  }
}
