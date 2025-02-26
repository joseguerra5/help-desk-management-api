import { Entity } from '@/core/entities/entity';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';

export interface CooperatorEquipmentProps {
  cooperatorId: UniqueEntityId;
  equipmentId: UniqueEntityId;
}
export class CooperatorEquipment extends Entity<CooperatorEquipmentProps> {
  get cooperatorId() {
    return this.props.cooperatorId;
  }

  get equipmentId() {
    return this.props.equipmentId;
  }

  static create(props: CooperatorEquipmentProps, id?: UniqueEntityId) {
    const equipment = new CooperatorEquipment(props, id);

    return equipment;
  }
}
