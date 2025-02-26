import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { LoanRecord } from '@/domain/management/enterprise/entities/loan-record';
import { Prisma, LoanRecord as PrismaLoanRecord } from '@prisma/client';

export class PrismaLoanRecordMapper {
  static toPersistence(
    loanRecord: LoanRecord,
  ): Prisma.LoanRecordUncheckedCreateInput {
    return {
      cooperatorId: loanRecord.cooperatorId.toString(),
      madeBy: loanRecord.madeBy.toString(),
      type: loanRecord.type,
      id: loanRecord.id.toString(),
      ocurredAt: loanRecord.ocurredAt,
    };
  }

  static toDomain(raw: PrismaLoanRecord) {
    return LoanRecord.create(
      {
        cooperatorId: new UniqueEntityId(raw.cooperatorId),
        madeBy: new UniqueEntityId(raw.madeBy),
        type: raw.type,
        ocurredAt: raw.ocurredAt,
      },
      new UniqueEntityId(raw.id),
    );
  }
}
