import { EquipmentDetails } from '@/domain/management/enterprise/entities/value-objects/equipment-with-details'

export class EquipmentPresenter {
  static toHTTP(equipment: EquipmentDetails) {
    return {
      id: equipment.id.toString(),
      type: equipment.type,
      name: equipment.name,
      serialNumber: equipment.serialNumber,
      createdAt: equipment.createdAt,
      brokenAt: equipment.brokenAt,
      brokenReason: equipment.brokenReason,
      cooperatorId: equipment.cooperatorId
    }
  }

  static toHTTPCooperatorEquipment(equipment: EquipmentDetails) {
    return {
      id: equipment.id.toString(),
      type: equipment.type,
      name: equipment.name,
      serialNumber: equipment.serialNumber,
      createdAt: equipment.createdAt,
      brokenAt: equipment.brokenAt,
      brokenReason: equipment.brokenReason,
      cooperatorId: equipment.cooperatorId
    }
  }
}
