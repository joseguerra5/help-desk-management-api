import { UniqueEntityId } from '../../../..//core/entities/unique-entity-id'
import {
  LoanRecord as PrismaLoanRecord,
  Cooperator as PrismaCooperator,
  Equipment as PrismaEquipment,
  User as PrismaUser,
  Attachment as PrismaAttachment
} from '@prisma/client'
import { LoanRecordDetails } from '@/domain/management/enterprise/entities/value-objects/loan-record-details'
import { PrismaManagerMapper } from './prisma-manager-mapper'
import { PrismaEquipmentDetailsMapper } from './prisma-equipment-details-mapper'

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
      attachment: raw.attachment.length > 0
        ? raw.attachment.map(att => ({ title: att.title, url: att.url, id: att.id }))
        : [],
      cooperator: {
        id: new UniqueEntityId(raw.cooperator.id),
        name: raw.cooperator.name,
        userName: raw.cooperator.userName,
        employeeId: raw.cooperator.employeeId,
        departureDate: raw.cooperator.departureDate,
        nif: raw.cooperator.nif,
      },
      ocurredAt: raw.ocurredAt,
      type: raw.type,
      equipments: raw.equipments.map(PrismaEquipmentDetailsMapper.toDomain),
      madeBy: PrismaManagerMapper.toDomain(raw.madeByUser)
    })
  }
}
