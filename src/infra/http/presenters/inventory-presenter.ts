import { Equipment } from '@/domain/management/enterprise/entities/equipment'

export class EquipmentPresenter {
  static toHTTP(equipment: Equipment) {
    return {
      id: equipment.id,
      type: equipment.type,
      name: equipment.name,
      serialNumber: equipment.serialNumber,
      createdAt: equipment.createdAt,
      brokenAt: equipment.brokenAt,
      brokenReason: equipment.brokenReason,
    }
  }
}
