import { Either, left, right } from "@/core/either";
import { Attachment } from "../../enterprise/entities/attachment";
import { AttachmentRepository } from "../repositories/attachment-repository";
import { Uploader } from "../storage/uploader";
import { InvalidAttachmentTypeError } from "./errors/invalite-attachment-type-error";

interface UploadAndCreateAttachmentUseCaseRequest {
  fileName: string
  fileType: string
  body: Buffer
}

type UploadAndCreateAttachmentUseCaseReponse = Either<
  InvalidAttachmentTypeError,
  {
    attachment: Attachment
  }
>
export class UploadAndCreateAttachmentUseCase {
  constructor(
    private attachmentRepository: AttachmentRepository,
    private uploader: Uploader
  ) { }
  async execute({
    body,
    fileName,
    fileType
  }: UploadAndCreateAttachmentUseCaseRequest): Promise<UploadAndCreateAttachmentUseCaseReponse> {
    if (!/^application\/pdf$/.test(fileType)) {
      return left(new InvalidAttachmentTypeError(fileType))
    }

    const { url } = await this.uploader.upload({
      body,
      fileName,
      fileType
    })

    const attachment = Attachment.create({
      title: fileName,
      url,
    })

    await this.attachmentRepository.create(attachment)

    return right({
      attachment
    })
  }
}