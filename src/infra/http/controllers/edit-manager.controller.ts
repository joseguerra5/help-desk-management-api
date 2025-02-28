import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  HttpCode,
  Put,
} from '@nestjs/common';
import { ZodValidadtionPipe } from '../pipes/zod-validation-pipe';
import { z } from 'zod';
import { AlreadyExistsError } from '@/domain/management/application/use-cases/errors/already-exist-error';
import { CurrentUser } from '@/infra/auth/current-user-decorator';
import { UserPayload } from '@/infra/auth/jwt.estrategy';
import { EditManagerUseCase } from '@/domain/management/application/use-cases/edit-manager';
import { ManagerPresenter } from '../presenters/manager-presenter';

export const editManagerBodySchema = z.object({
  name: z.string(),
  userName: z.string(),
  employeeId: z.string(),
  email: z.string(),
  password: z.string(),
  newPassword: z.string().optional(),
  newPasswordConfirmation: z.string().optional(),
});

export type EditManagerBodySchema = z.infer<typeof editManagerBodySchema>;

@Controller('/accounts')
export class EditManagerController {
  constructor(private editManager: EditManagerUseCase) { }
  @Put()
  @HttpCode(201)
  async handle(
    @Body(new ZodValidadtionPipe(editManagerBodySchema)) body: EditManagerBodySchema,
    @CurrentUser() user: UserPayload,
  ) {
    const {
      name,
      userName,
      employeeId,
      email,
      password,
      newPassword,
      newPasswordConfirmation,
    } = body;

    const userId = user.sub


    const result = await this.editManager.execute({
      managerId: userId,
      name,
      userName,
      employeeId,
      email,
      password,
      newPassword,
      newPasswordConfirmation,
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
      manager: ManagerPresenter.toHTTP(result.value.manager)
    })
  }
}
