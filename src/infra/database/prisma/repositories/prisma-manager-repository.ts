import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { ManagerRepository } from '@/domain/management/application/repositories/manager-repository';
import { Manager } from '@/domain/management/enterprise/entities/manager';
import { PrismaManagerMapper } from '../mappers/prisma-manager-mapper';

@Injectable()
export class PrismaManagerRepository implements ManagerRepository {
  constructor(private prisma: PrismaService) {}
  async findByEmail(email: string): Promise<Manager | null> {
    const manager = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!manager) {
      return null;
    }

    return PrismaManagerMapper.toDomain(manager);
  }
  async findByEmployeeId(id: string): Promise<Manager | null> {
    const manager = await this.prisma.user.findUnique({
      where: {
        employeeId: id,
      },
    });

    if (!manager) {
      return null;
    }

    return PrismaManagerMapper.toDomain(manager);
  }

  async save(manager: Manager): Promise<void> {
    const data = PrismaManagerMapper.toPersistence(manager);

    await this.prisma.user.update({
      where: {
        id: data.id,
      },
      data,
    });
  }

  async findById(id: string): Promise<Manager | null> {
    const manager = await this.prisma.user.findUnique({
      where: {
        id,
      },
    });

    if (!manager) {
      return null;
    }

    return PrismaManagerMapper.toDomain(manager);
  }

  async create(manager: Manager): Promise<void> {
    const data = PrismaManagerMapper.toPersistence(manager);

    await this.prisma.user.create({
      data,
    });
  }
}
