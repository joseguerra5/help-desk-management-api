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
import { RegisterEquipmentDamageUseCase } from '@/domain/management/application/use-cases/register-equipment-damage';
import { ResourceNotFoundError } from '@/domain/management/application/use-cases/errors/resource-not-found-error';

export const registerEquipmentDamageBodySchema = z.object({
  reason: z.string(),
  brokenAt: z.string(),
});

export type RegisterEquipmentDamageBodySchema = z.infer<typeof registerEquipmentDamageBodySchema>;

@Controller('/equipments/:equipmentId/damage')
export class RegisterEquipmentDamageController {
  constructor(private registerEquipmentDamage: RegisterEquipmentDamageUseCase) { }
  @Put()
  @HttpCode(201)
  async handle(
    @Body(new ZodValidadtionPipe(registerEquipmentDamageBodySchema)) body: RegisterEquipmentDamageBodySchema,
    @Param("equipmentId") equipmentId: string,

  ) {
    const {
      brokenAt,
      reason
    } = body;

    const result = await this.registerEquipmentDamage.execute({
      equipmentId,
      reason,
      brokenAt: new Date(brokenAt),
    });

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case ResourceNotFoundError:
          throw new NotFoundException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }

    return ({
      equipment: result.value.equipment
    })
  }
}
