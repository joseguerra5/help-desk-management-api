import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { Equipment } from "@/domain/management/enterprise/entities/equipment";
import { Prisma, Equipment as PrismaEquipment } from "@prisma/client";

export class PrismaEquipmentMapper {
  static toPersistence(equipment: Equipment): Prisma.EquipmentUncheckedCreateInput {
    return {
      name: equipment.name,
      serialNumber: equipment.serialNumber,
      type: equipment.type,
      brokenAt: equipment.brokenAt,
      brokenReason: equipment.brokenReason,
      cooperatorId: equipment.cooperatorId,
      createdAt: equipment.createdAt,
      id: equipment.id.toString(),
    }
  }

  static toDomain(raw: PrismaEquipment) {
    return Equipment.create({
      name: raw.name,
      serialNumber: raw.serialNumber,
      type: raw.type,
      brokenAt: raw.brokenAt,
      brokenReason: raw.brokenReason,
      createdAt: raw.createdAt
    }, new UniqueEntityId(raw.id))
  }
}