import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { Cooperator } from '@/domain/management/enterprise/entities/cooperator';
import { Prisma, Cooperator as PrismaCooperator, Equipment as PrismaEquipment } from '@prisma/client';
import { InventoryList } from '@/domain/management/enterprise/entities/inventory-list';
import { PrismaCooperatorEquipmentMapper } from './prisma-cooperator-equipment-mapper';

type PrismaCooperatorDetails = PrismaCooperator & {
  Equipment: PrismaEquipment[];
};
export class PrismaCooperatorMapper {
  static toPersistence(
    cooperator: Cooperator,
  ): Prisma.CooperatorUncheckedCreateInput {
    return {
      email: cooperator.email,
      employeeId: cooperator.employeeId,
      name: cooperator.name,
      nif: cooperator.nif,
      phone: cooperator.phone,
      userName: cooperator.userName,
      createdAt: cooperator.createdAt,
      updatedAt: cooperator.updatedAt,
      departureDate: cooperator.departureDate,
      id: cooperator.id.toString(),
    };
  }

  static toDomain(raw: PrismaCooperatorDetails) {
    return Cooperator.create(
      {
        email: raw.email,
        employeeId: raw.employeeId,
        name: raw.name,
        nif: raw.nif,
        phone: raw.phone,
        userName: raw.userName,
        createdAt: raw.createdAt,
        departureDate: raw.departureDate,
        updatedAt: raw.updatedAt,
        inventory: raw.Equipment ? new InventoryList(raw.Equipment.map(PrismaCooperatorEquipmentMapper.toDomain)) : undefined
      },
      new UniqueEntityId(raw.id),
    );
  }
}
