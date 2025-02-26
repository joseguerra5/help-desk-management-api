import { RegisterManagerUseCase } from '@/domain/management/application/use-cases/register-manager';
import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  HttpCode,
  Post,
  UsePipes,
} from '@nestjs/common';
import { ZodValidadtionPipe } from '../pipes/zod-validation-pipe';
import { z } from 'zod';
import { AlreadyExistsError } from '@/domain/management/application/use-cases/errors/already-exist-error';
import { Public } from '@/infra/auth/public';

export const createAccountBodySchema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string().min(6),
  passwordConfirmation: z.string().min(6),
  userName: z.string(),
  employeeId: z.string(),
});

export type CreateAccountBodySchema = z.infer<typeof createAccountBodySchema>;

@Controller('/accounts')
export class CreateAccountController {
  constructor(private createManager: RegisterManagerUseCase) { }
  @Post()
  @Public()
  @HttpCode(201)
  @UsePipes(new ZodValidadtionPipe(createAccountBodySchema))
  async handle(@Body() body: CreateAccountBodySchema) {
    const {
      email,
      name,
      password,
      passwordConfirmation,
      userName,
      employeeId,
    } = body;
    const result = await this.createManager.execute({
      email,
      name,
      password,
      userName,
      passwordConfirmation,
      employeeId,
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
  }
}
