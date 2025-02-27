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
import { RegisterDepartureDateUseCase } from '@/domain/management/application/use-cases/register-departure-date';

export const registerDepartureDateBodySchema = z.object({
  departureDate: z.string(),
});

export type RegisterDepartureDateBodySchema = z.infer<typeof registerDepartureDateBodySchema>;

@Controller('/cooperator/:cooperatorId/departure')
export class RegisterDepartureDateController {
  constructor(private registerDepartureDate: RegisterDepartureDateUseCase) { }
  @Put()
  @HttpCode(201)
  async handle(
    @Body(new ZodValidadtionPipe(registerDepartureDateBodySchema)) body: RegisterDepartureDateBodySchema,
    @Param("cooperatorId") cooperatorId: string,
  ) {
    const {
      departureDate,
    } = body;

    const result = await this.registerDepartureDate.execute({
      cooperatorId,
      departureDate: new Date(departureDate),
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
      cooperator: result.value.cooperator
    })
  }
}
