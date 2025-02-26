import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Cooperator } from '@/domain/management/enterprise/entities/cooperator';
import { CooperatorRepository } from '@/domain/management/application/repositories/cooperator-repository';
import { PaginationCooperatorParams } from '@/core/repositories/pagination-param';
import { PrismaCooperatorMapper } from '../mappers/prisma-cooperator-mapper';
import { CooperatorEquipmentRepository } from '@/domain/management/application/repositories/cooperator-equipment-repository';

@Injectable()
export class PrismaCooperatorRepository implements CooperatorRepository {
  constructor(
    private prisma: PrismaService,
    private cooperatorEquipmentRepository: CooperatorEquipmentRepository,
  ) {}
  async findMany({
    page,
    search,
    status,
  }: PaginationCooperatorParams): Promise<Cooperator[]> {
    const cooperators = await this.prisma.cooperator.findMany({
      where: {
        departureDate:
          status === 'active'
            ? null
            : status === 'inactive'
              ? { not: null }
              : undefined,
        OR: search
          ? [
              { employeeId: { contains: search, mode: 'insensitive' } },
              { userName: { contains: search, mode: 'insensitive' } },
            ]
          : undefined,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 20,
      skip: (page - 1) * 20,
    });

    return cooperators.map(PrismaCooperatorMapper.toDomain);
  }

  async findByEmail(email: string): Promise<Cooperator | null> {
    const cooperator = await this.prisma.cooperator.findUnique({
      where: {
        email,
      },
    });

    if (!cooperator) {
      return null;
    }

    return PrismaCooperatorMapper.toDomain(cooperator);
  }
  async findByEmployeeId(id: string): Promise<Cooperator | null> {
    const cooperator = await this.prisma.cooperator.findUnique({
      where: {
        id,
      },
    });

    if (!cooperator) {
      return null;
    }

    return PrismaCooperatorMapper.toDomain(cooperator);
  }
  async save(cooperator: Cooperator): Promise<void> {
    const data = PrismaCooperatorMapper.toPersistence(cooperator);

    await Promise.all([
      this.prisma.cooperator.update({
        where: {
          id: data.id,
        },
        data,
      }),

      this.cooperatorEquipmentRepository.createMany(
        cooperator.inventory.getNewItems(),
      ),

      this.cooperatorEquipmentRepository.deleteMany(
        cooperator.inventory.getNewItems(),
      ),
    ]);
  }

  async findById(id: string): Promise<Cooperator | null> {
    const cooperator = await this.prisma.cooperator.findUnique({
      where: {
        id,
      },
    });

    if (!cooperator) {
      return null;
    }

    return PrismaCooperatorMapper.toDomain(cooperator);
  }

  async create(cooperator: Cooperator): Promise<void> {
    const data = PrismaCooperatorMapper.toPersistence(cooperator);

    await this.prisma.cooperator.create({
      data,
    });
  }
}
