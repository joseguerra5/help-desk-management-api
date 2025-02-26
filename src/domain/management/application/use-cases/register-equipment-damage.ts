import { Either, left, right } from '@/core/either';
import { AlreadyExistsError } from './errors/already-exist-error';
import { Injectable } from '@nestjs/common';
import { Equipment } from '../../enterprise/entities/equipment';
import { EquipmentRepository } from '../repositories/equipment-repository';
import { ResourceNotFoundError } from './errors/resource-not-found-error';

interface RegisterEquipmentDamageUseCaseRequest {
  equipmentId: string;
  reason: string;
  brokedAt: Date;
}

type RegisterEquipmentDamageUseCaseReponse = Either<
  AlreadyExistsError,
  {
    equipment: Equipment;
  }
>;

@Injectable()
export class RegisterEquipmentDamageUseCase {
  constructor(private equipmentdamageRepository: EquipmentRepository) {}
  async execute({
    equipmentId,
    reason,
    brokedAt,
  }: RegisterEquipmentDamageUseCaseRequest): Promise<RegisterEquipmentDamageUseCaseReponse> {
    const equipment =
      await this.equipmentdamageRepository.findById(equipmentId);

    if (!equipment) {
      return left(new ResourceNotFoundError('Equipment', equipmentId));
    }

    if (equipment.brokenAt !== undefined) {
      return right({ equipment });
    }

    equipment.brokenAt = brokedAt;
    equipment.brokenReason = reason;

    await this.equipmentdamageRepository.save(equipment);

    return right({
      equipment,
    });
  }
}
