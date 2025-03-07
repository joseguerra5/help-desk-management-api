import { UniqueEntityId } from '../../../..//core/entities/unique-entity-id'
import {
  Equipment as PrismaEquipment
} from '@prisma/client'
import { EquipmentDetails } from '@/domain/management/enterprise/entities/value-objects/equipment-with-details'


export class PrismaEquipmentDetailsMapper {
  static toDomain(raw: PrismaEquipment): EquipmentDetails {
    return EquipmentDetails.create({
      equipmentId: new UniqueEntityId(raw.id),
      name: raw.name,
      brokenAt: raw.brokenAt,
      brokenReason: raw.brokenReason,
      createdAt: raw.createdAt,
      cooperatorId: raw.cooperatorId,
      serialNumber: raw.serialNumber,
      type: raw.type

    })
  }
}
