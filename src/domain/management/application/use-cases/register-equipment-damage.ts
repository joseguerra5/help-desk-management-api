import { Either, left, right } from '@/core/either';
import { AlreadyExistsError } from './errors/already-exist-error';
import { Injectable } from '@nestjs/common';
import { Equipment } from '../../enterprise/entities/equipment';
import { EquipmentRepository } from '../repositories/equipment-repository';
import { ResourceNotFoundError } from './errors/resource-not-found-error';

interface RegisterEquipmentDamageUseCaseRequest {
  equipmentId: string;
  reason: string;
  brokenAt: Date;
}

type RegisterEquipmentDamageUseCaseReponse = Either<
  AlreadyExistsError,
  {
    equipment: Equipment;
  }
>;

@Injectable()
export class RegisterEquipmentDamageUseCase {
  constructor(private equipmentdamageRepository: EquipmentRepository) { }
  async execute({
    equipmentId,
    reason,
    brokenAt,
  }: RegisterEquipmentDamageUseCaseRequest): Promise<RegisterEquipmentDamageUseCaseReponse> {
    const equipment =
      await this.equipmentdamageRepository.findById(equipmentId);

    if (!equipment) {
      return left(new ResourceNotFoundError('Equipment', equipmentId));
    }

    equipment.brokenAt = brokenAt;
    equipment.brokenReason = reason;

    await this.equipmentdamageRepository.save(equipment);

    return right({
      equipment,
    });
  }
}
