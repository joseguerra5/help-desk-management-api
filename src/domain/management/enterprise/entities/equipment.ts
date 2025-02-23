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



  get name() {
    return this.props.name
  }

  set name(id: string) {
    this.props.name = id;
  }


  get cooperatorId() {
    return this.props.cooperatorId
  }

  set cooperatorId(id: string) {
    this.props.cooperatorId = id;
  }

  get serialNumber() {
    return this.props.serialNumber
  }

  set serialNumber(id: string) {
    this.props.serialNumber = id;
  }

  get type() {
    return this.props.type
  }

  set type(type: string) {
    this.props.type = type;
  }

  static create(props: EquipmentProps, id?: UniqueEntityId): Equipment {
    const equipment = new Equipment(props, id);

    return equipment;
  }
}
