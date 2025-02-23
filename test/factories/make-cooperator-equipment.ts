import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { CooperatorEquipment, CooperatorEquipmentProps } from "@/domain/management/enterprise/entities/cooperator-equipment";

export function makeCooperatorEquipment(
  override: Partial<CooperatorEquipmentProps> = {},
  id?: UniqueEntityId
) {
  const cooperatorequipment = CooperatorEquipment.create({
    cooperatorId: new UniqueEntityId(),
    equipmentId: new UniqueEntityId(),
    ...override
  }, id)
  return cooperatorequipment
}