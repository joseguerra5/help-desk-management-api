import { Attachment } from '../../enterprise/entities/attachment';

export abstract class AttachmentRepository {
  abstract create(attach: Attachment): Promise<void>;
  abstract findById(id: string): Promise<Attachment | null>;
}
