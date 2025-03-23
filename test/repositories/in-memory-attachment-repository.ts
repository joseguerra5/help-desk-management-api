import { AttachmentRepository } from '@/domain/management/application/repositories/attachment-repository';
import { Attachment } from '@/domain/management/enterprise/entities/attachment';

export class InMemoryAttachmentRepository implements AttachmentRepository {
  public items: Attachment[] = [];

  async create(attach: Attachment): Promise<void> {
    this.items.push(attach);
  }

  async findById(id: string): Promise<Attachment | null> {
    const attachment = this.items.find((item) => item.id.toString() === id);

    if (!attachment) {
      return null;
    }

    return attachment;
  }
}
