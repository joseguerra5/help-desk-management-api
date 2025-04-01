import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { Manager, ManagerProps } from '@/domain/management/enterprise/entities/manager';

import { PrismaManagerMapper } from '@/infra/database/prisma/mappers/prisma-manager-mapper';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { faker } from '@faker-js/faker';
import { Injectable } from '@nestjs/common';

export function makeManager(
  override: Partial<ManagerProps> = {},
  id?: UniqueEntityId,
) {
  const manager = Manager.create(
    {
      email: faker.internet.email(),
      employeeId: faker.number.int({ max: 999999, min: 100 }).toString(),
      name: faker.person.fullName(),
      password: faker.internet.password(),
      userName: faker.person.firstName(),
      isTwoFactorAuthenticationEnabled: true,
      twoFactorAuthenticationSecret: "test",
      ...override,
    },
    id,
  );
  return manager;
}

@Injectable()
export class ManagerFactory {
  constructor(private prisma: PrismaService) { }

  async makePrismaManager(data: Partial<ManagerProps> = {}): Promise<Manager> {
    const manager = makeManager(data)


    await this.prisma.user.create({
      data: PrismaManagerMapper.toPersistence(manager)
    })

    return manager
  }
}