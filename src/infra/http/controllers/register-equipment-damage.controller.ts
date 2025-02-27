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
import { RegisterEquipmentDamageUseCase } from '@/domain/management/application/use-cases/register-equipment-damage';

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
      const error = result.value;

      switch (error.constructor) {
        case AlreadyExistsError:
          throw new ConflictException(error.message);
        default:
          throw new BadRequestException(error.message);
      }
    }

    return ({
      equipment: result.value.equipment
    })
  }
}
