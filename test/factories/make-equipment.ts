import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { Equipment, EquipmentProps, EquipmentType } from "@/domain/management/enterprise/entities/equipment";
import { faker } from "@faker-js/faker"

export function makeEquipment(
  override: Partial<EquipmentProps> = {},
  id?: UniqueEntityId
) {
  const equipmentTypes: EquipmentType[] = ["COMPUTER", "MONITOR", "HEADSET", "KEYBOARD", "MOUSE", "BLM", "ICCID", "OTHERS"]
  const equipment = Equipment.create({
    name: faker.commerce.productName(),
    serialNumber: faker.commerce.product(),
    type: override.type ?? faker.helpers.arrayElement(equipmentTypes),
    ...override
  }, id)
  return equipment
}