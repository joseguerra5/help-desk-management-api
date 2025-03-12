import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { ValueObject } from '@/core/entities/value-object'
import { Manager } from '../manager'
import { Equipment } from '../equipment'
import { Cooperator } from '../cooperator'

// informações que eu quero transportar
export interface LoanRecordDetailsProps {
  loanRecordId: UniqueEntityId
  cooperator: Cooperator
  madeBy: Manager,
  type: string,
  equipments: Equipment[],
  ocurredAt: Date,
  attachment: {
    url: string,
    title: string,
  }
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

  static create(props: LoanRecordDetailsProps): LoanRecordDetails {
    return new LoanRecordDetails(props)
  }
}
