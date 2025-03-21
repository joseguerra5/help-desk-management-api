import { ResourceNotFoundError } from "@/domain/management/application/use-cases/errors/resource-not-found-error";
import { BadRequestException, ConflictException, Controller, Get, HttpCode, Param } from "@nestjs/common";
import { GetAttachmentPresignedUrlUseCase } from "@/domain/management/application/use-cases/get-attachment-presigned-url.use-case";



@Controller("/attachment/:attachmentId")
export class GetAttachmentPresignedUrlController {
  constructor(private getAttachmentPresignedUrl: GetAttachmentPresignedUrlUseCase) { }
  @Get()
  @HttpCode(200)
  async handle(
    @Param("attachmentId") attachmentId: string,
  ) {
    console.log("id do attachment na req", attachmentId)
    const result = await this.getAttachmentPresignedUrl.execute({
      attachmentId
    })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case ResourceNotFoundError:
          throw new ConflictException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }

    return {
      url: result.value.url
    }
  }
}