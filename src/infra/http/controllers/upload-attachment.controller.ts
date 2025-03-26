import { BadRequestException, Controller, FileTypeValidator, HttpCode, MaxFileSizeValidator, ParseFilePipe, Post, UnsupportedMediaTypeException, UploadedFile, UseInterceptors } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { UploadAndCreateAttachmentUseCase } from "@/domain/management/application/use-cases/upload-and-create-attachment";
import { InvalidAttachmentTypeError } from "@/domain/management/application/use-cases/errors/invalite-attachment-type-error";


@Controller("/attachments")
export class UploadAttachmentController {
  constructor(private uploadAndCreateAttachment: UploadAndCreateAttachmentUseCase) { }
  @Post()
  @HttpCode(201)
  @UseInterceptors(FileInterceptor("file"))
  async handle(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({
            maxSize: 1024 * 1024 * 2 // 2mb
          }),
          new FileTypeValidator({
            fileType: "pdf"
          }),
        ],
      }),
    )
    file: Express.Multer.File
  ) {
    const result = await this.uploadAndCreateAttachment.execute({
      fileName: file.originalname,
      fileType: file.mimetype,
      body: file.buffer
    })


    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case InvalidAttachmentTypeError:
          throw new UnsupportedMediaTypeException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }

    const { attachment } = result.value

    return {
      attachmentId: attachment.id.toString()
    }
  }
}