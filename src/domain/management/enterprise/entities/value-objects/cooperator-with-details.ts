import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { ValueObject } from '@/core/entities/value-object'
import { Equipment } from '../equipment'
import { CallLog } from '../callLog'

// informações que eu quero transportar
export interface CooperatorDetailsProps {
  cooperatorId: UniqueEntityId
  name: string,
  userName: string,
  employeeId: string,
  nif?: string | null,
  phone: string,
  email: string,
  createdAt: Date,
  departureDate?: Date | null,
  updatedAt?: Date | null,
  inventory: Equipment[],
  callLogs: CallLog[],
}

export class CooperatorDetails extends ValueObject<CooperatorDetailsProps> {
  get cooperatorId() {
    return this.props.cooperatorId
  }

  get name() {
    return this.props.name
  }

  get userName() {
    return this.props.userName
  }

  get employeeId() {
    return this.props.employeeId
  }

  get nif() {
    return this.props.nif
  }

  get phone() {
    return this.props.phone
  }

  get email() {
    return this.props.email
  }

  get createdAt() {
    return this.props.createdAt
  }

  get departureDate() {
    return this.props.departureDate
  }

  get updatedAt() {
    return this.props.updatedAt
  }

  get inventory() {
    return this.props.inventory
  }

  get callLogs() {
    return this.props.callLogs
  }

  static create(props: CooperatorDetailsProps): CooperatorDetails {
    return new CooperatorDetails(props)
  }
}
