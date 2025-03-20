import { UniqueEntityId } from '../../../..//core/entities/unique-entity-id'
import {
  Cooperator as PrismaCooperator,
  Equipment as PrismaEquipment,
  CallLog as PrismaCallLog,
} from '@prisma/client'
import { CooperatorDetails } from '@/domain/management/enterprise/entities/value-objects/cooperator-with-details'
import { PrismaEquipmentMapper } from './prisma-equipment-mapper'
import { PrismaCallLogMapper } from './prisma-call-log-mapper'

type PrismaCooperatorDetails = PrismaCooperator & {
  CallLog: PrismaCallLog[]
  Equipment: PrismaEquipment[]
}

export class PrismaCooperatorDetailsMapper {
  static toDomain(raw: PrismaCooperatorDetails): CooperatorDetails {
    return CooperatorDetails.create({
      cooperatorId: new UniqueEntityId(raw.id),
      name: raw.name,
      userName: raw.userName,
      employeeId: raw.employeeId,
      nif: raw.nif,
      phone: raw.phone,
      email: raw.email,
      createdAt: raw.createdAt,
      departureDate: raw.departureDate,
      updatedAt: raw.updatedAt,
      inventory: raw.Equipment.map(PrismaEquipmentMapper.toDomain),
      callLogs: raw.CallLog.map(PrismaCallLogMapper.toDomain) ?? []
    })
  }
}
