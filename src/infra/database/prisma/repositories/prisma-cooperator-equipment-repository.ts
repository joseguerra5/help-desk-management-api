import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CooperatorEquipmentRepository, Count } from '@/domain/management/application/repositories/cooperator-equipment-repository';
import { CooperatorEquipment } from '@/domain/management/enterprise/entities/cooperator-equipment';
import { PrismaCooperatorEquipmentMapper } from '../mappers/prisma-cooperator-equipment-mapper';

@Injectable()
export class PrismaCooperatorEquipmentRepository
  implements CooperatorEquipmentRepository {
  constructor(private prisma: PrismaService) { }
  async count({ status }: Count): Promise<number> {
    const amount = await this.prisma.equipment.count({
      where: {
        cooperatorId: status === "loaned" ? { not: "" } : undefined,
      },
    });

    return amount;
  }
  async findManyByCooperatorId(
    cooperatorId: string,
  ): Promise<CooperatorEquipment[]> {
    const equipments = await this.prisma.equipment.findMany({
      where: {
        cooperatorId,
      },
    });
    return equipments.map(PrismaCooperatorEquipmentMapper.toDomain);
  }
  async deleteManyByCooperatorId(cooperatorId: string): Promise<void> {
    await this.prisma.equipment.updateMany({
      where: { cooperatorId },
      data: { cooperatorId: null },
    });
  }
  async createMany(equipments: CooperatorEquipment[]): Promise<void> {
    if (equipments.length === 0) {
      return;
    }

    const data = PrismaCooperatorEquipmentMapper.toPersistenceUpdateMany(equipments);

    await this.prisma.equipment.updateMany(data);
  }

  async deleteMany(equipments: CooperatorEquipment[]): Promise<void> {
    if (equipments.length === 0) {
      return;
    }

    const data =
      PrismaCooperatorEquipmentMapper.toPersistenceDeleteMany(equipments);

    await this.prisma.equipment.updateMany(data);
  }
}
