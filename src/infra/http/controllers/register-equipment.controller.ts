import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  HttpCode,
  Post,
  UnauthorizedException,
} from '@nestjs/common';
import { ZodValidadtionPipe } from '../pipes/zod-validation-pipe';
import { z } from 'zod';
import { AlreadyExistsError } from '@/domain/management/application/use-cases/errors/already-exist-error';
import { RegisterEquipmentUseCase } from '@/domain/management/application/use-cases/register-equipment';
import { CurrentUser } from '@/infra/auth/current-user-decorator';
import { UserPayload } from '@/infra/auth/jwt.estrategy';
import { EquipmentType } from '@prisma/client';
import { NotAllowedError } from '@/core/errors/not-allowed-error';

export const registerEquipmentBodySchema = z.object({
  type: z.enum([EquipmentType.BLM, EquipmentType.COMPUTER, EquipmentType.HEADSET, EquipmentType.ICCID, EquipmentType.KEYBOARD, EquipmentType.MONITOR, EquipmentType.MOUSE, EquipmentType.OTHERS]),
  name: z.string(),
  serialNumber: z.string()
});

export type RegisterEquipmentBodySchema = z.infer<typeof registerEquipmentBodySchema>;

@Controller('/equipments')
export class RegisterEquipmentController {
  constructor(private registerEquipment: RegisterEquipmentUseCase) { }
  @Post()
  @HttpCode(201)
  async handle(
    @Body(new ZodValidadtionPipe(registerEquipmentBodySchema)) body: RegisterEquipmentBodySchema,
    @CurrentUser() user: UserPayload,
  ) {
    const {
      name,
      serialNumber,
      type
    } = body;

    const userId = user.sub


    const result = await this.registerEquipment.execute({
      name,
      serialNumber,
      type,
      madeBy: userId
    });

    if (result.isLeft()) {
      const error = result.value;

      switch (error.constructor) {
        case AlreadyExistsError:
          throw new ConflictException(error.message);
        case NotAllowedError:
          throw new UnauthorizedException(error.message);
        default:
          throw new BadRequestException(error.message);
      }
    }

    return ({
      equipment: result.value.equipment
    })
  }
}
