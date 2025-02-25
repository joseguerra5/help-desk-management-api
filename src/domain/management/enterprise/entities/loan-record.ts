import { Entity } from '@/core/entities/entity';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { PDFAttachment } from './PDF-attachment';
import { Optional } from '@/core/types/optional';
import { CooperatorEquipment } from './cooperator-equipment';

export type RecordType = "CHECK_IN" | "CHECK_OUT"
export interface LoanRecordProps {
  cooperatorId: UniqueEntityId;
  madeBy: UniqueEntityId
  type: RecordType
  equipments?: CooperatorEquipment[]
  ocurredAt: Date;
  attachment?: PDFAttachment | null
}

export class LoanRecord extends Entity<LoanRecordProps> {
  get cooperatorId() {
    return this.props.cooperatorId;
  }

  set cooperatorId(cooperatorId: UniqueEntityId) {
    this.props.cooperatorId = cooperatorId;
    this.touch();
  }

  get attachment() {
    return this.props.attachment;
  }

  set attachment(attachment: PDFAttachment) {
    this.props.attachment = attachment;
    this.touch();
  }
  get equipments() {
    return this.props.equipments;
  }

  get type() {
    return this.props.type;
  }


  get madeBy() {
    return this.props.madeBy;
  }



  get ocurredAt() {
    return this.props.ocurredAt;
  }


  private touch() {
    this.props.updatedAt = new Date();
  }

  static create(props: Optional<LoanRecordProps, "ocurredAt" | "attachment">, id?: UniqueEntityId): LoanRecord {
    const loanrecord = new LoanRecord({
      ...props,
      ocurredAt: props.ocurredAt ?? new Date(),
      attachment: props.attachment ?? null
    }, id);

    return loanrecord;
  }
}
