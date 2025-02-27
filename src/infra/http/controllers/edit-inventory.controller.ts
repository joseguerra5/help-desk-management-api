import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  HttpCode,
  Param,
  Put,
} from '@nestjs/common';
import { ZodValidadtionPipe } from '../pipes/zod-validation-pipe';
import { z } from 'zod';
import { AlreadyExistsError } from '@/domain/management/application/use-cases/errors/already-exist-error';
import { CurrentUser } from '@/infra/auth/current-user-decorator';
import { UserPayload } from '@/infra/auth/jwt.estrategy';
import { RegisterInventoryUseCase } from '@/domain/management/application/use-cases/register-inventory-equipments';

export const editInventoryBodySchema = z.object({
  equipmentsIds: z.array(z.string().uuid()).nullable()
});

export type EditInventoryBodySchema = z.infer<typeof editInventoryBodySchema>;

@Controller('/cooperator/:cooperatorId/inventory')
export class EditInventoryController {
  constructor(private editInventory: RegisterInventoryUseCase) { }
  @Put()
  @HttpCode(201)
  async handle(
    @Param("cooperatorId") cooperatorId: string,
    @Body(new ZodValidadtionPipe(editInventoryBodySchema)) body: EditInventoryBodySchema,
    @CurrentUser() user: UserPayload,
  ) {
    const {
      equipmentsIds
    } = body;

    const userId = user.sub


    const result = await this.editInventory.execute({
      equipmentsIds,
      managerId: userId,
      cooperatorId
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
      equipment: result.value.cooperator
    })
  }
}
