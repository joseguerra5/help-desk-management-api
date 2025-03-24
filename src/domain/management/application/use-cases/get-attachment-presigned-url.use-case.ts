import { AttachmentRepository } from "../repositories/attachment-repository";
import { PresignedUrl } from "../storage/get-presigned-url";


import { Either, left, right } from '@/core/either';
import { Injectable } from '@nestjs/common';
import { ResourceNotFoundError } from './errors/resource-not-found-error';

interface GetAttachmentPresignedUrlUseCaseRequest {
  attachmentId: string;
}

type GetAttachmentPresignedUrlUseCaseReponse = Either<
  ResourceNotFoundError,
  {
    url: string;
  }
>;

@Injectable()
export class GetAttachmentPresignedUrlUseCase {
  constructor(
    private attachmentRepository: AttachmentRepository,
    private presignedUrl: PresignedUrl
  ) { }
  async execute({
    attachmentId,
  }: GetAttachmentPresignedUrlUseCaseRequest): Promise<GetAttachmentPresignedUrlUseCaseReponse> {

    const attachment = await this.attachmentRepository.findById(attachmentId);


    if (!attachment) {
      throw left(new ResourceNotFoundError('Attachment', attachmentId));
    }

    const { url } = await this.presignedUrl.presignedUrl(attachment.url);


    return right({
      url,
    });
  }
}
