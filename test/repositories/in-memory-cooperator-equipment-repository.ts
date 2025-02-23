import { CooperatorEquipmentRepository } from "@/domain/management/application/repositories/cooperator-equipment-repository";
import { CooperatorEquipment } from "@/domain/management/enterprise/entities/cooperator-equipment";

export class InMemoryCooperatorEquipmentRepository implements CooperatorEquipmentRepository {
  public items: CooperatorEquipment[] = []
  async findManyByCooperatorId(cooperatorId: string): Promise<CooperatorEquipment[]> {
    const cooperatorEquipments = this.items.filter(
      (item) => item.cooperatorId.toString() === cooperatorId,
    )

    return cooperatorEquipments
  }
  async deleteManyByCooperatorId(cooperatorId: string): Promise<void> {
    const cooperatorEquipments = this.items.filter(
      (item) => item.cooperatorId.toString() !== cooperatorId,
    )

    this.items = cooperatorEquipments
  }
  async createMany(equipments: CooperatorEquipment[]): Promise<void> {
    this.items.push(...equipments)
  }
  async deleteMany(equipments: CooperatorEquipment[]): Promise<void> {
    const coopEquipments = this.items.filter((item) => {
      return !equipments.some((equipment) => equipment.equals(item))
    })

    this.items = coopEquipments
  }
}