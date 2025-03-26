import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  HttpCode,
  NotFoundException,
  Param,
  Put,
} from '@nestjs/common';
import { ZodValidadtionPipe } from '../pipes/zod-validation-pipe';
import { z } from 'zod';
import { AlreadyExistsError } from '@/domain/management/application/use-cases/errors/already-exist-error';
import { EditCooperatorUseCase } from '@/domain/management/application/use-cases/edit-cooperator';
import { CooperatorPresenter } from '../presenters/cooperator-presenter';
import { ResourceNotFoundError } from '@/domain/management/application/use-cases/errors/resource-not-found-error';

export const editCooperatorBodySchema = z.object({
  name: z.string(),
  userName: z.string(),
  employeeId: z.string(),
  email: z.string(),
  phone: z.string(),
});

export type EditCooperatorBodySchema = z.infer<typeof editCooperatorBodySchema>;

@Controller('/cooperator/:cooperatorId')
export class EditCooperatorController {
  constructor(private editCooperator: EditCooperatorUseCase) { }
  @Put()
  @HttpCode(201)
  async handle(
    @Param("cooperatorId") cooperatorId: string,
    @Body(new ZodValidadtionPipe(editCooperatorBodySchema)) body: EditCooperatorBodySchema,
  ) {
    const {
      name,
      userName,
      employeeId,
      email,
      phone,
    } = body;

    const result = await this.editCooperator.execute({
      cooperatorId,
      name,
      userName,
      employeeId,
      email,
      phone,
    });

    if (result.isLeft()) {
      const error = result.value;

      switch (error.constructor) {
        case AlreadyExistsError:
          throw new ConflictException(error.message);
        case ResourceNotFoundError:
          throw new NotFoundException(error.message);
        default:
          throw new BadRequestException(error.message);
      }
    }

    return ({
      cooperator: CooperatorPresenter.toHTTP(result.value.cooperator),
    })
  }
}
