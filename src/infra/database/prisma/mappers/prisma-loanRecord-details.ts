import { UniqueEntityId } from '../../../..//core/entities/unique-entity-id'
import {
  LoanRecord as PrismaLoanRecord,
  Cooperator as PrismaCooperator,
  Equipment as PrismaEquipment,
  User as PrismaUser,
  Attachment as PrismaAttachment
} from '@prisma/client'
import { PrismaEquipmentMapper } from './prisma-equipment-mapper'
import { LoanRecordDetails } from '@/domain/management/enterprise/entities/value-objects/loan-record-details'
import { PrismaManagerMapper } from './prisma-manager-mapper'
import { PrismaCooperatorMapper } from './prisma-cooperator-mapper'

type PrismaLoanRecordDetails = PrismaLoanRecord & {
  madeByUser: PrismaUser
  cooperator: PrismaCooperator
  equipments: PrismaEquipment[]
  attachment: PrismaAttachment
}

export class PrismaLoanRecordDetailsMapper {
  static toDomain(raw: PrismaLoanRecordDetails): LoanRecordDetails {
    return LoanRecordDetails.create({
      loanRecordId: new UniqueEntityId(raw.id),
      attachment: {
        title: raw.attachment.title,
        url: raw.attachment.url
      },
      cooperator: PrismaCooperatorMapper.toDomain({
        ...raw.cooperator,   // Passando os dados do cooperator
        Equipment: raw.equipments,  // Associando os equipamentos ao cooperator
      }),
      ocurredAt: raw.ocurredAt,
      type: raw.type,
      equipments: raw.equipments.map(PrismaEquipmentMapper.toDomain),
      madeBy: PrismaManagerMapper.toDomain(raw.madeByUser)
    })
  }
}
