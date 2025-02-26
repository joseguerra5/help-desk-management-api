import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { CooperatorEquipment } from '@/domain/management/enterprise/entities/cooperator-equipment';
import { Prisma, Equipment as PrismaCooperatorEquipment } from '@prisma/client';

export class PrismaCooperatorEquipmentMapper {
  static toPersistenceUpdateMany(
    cooperatorequipments: CooperatorEquipment[],
  ): Prisma.EquipmentUpdateManyArgs {
    const cooperatorequipmentIds = cooperatorequipments.map(
      (cooperatorequipment) => {
        return cooperatorequipment.equipmentId.toString();
      },
    );
    return {
      where: {
        id: {
          in: cooperatorequipmentIds,
        },
      },
      data: {
        cooperatorId: cooperatorequipments[0].cooperatorId.toString(),
      },
    };
  }

  static toPersistenceDeleteMany(
    cooperatorequipments: CooperatorEquipment[],
  ): Prisma.EquipmentUpdateManyArgs {
    const cooperatorequipmentIds = cooperatorequipments.map(
      (cooperatorequipment) => {
        return cooperatorequipment.equipmentId.toString();
      },
    );
    return {
      where: {
        id: {
          in: cooperatorequipmentIds,
        },
      },
      data: {
        cooperatorId: null,
      },
    };
  }

  static toDomain(raw: PrismaCooperatorEquipment): CooperatorEquipment {
    if (!raw.cooperatorId) {
      throw new Error('Invalid attachment type');
    }
    return CooperatorEquipment.create(
      {
        cooperatorId: new UniqueEntityId(raw.cooperatorId),
        equipmentId: new UniqueEntityId(raw.id),
      },
      new UniqueEntityId(raw.id),
    );
  }
}
