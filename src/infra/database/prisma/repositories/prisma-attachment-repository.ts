import { AttachmentRepository } from '@/domain/management/application/repositories/attachment-repository';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Attachment } from '@/domain/management/enterprise/entities/attachment';
import { PrismaAttachmentMapper } from '../mappers/prisma-attachment-mapper';

@Injectable()
export class PrismaAttachmentRepository implements AttachmentRepository {
  constructor(private prisma: PrismaService) { }


  async create(attach: Attachment): Promise<void> {
    const data = PrismaAttachmentMapper.toPersistence(attach);

    await this.prisma.attachment.create({
      data,
    });
  }

  async findById(id: string): Promise<Attachment | null> {
    const attachment = await this.prisma.attachment.findUnique({
      where: {
        id,
      },
    });

    if (!attachment) {
      return null;
    }

    return PrismaAttachmentMapper.toDomain(attachment);
  }
}
