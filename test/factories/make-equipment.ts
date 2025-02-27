import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import {
  Equipment,
  EquipmentProps,
  EquipmentType,
} from '@/domain/management/enterprise/entities/equipment';
import { PrismaEquipmentMapper } from '@/infra/database/prisma/mappers/prisma-equipment-mapper';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { faker } from '@faker-js/faker';
import { Injectable } from '@nestjs/common';

export function makeEquipment(
  override: Partial<EquipmentProps> = {},
  id?: UniqueEntityId,
) {
  const equipmentTypes: EquipmentType[] = [
    'COMPUTER',
    'MONITOR',
    'HEADSET',
    'KEYBOARD',
    'MOUSE',
    'BLM',
    'ICCID',
    'OTHERS',
  ];
  const equipment = Equipment.create(
    {
      name: faker.commerce.productName(),
      serialNumber: faker.commerce.product(),
      type: override.type ?? faker.helpers.arrayElement(equipmentTypes),
      ...override,
    },
    id,
  );
  return equipment;
}

@Injectable()
export class EquipmentFactory {
  constructor(private prisma: PrismaService) { }

  async makePrismaEquipment(data: Partial<EquipmentProps> = {}): Promise<Equipment> {
    const equipment = makeEquipment(data)

    await this.prisma.equipment.create({
      data: PrismaEquipmentMapper.toPersistence(equipment)
    })

    return equipment
  }
}