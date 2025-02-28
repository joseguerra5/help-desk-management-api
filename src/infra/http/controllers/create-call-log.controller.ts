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
import { CreateCallLogUseCase } from '@/domain/management/application/use-cases/create-call-log';
import { CurrentUser } from '@/infra/auth/current-user-decorator';
import { UserPayload } from '@/infra/auth/jwt.estrategy';
import { CallType } from '@/domain/management/enterprise/entities/callLog';

export const createCallLogBodySchema = z.object({
  type: z.string(),
  description: z.string(),
});

export type CreateCallLogBodySchema = z.infer<typeof createCallLogBodySchema>;

@Controller('/cooperator/:cooperatorId/call_log')
export class CreateCallLogController {
  constructor(private createCallLog: CreateCallLogUseCase) { }
  @Post()
  @HttpCode(201)
  async handle(
    @Body(new ZodValidadtionPipe(createCallLogBodySchema)) body: CreateCallLogBodySchema,
    @Param("cooperatorId") cooperatorId: string,
    @CurrentUser() user: UserPayload,
  ) {
    const {
      description,
    } = body;

    const type = body.type as CallType;
    const userId = user.sub


    const result = await this.createCallLog.execute({
      cooperatorId,
      description,
      madeBy: userId,
      type,
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
      callLog: result.value.callLog
    })
  }
}
