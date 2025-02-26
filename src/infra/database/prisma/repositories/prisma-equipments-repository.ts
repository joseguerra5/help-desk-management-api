import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Equipment } from '@/domain/management/enterprise/entities/equipment';
import { EquipmentRepository } from '@/domain/management/application/repositories/equipment-repository';
import { PrismaEquipmentMapper } from '../mappers/prisma-equipment-mapper';

@Injectable()
export class PrismaEquipmentRepository implements EquipmentRepository {
  constructor(private prisma: PrismaService) {}
  async findBySerialNumber(id: string): Promise<Equipment | null> {
    const equipment = await this.prisma.equipment.findUnique({
      where: {
        serialNumber: id,
      },
    });

    if (!equipment) {
      return null;
    }

    return PrismaEquipmentMapper.toDomain(equipment);
  }

  async findManyByCooperatorId(cooperatorId: string): Promise<Equipment[]> {
    const equipments = await this.prisma.equipment.findMany({
      where: {
        cooperatorId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return equipments.map(PrismaEquipmentMapper.toDomain);
  }

  async save(equipment: Equipment): Promise<void> {
    const data = PrismaEquipmentMapper.toPersistence(equipment);

    await this.prisma.equipment.update({
      where: {
        id: data.id,
      },
      data,
    });
  }

  async findById(id: string): Promise<Equipment | null> {
    const equipment = await this.prisma.equipment.findUnique({
      where: {
        id,
      },
    });

    if (!equipment) {
      return null;
    }

    return PrismaEquipmentMapper.toDomain(equipment);
  }

  async create(equipment: Equipment): Promise<void> {
    const data = PrismaEquipmentMapper.toPersistence(equipment);

    await this.prisma.equipment.create({
      data,
    });
  }
}
