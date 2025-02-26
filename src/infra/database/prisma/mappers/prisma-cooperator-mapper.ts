import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { Cooperator } from '@/domain/management/enterprise/entities/cooperator';
import { Prisma, Cooperator as PrismaCooperator } from '@prisma/client';

export class PrismaCooperatorMapper {
  static toPersistence(
    cooperator: Cooperator,
  ): Prisma.CooperatorUncheckedCreateInput {
    return {
      email: cooperator.email,
      employeeId: cooperator.employeeId,
      name: cooperator.name,
      nif: cooperator.nif,
      phone: cooperator.phone,
      userName: cooperator.userName,
      createdAt: cooperator.updatedAt,
      updatedAt: cooperator.updatedAt,
    };
  }

  static toDomain(raw: PrismaCooperator) {
    return Cooperator.create(
      {
        email: raw.email,
        employeeId: raw.employeeId,
        name: raw.name,
        nif: raw.nif,
        phone: raw.phone,
        userName: raw.userName,
        createdAt: raw.createdAt,
        departureDate: raw.departureDate,
        updatedAt: raw.updatedAt,
      },
      new UniqueEntityId(raw.id),
    );
  }
}
