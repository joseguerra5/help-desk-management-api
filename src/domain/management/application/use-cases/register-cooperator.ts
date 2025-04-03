import { Either, left, right } from '@/core/either';
import { Cooperator } from '../../enterprise/entities/cooperator';
import { AlreadyExistsError } from './errors/already-exist-error';
import { Injectable } from '@nestjs/common';
import { CooperatorRepository } from '../repositories/cooperator-repository';
import { CooperatorEquipment } from '../../enterprise/entities/cooperator-equipment';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { InventoryList } from '../../enterprise/entities/inventory-list';
import { ManagerRepository } from '../repositories/manager-repository';
import { NotAllowedError } from '@/core/errors/not-allowed-error';

interface RegisterCooperatorUseCaseRequest {
  name: string;
  userName: string;
  employeeId: string;
  phone: string;
  email: string;
  madeBy: string;
  equipmentIds?: string[] | null;
  nif?: string | null;
}

type RegisterCooperatorUseCaseReponse = Either<
  AlreadyExistsError | NotAllowedError,
  {
    cooperator: Cooperator;
  }
>;

@Injectable()
export class RegisterCooperatorUseCase {
  constructor(
    private cooperatorRepository: CooperatorRepository,
    private managerRepository: ManagerRepository
  ) { }
  async execute({
    name,
    userName,
    employeeId,
    phone,
    email,
    nif,
    equipmentIds,
    madeBy
  }: RegisterCooperatorUseCaseRequest): Promise<RegisterCooperatorUseCaseReponse> {
    const manager = await this.managerRepository.findById(madeBy)

    if (!manager) {
      return left(new NotAllowedError());
    }
    const cooperatorWithsameEmployeeId =
      await this.cooperatorRepository.findByEmployeeId(employeeId);

    if (cooperatorWithsameEmployeeId) {
      return left(new AlreadyExistsError('EmployeeId', employeeId));
    }



    const cooperator = Cooperator.create({
      email,
      employeeId,
      nif: nif ? nif : null,
      name,
      phone,
      userName,
    });

    if (equipmentIds) {
      const equipments = equipmentIds.map((equipmentId) => {
        return CooperatorEquipment.create({
          cooperatorId: cooperator.id,
          equipmentId: new UniqueEntityId(equipmentId),
        });
      });

      cooperator.inventory = new InventoryList(equipments);
    }

    await this.cooperatorRepository.create(cooperator);

    return right({
      cooperator,
    });
  }
}
