import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { Manager } from '@/domain/management/enterprise/entities/manager';
import { Prisma, User as PrismaManager } from '@prisma/client';

export class PrismaManagerMapper {
  static toPersistence(manager: Manager): Prisma.UserUncheckedCreateInput {
    return {
      email: manager.email,
      employeeId: manager.employeeId.toString(),
      name: manager.name,
      password: manager.password,
      userName: manager.userName,
      createdAt: manager.createdAt,
      updatedAt: manager.updatedAt,
      id: manager.id.toString(),
      isTwoFactorAuthenticationEnabled: manager.isTwoFactorAuthenticationEnabled,
      twoFactorAuthenticationSecret: manager.twoFactorAuthenticationSecret
    };
  }

  static toDomain(raw: PrismaManager) {
    return Manager.create(
      {
        email: raw.email,
        employeeId: raw.employeeId,
        name: raw.name,
        password: raw.password,
        userName: raw.userName,
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
        isTwoFactorAuthenticationEnabled: raw.isTwoFactorAuthenticationEnabled,
        twoFactorAuthenticationSecret: raw.twoFactorAuthenticationSecret ? raw.twoFactorAuthenticationSecret : undefined
      },
      new UniqueEntityId(raw.id),
    );
  }
}
