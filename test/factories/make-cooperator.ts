import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import {
  Cooperator,
  CooperatorProps,
} from '@/domain/management/enterprise/entities/cooperator';
import { PrismaCooperatorMapper } from '@/infra/database/prisma/mappers/prisma-cooperator-mapper';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { faker } from '@faker-js/faker';
import { Injectable } from '@nestjs/common';

export function makeCooperator(
  override: Partial<CooperatorProps> = {},
  id?: UniqueEntityId,
) {
  const cooperator = Cooperator.create(
    {
      email: faker.internet.email(),
      employeeId: faker.number.int({ max: 999999, min: 100 }).toString(),
      name: faker.person.fullName(),
      userName: faker.person.firstName(),
      phone: faker.phone.number(),
      nif: faker.commerce.price(),
      ...override,
    },
    id,
  );
  return cooperator;
}

@Injectable()
export class CooperatorFactory {
  constructor(private prisma: PrismaService) { }

  async makePrismaCooperator(data: Partial<CooperatorProps> = {}): Promise<Cooperator> {
    const cooperator = makeCooperator(data)

    await this.prisma.cooperator.create({
      data: PrismaCooperatorMapper.toPersistence(cooperator)
    })

    return cooperator
  }
}
