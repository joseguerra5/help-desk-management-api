import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { CallLog } from '@/domain/management/enterprise/entities/callLog';
import { Prisma, CallLog as PrismacallLog } from '@prisma/client';

export class PrismaCallLogMapper {
  static toPersistence(callLog: CallLog): Prisma.CallLogUncheckedCreateInput {
    return {
      cooperatorId: callLog.cooperatorId.toString(),
      description: callLog.description,
      madeBy: callLog.madeBy,
      type: callLog.type,
      createdAt: callLog.createdAt,
      id: callLog.id.toString(),
    };
  }

  static toDomain(raw: PrismacallLog) {
    return CallLog.create(
      {
        cooperatorId: new UniqueEntityId(raw.cooperatorId),
        description: raw.description,
        madeBy: new UniqueEntityId(raw.madeBy),
        type: raw.type,
        createdAt: raw.createdAt,
      },
      new UniqueEntityId(raw.id),
    );
  }
}
