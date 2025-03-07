import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { ValueObject } from '@/core/entities/value-object'
import { EquipmentType } from '../equipment'

// informações que eu quero transportar
export interface EquipmentDetailsProps {
  equipmentId: UniqueEntityId,
  type: EquipmentType,
  name: string,
  serialNumber: string,
  createdAt: Date,
  brokenAt?: Date | null,
  brokenReason?: string | null,
  cooperatorId?: string | null,
}

export class EquipmentDetails extends ValueObject<EquipmentDetailsProps> {
  get equipmentId() {
    return this.props.equipmentId
  }

  get type() {
    return this.props.type
  }

  get name() {
    return this.props.name
  }

  get serialNumber() {
    return this.props.serialNumber
  }

  get createdAt() {
    return this.props.createdAt
  }

  get brokenAt() {
    return this.props.brokenAt
  }

  get brokenReason() {
    return this.props.brokenReason
  }

  get cooperatorId() {
    return this.props.cooperatorId
  }

  static create(props: EquipmentDetailsProps): EquipmentDetails {
    return new EquipmentDetails(props)
  }
}
