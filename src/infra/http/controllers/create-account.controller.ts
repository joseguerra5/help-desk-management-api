import { RegisterManagerUseCase } from '@/domain/management/application/use-cases/register-manager';
import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  HttpCode,
  Post,
  UnauthorizedException,
  UsePipes,
} from '@nestjs/common';
import { ZodValidadtionPipe } from '../pipes/zod-validation-pipe';
import { z } from 'zod';
import { AlreadyExistsError } from '@/domain/management/application/use-cases/errors/already-exist-error';
import { Public } from '@/infra/auth/public';
import { CredentialDoNotMatchError } from '@/domain/management/application/use-cases/errors/credentials-not-match';

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
@Public()
export class CreateAccountController {
  constructor(private createManager: RegisterManagerUseCase) { }
  @Post()
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
        case CredentialDoNotMatchError:
          throw new UnauthorizedException(error.message);
        default:
          throw new BadRequestException(error.message);
      }
    }
  }
}
