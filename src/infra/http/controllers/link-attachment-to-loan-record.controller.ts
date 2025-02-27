import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  HttpCode,
  Param,
  Post,
} from '@nestjs/common';
import { ZodValidadtionPipe } from '../pipes/zod-validation-pipe';
import { z } from 'zod';
import { AlreadyExistsError } from '@/domain/management/application/use-cases/errors/already-exist-error';
import { LinkAttachmentToLoanRecordUseCase } from '@/domain/management/application/use-cases/link-attachment-to-loan-record';

export const registerCooperatorBodySchema = z.object({
  attachmentId: z.string()
});

export type RegisterCooperatorBodySchema = z.infer<typeof registerCooperatorBodySchema>;

@Controller('/cooperator/:cooperatorId/loanRecord/:loanRecordId')
export class LinkAttachmentToLoanRecordController {
  constructor(private linkLoanRecodAttachment: LinkAttachmentToLoanRecordUseCase) { }
  @Post()
  @HttpCode(201)
  async handle(
    @Body(new ZodValidadtionPipe(registerCooperatorBodySchema)) body: RegisterCooperatorBodySchema,
    @Param("loanRecordId") loanRecordId: string,
    @Param("cooperatorId") cooperatorId: string
  ) {
    const {
      attachmentId
    } = body;


    const result = await this.linkLoanRecodAttachment.execute({
      attachmentId,
      loanRecordId,
      cooperatorId,
    });


    if (result.isLeft()) {
      const error = result.value;

      switch (error.constructor) {
        case AlreadyExistsError:
          throw new ConflictException(error.message);
        default:
          throw new BadRequestException(error.message);
      }
    }

    return ({
      loanRecord: result.value.loanRecord
    })
  }
}
