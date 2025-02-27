import { PDFAttachment } from "../../enterprise/entities/PDF-attachment";


export abstract class PDFAttachmentRepository {
  abstract create(attachment: PDFAttachment): Promise<void>
  abstract delete(attachment: PDFAttachment): Promise<void>
  abstract findByLoanRecordId(loanRecordId: string): Promise<PDFAttachment | null>
  abstract findManyByCooperatorId(cooperatorId: string): Promise<PDFAttachment[]>
  abstract deleteByLoanRecordId(loanRecordId: string): Promise<void>
}

