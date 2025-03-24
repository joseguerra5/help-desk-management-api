import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { ValueObject } from '@/core/entities/value-object'
import { Manager } from '../manager'
import { EquipmentDetails } from './equipment-with-details'

// informações que eu quero transportar
export interface LoanRecordDetailsProps {
  loanRecordId: UniqueEntityId
  cooperator: {
    id: UniqueEntityId,
    name: string,
    userName: string,
    employeeId: string,
    departureDate: Date | null,
    nif: string
  }
  madeBy: Manager,
  type: string,
  equipments: EquipmentDetails[],
  ocurredAt: Date,
  attachment: {
    title: string,
    url: string,
    id: string
  }[] | null
}

export class LoanRecordDetails extends ValueObject<LoanRecordDetailsProps> {
  get loanRecordId() {
    return this.props.loanRecordId
  }

  get cooperator() {
    return this.props.cooperator
  }

  get madeBy() {
    return this.props.madeBy
  }

  get type() {
    return this.props.type
  }

  get equipments() {
    return this.props.equipments
  }

  get ocurredAt() {
    return this.props.ocurredAt
  }

  get attachment() {
    return this.props.attachment
  }

  get departureDate() {
    return this.props.departureDate
  }

  get nif() {
    return this.props.nif
  }


  get url() {
    return this.props.url
  }

  static create(props: LoanRecordDetailsProps): LoanRecordDetails {
    return new LoanRecordDetails(props)
  }
}
