import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { CooperatorEquipment } from "@/domain/management/enterprise/entities/cooperator-equipment";
import { Prisma, User as PrismaCooperatorEquipment } from "@prisma/client";

export class PrismaCooperatorEquipmentMapper {
  static toPersistence(cooperatorequipment: CooperatorEquipment): Prisma.EquipmentUncheckedCreateInput {
    return {

    }
  }

  static toDomain(raw: PrismaCooperatorEquipment) {
    return CooperatorEquipment.create({
      email: raw.email,
      employeeId: raw.employeeId,
      name: raw.name,
      password: raw.password,
      userName: raw.userName,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
    }, new UniqueEntityId(raw.id))
  }
}