import { Entity } from '@/core/entities/entity';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';

export type EquipmentType = "COMPUTER" | "MONITOR" | "HEADSET" | "KEYBOARD" | "MOUSE" | "BLM" | "ICCID" | "OTHERS"
export interface EquipmentProps {
  type: EquipmentType
  name: string
  serialNumber: string
  createdAt?: Date | null;
  brokenAt?: Date | null;
  brokenReason?: string | null
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

  get brokenReason() {
    return this.props.brokenReason
  }

  set brokenReason(reason: string) {
    this.props.brokenReason = reason;
  }

  get type() {
    return this.props.type
  }

  set type(type: string) {
    this.props.type = type;
  }

  get brokenAt() {
    return this.props.brokenAt
  }

  set brokenAt(brokenAt: Date) {
    this.props.brokenAt = brokenAt;
  }

  get createdAt() {
    return this.props.createdAt
  }

  set createdAt(createdAt: Date) {
    this.props.createdAt = createdAt;
  }


  static create(props: EquipmentProps, id?: UniqueEntityId): Equipment {
    const equipment = new Equipment(props, id);

    return equipment;
  }
}
