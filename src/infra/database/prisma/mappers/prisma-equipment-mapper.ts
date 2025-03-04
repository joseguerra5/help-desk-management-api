import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { Equipment } from '@/domain/management/enterprise/entities/equipment';
import { Prisma, Equipment as PrismaEquipment } from '@prisma/client';
import { EquipmentType } from '@prisma/client';

export class PrismaEquipmentMapper {
  static toPersistence(
    equipment: Equipment,
  ): Prisma.EquipmentUncheckedCreateInput {
    return {
      id: equipment.id.toString(),
      name: equipment.name,
      serialNumber: equipment.serialNumber,
      type: equipment.type as EquipmentType,
      brokenAt: equipment.brokenAt,
      brokenReason: equipment.brokenReason,
      cooperatorId: equipment.cooperatorId,
      createdAt: equipment.createdAt,
    };
  }

  static toDomain(raw: PrismaEquipment) {
    return Equipment.create(
      {
        name: raw.name,
        serialNumber: raw.serialNumber,
        type: raw.type,
        brokenAt: raw.brokenAt,
        brokenReason: raw.brokenReason,
        createdAt: raw.createdAt,
      },
      new UniqueEntityId(raw.id),
    );
  }
}
