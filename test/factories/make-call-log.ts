import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { faker } from '@faker-js/faker';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { CallLog, CallLogProps, CallType } from '@/domain/management/enterprise/entities/callLog';
import { PrismaCallLogMapper } from '@/infra/database/prisma/mappers/prisma-call-log-mapper';

export function makeCallLog(
  override: Partial<CallLogProps> = {},
  id?: UniqueEntityId,
) {
  const CallLogTypes: CallType[] = ['TECHNICAL_ISSUE', 'CITRIX_ISSUE', 'PROCEDURE_QUESTION', 'OTHERS'];

  const calllog = CallLog.create(
    {
      cooperatorId: new UniqueEntityId(),
      madeBy: new UniqueEntityId(),
      createdAt: new Date(),
      description: faker.lorem.sentence(),
      type: override.type ?? faker.helpers.arrayElement(CallLogTypes),
      ...override,
    },
    id,
  );
  return calllog;
}

@Injectable()
export class CallLogFactory {
  constructor(private prisma: PrismaService) { }

  async makePrismaCallLog(data: Partial<CallLogProps> = {}): Promise<CallLog> {
    const calllog = makeCallLog(data)

    await this.prisma.callLog.create({
      data: PrismaCallLogMapper.toPersistence(calllog)
    })


    return calllog
  }
}
