import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  HttpCode,
  Post,
} from '@nestjs/common';
import { ZodValidadtionPipe } from '../pipes/zod-validation-pipe';
import { z } from 'zod';
import { AlreadyExistsError } from '@/domain/management/application/use-cases/errors/already-exist-error';
import { RegisterCooperatorUseCase } from '@/domain/management/application/use-cases/register-cooperator';
import { CurrentUser } from '@/infra/auth/current-user-decorator';
import { UserPayload } from '@/infra/auth/jwt.estrategy';

export const registerCooperatorBodySchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email").min(1, "Email is required"),
  userName: z.string().min(1, "Username is required"),
  employeeId: z.string().min(1, "Employee ID is required"),
  phone: z.string().min(1, "Phone number is required"),
  equipmentIds: z.array(z.string().uuid()).optional(),
  nif: z.string().optional()
});

export type RegisterCooperatorBodySchema = z.infer<typeof registerCooperatorBodySchema>;

@Controller('/cooperator')
export class RegisterCooperatorController {
  constructor(private registerCooperator: RegisterCooperatorUseCase) { }
  @Post()
  @HttpCode(201)
  async handle(
    @Body(new ZodValidadtionPipe(registerCooperatorBodySchema)) body: RegisterCooperatorBodySchema,
    @CurrentUser() user: UserPayload,
  ) {
    const {
      email,
      name,
      userName,
      employeeId,
      equipmentIds,
      nif,
      phone
    } = body;

    const userId = user.sub


    const result = await this.registerCooperator.execute({
      email,
      name,
      userName,
      employeeId,
      madeBy: userId,
      equipmentIds,
      phone,
      nif
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
