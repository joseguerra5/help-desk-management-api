import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import {
  CooperatorEquipment,
  CooperatorEquipmentProps,
} from '@/domain/management/enterprise/entities/cooperator-equipment';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { Injectable } from '@nestjs/common';

export function makeCooperatorEquipment(
  override: Partial<CooperatorEquipmentProps> = {}
) {
  const cooperatorequipment = CooperatorEquipment.create(
    {
      cooperatorId: override.cooperatorId ?? new UniqueEntityId(),
      equipmentId: override.equipmentId ?? new UniqueEntityId(),
      ...override,
    },
    override.equipmentId ?? new UniqueEntityId(),
  );
  return cooperatorequipment;
}

@Injectable()
export class CooperatorEquipmentFactory {
  constructor(private prisma: PrismaService) { }

  async makePrismaCooperatorEquipment(data: Partial<CooperatorEquipmentProps> = {}): Promise<CooperatorEquipment> {
    const equipment = makeCooperatorEquipment(data)

    const existingEquipment = await this.prisma.equipment.findFirst({
      where: { id: equipment.id.toString() },
    });

    if (!existingEquipment) {
      throw new Error(`Equipment with ID ${equipment.id} not found.`);
    }

    await this.prisma.equipment.update({
      where: { id: equipment.id.toString() },
      data: {
        cooperatorId: equipment.cooperatorId.toString(),
      }
    })


    return equipment
  }
}

