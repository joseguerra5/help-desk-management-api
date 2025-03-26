import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  NotFoundException,
  Param,
  Put,
} from '@nestjs/common';
import { ZodValidadtionPipe } from '../pipes/zod-validation-pipe';
import { z } from 'zod';
import { CurrentUser } from '@/infra/auth/current-user-decorator';
import { UserPayload } from '@/infra/auth/jwt.estrategy';
import { RegisterInventoryUseCase } from '@/domain/management/application/use-cases/register-inventory-equipments';
import { ResourceNotFoundError } from '@/domain/management/application/use-cases/errors/resource-not-found-error';

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
        case ResourceNotFoundError:
          throw new NotFoundException(error.message);
        default:
          throw new BadRequestException(error.message);
      }
    }

    return ({
      cooperator: result.value.cooperator
    })
  }
}
