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

type PrismaLoanRecordDetails = PrismaLoanRecord & {
  madeByUser: PrismaUser
  cooperator: PrismaCooperator
  equipments: PrismaEquipment[]
  attachment: PrismaAttachment[]
}

export class PrismaLoanRecordDetailsMapper {
  static toDomain(raw: PrismaLoanRecordDetails): LoanRecordDetails {
    return LoanRecordDetails.create({
      loanRecordId: new UniqueEntityId(raw.id),
      attachment: raw.attachment && raw.attachment.length > 0
        ? raw.attachment.map(att => ({
          title: att.title,
          url: att.url
        }))
        : [],
      cooperator: {
        id: new UniqueEntityId(raw.cooperator.id),
        name: raw.cooperator.name,
        userName: raw.cooperator.userName,
        employeeId: raw.cooperator.employeeId,

      },
      ocurredAt: raw.ocurredAt,
      type: raw.type,
      equipments: raw.equipments.map(PrismaEquipmentMapper.toDomain),
      madeBy: PrismaManagerMapper.toDomain(raw.madeByUser)
    })
  }
}
