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
import { RegisterDepartureDateUseCase } from '@/domain/management/application/use-cases/register-departure-date';
import { ResourceNotFoundError } from '@/domain/management/application/use-cases/errors/resource-not-found-error';

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
      const error = result.value

      switch (error.constructor) {
        case ResourceNotFoundError:
          throw new NotFoundException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }

    return ({
      cooperator: result.value.cooperator
    })
  }
}
