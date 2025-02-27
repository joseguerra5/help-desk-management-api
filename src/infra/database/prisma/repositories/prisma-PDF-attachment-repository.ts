import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { PDFAttachmentRepository } from '@/domain/management/application/repositories/PDF-attachment-repository';
import { PDFAttachment } from '@/domain/management/enterprise/entities/PDF-attachment';
import { PrismaPDFAttachmentMapper } from '../mappers/prisma-PDF-attachment-mapper';

@Injectable()
export class PrismaPDFAttachmentRepository implements PDFAttachmentRepository {
  constructor(private prisma: PrismaService) { }

  async create(attachment: PDFAttachment): Promise<void> {
    const data = PrismaPDFAttachmentMapper.toPersistenceUpdate(attachment);

    await this.prisma.attachment.update(data);
  }

  async delete(attachment: PDFAttachment): Promise<void> {
    await this.prisma.attachment.delete({
      where: {
        id: attachment.id.toString()
      }
    })
  }

  async findByLoanRecordId(loanRecordId: string): Promise<PDFAttachment | null> {
    const pdfAttachment = await this.prisma.attachment.findFirst({
      where: {
        loanRecordId: loanRecordId
      }
    })


    if (!pdfAttachment) {
      return null
    }


    return PrismaPDFAttachmentMapper.toDomain(pdfAttachment)
  }

  async findManyByCooperatorId(cooperatorId: string): Promise<PDFAttachment[]> {
    const pdfAttachments = await this.prisma.attachment.findMany({
      where: {
        cooperatorId
      }
    })

    return pdfAttachments.map(PrismaPDFAttachmentMapper.toDomain)
  }

  async deleteByLoanRecordId(loanRecordId: string): Promise<void> {
    const attachments = await this.prisma.attachment.findMany({
      where: {
        loanRecordId: loanRecordId, // Procurar por todos os registros com o loanRecordId
      }
    });

    if (attachments.length > 0) {
      // Deletar todos os registros encontrados
      await Promise.all(
        attachments.map((attachment) =>
          this.prisma.attachment.delete({
            where: {
              id: attachment.id, // Usando o id único de cada attachment para deletar
            },
          })
        )
      );
    }
  }
}
