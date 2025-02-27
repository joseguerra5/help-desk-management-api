import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import {
  LoanRecord,
  LoanRecordProps,
  RecordType,
} from '@/domain/management/enterprise/entities/loan-record';
import { faker } from '@faker-js/faker';
import { makeCooperatorEquipment } from './make-cooperator-equipment';
import { Injectable } from '@nestjs/common';
import { PrismaLoanRecordMapper } from '@/infra/database/prisma/mappers/prisma-loan-record-mapper';
import { PrismaService } from '@/infra/database/prisma/prisma.service';

export function makeLoanRecord(
  override: Partial<LoanRecordProps> = {},
  id?: UniqueEntityId,
) {
  const loanTypes: RecordType[] = ['CHECK_IN', 'CHECK_OUT'];

  const loanrecord = LoanRecord.create(
    {
      cooperatorId: new UniqueEntityId(),
      madeBy: new UniqueEntityId(),
      equipments: [
        makeCooperatorEquipment({
          cooperatorId: id,
          equipmentId: new UniqueEntityId(),
        }),
      ],
      type: override.type ?? faker.helpers.arrayElement(loanTypes),
      ...override,
    },
    id,
  );
  return loanrecord;
}

@Injectable()
export class LoanRecordFactory {
  constructor(private prisma: PrismaService) { }

  async makePrismaLoanRecord(data: Partial<LoanRecordProps> = {}): Promise<LoanRecord> {
    const loanrecord = makeLoanRecord(data)

    await this.prisma.loanRecord.create({
      data: PrismaLoanRecordMapper.toPersistence(loanrecord)
    })

    return loanrecord
  }
}
