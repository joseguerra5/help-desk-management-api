import { AttachmentRepository } from '@/domain/management/application/repositories/attachment-repository';
import { Attachment } from '@/domain/management/enterprise/entities/attachment';

export class InMemoryAttachmentRepository implements AttachmentRepository {
  public items: Attachment[] = [];

  async create(attach: Attachment): Promise<void> {
    this.items.push(attach);
  }
}
