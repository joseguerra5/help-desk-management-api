import { Entity } from "@/core/entities/entity";
import { UniqueEntityId } from "@/core/entities/unique-entity-id";

export interface PDFAttachmentProps {
  loanRecordId: UniqueEntityId
  cooperatorId: UniqueEntityId
  attachmentId: UniqueEntityId
}

export class PDFAttachment extends Entity<PDFAttachmentProps> {
  get loanRecordId() {
    return this.props.loanRecordId
  }

  get cooperatorId() {
    return this.props.cooperatorId
  }

  get attachmentId() {
    return this.props.attachmentId
  }

  static create(props: PDFAttachmentProps, id?: UniqueEntityId) {
    const attachment = new PDFAttachment(props, id)

    return attachment
  }
}