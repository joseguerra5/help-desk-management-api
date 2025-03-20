import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Equipment } from '@/domain/management/enterprise/entities/equipment';
import { EquipmentRepository, FindManyEquipments } from '@/domain/management/application/repositories/equipment-repository';
import { PrismaEquipmentMapper } from '../mappers/prisma-equipment-mapper';
import { PaginationEquipmentsParams } from '@/core/repositories/pagination-param';
import { PrismaEquipmentDetailsMapper } from '../mappers/prisma-equipment-details-mapper';

@Injectable()
export class PrismaEquipmentRepository implements EquipmentRepository {
  constructor(private prisma: PrismaService) { }
  async findManyBySearchParms({ page, search, status, type, cooperatorId }: PaginationEquipmentsParams): Promise<FindManyEquipments> {
    const totalCount = await this.prisma.equipment.count()
    const equipments = await this.prisma.equipment.findMany({
      where: {
        brokenAt:
          status === 'available'
            ? null
            : status === 'broken'
              ? { not: null }
              : status === 'loaned'
                ? null : undefined,
        cooperatorId: cooperatorId
          ? cooperatorId
          : status === "available"
            ? null
            : status === "loaned"
              ? { not: null }
              : undefined,
        type,
        OR: search
          ? [
            { serialNumber: { contains: search, mode: 'insensitive' } },
            { name: { contains: search, mode: 'insensitive' } },
          ]
          : undefined,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 20,
      skip: (page - 1) * 20,

    });

    return {
      data: equipments.map(PrismaEquipmentDetailsMapper.toDomain),
      meta: {
        totalCount,
        perPage: 20,
        pageIndex: page
      }
    }
  }
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
