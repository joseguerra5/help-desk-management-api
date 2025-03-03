import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { PDFAttachment } from '@/domain/management/enterprise/entities/PDF-attachment';
import { Prisma, Attachment as PrismaPDFAttachment } from '@prisma/client';

export class PrismaPDFAttachmentMapper {
  static toPersistenceUpdate(
    pdfAttachment: PDFAttachment,
  ): Prisma.AttachmentUpdateArgs {
    return {
      where: {
        id: pdfAttachment.attachmentId.toString()
      },
      data: {
        loanRecordId: pdfAttachment.loanRecordId
          ? pdfAttachment.loanRecordId.toString()
          : undefined,
        cooperatorId: pdfAttachment.cooperatorId
          ? pdfAttachment.cooperatorId.toString()
          : undefined,
      }
    }
  }


  static toDomain(raw: PrismaPDFAttachment): PDFAttachment {
    if (!raw.cooperatorId) {
      throw new Error('Invalid attachment type');
    }
    return PDFAttachment.create(
      {
        attachmentId: new UniqueEntityId(raw.id),
        cooperatorId: new UniqueEntityId(raw.cooperatorId),
        loanRecordId: new UniqueEntityId(raw.loanRecordId ?? ""),
      },
      new UniqueEntityId(raw.id),
    );
  }
}
