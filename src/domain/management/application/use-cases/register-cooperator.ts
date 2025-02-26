import { Either, left, right } from '@/core/either';
import { Cooperator } from '../../enterprise/entities/cooperator';
import { AlreadyExistsError } from './errors/already-exist-error';
import { Injectable } from '@nestjs/common';
import { CooperatorRepository } from '../repositories/cooperator-repository';
import { CooperatorEquipment } from '../../enterprise/entities/cooperator-equipment';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { InventoryList } from '../../enterprise/entities/inventory-list';

interface RegisterCooperatorUseCaseRequest {
  name: string;
  userName: string;
  employeeId: string;
  phone: string;
  email: string;
  equipmentIds: string[];
  nif?: string;
}

type RegisterCooperatorUseCaseReponse = Either<
  AlreadyExistsError,
  {
    cooperator: Cooperator;
  }
>;

@Injectable()
export class RegisterCooperatorUseCase {
  constructor(private cooperatorRepository: CooperatorRepository) {}
  async execute({
    name,
    userName,
    employeeId,
    phone,
    email,
    nif,
    equipmentIds,
  }: RegisterCooperatorUseCaseRequest): Promise<RegisterCooperatorUseCaseReponse> {
    const cooperatorWithsameEmployeeId =
      await this.cooperatorRepository.findByEmployeeId(employeeId);

    if (cooperatorWithsameEmployeeId) {
      return left(new AlreadyExistsError('EmployeeId', employeeId));
    }

    const cooperator = Cooperator.create({
      email,
      employeeId,
      nif,
      name,
      phone,
      userName,
    });

    const equipments = equipmentIds.map((equipmentId) => {
      return CooperatorEquipment.create({
        cooperatorId: cooperator.id,
        equipmentId: new UniqueEntityId(equipmentId),
      });
    });

    cooperator.inventory = new InventoryList(equipments);

    await this.cooperatorRepository.create(cooperator);

    return right({
      cooperator,
    });
  }
}
