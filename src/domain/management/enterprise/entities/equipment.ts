import { Entity } from '@/core/entities/entity';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';

export type EquipmentType = "COMPUTER" | "MONITOR" | "HEADSET" | "KEYBOARD" | "MOUSE" | "BLM" | "ICCID" | "OTHERS"
export interface EquipmentProps {
  type: EquipmentType
  name: string
  serialNumber: string
  createdAt?: Date | null;
}

// inventário é o tipo do produto, etiqueta do produto se existir, 

export class Equipment extends Entity<EquipmentProps> {
  get id(): UniqueEntityId {
    return this.id
  }

  get cooperatorId() {
    return this.props.cooperatorId
  }

  set cooperatorId(id: string) {
    this.props.cooperatorId = id;
  }

  get type() {
    return this.props.type
  }

  static create(props: EquipmentProps, id?: UniqueEntityId): Equipment {
    const equipment = new Equipment(props, id);

    return equipment;
  }
}
