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
import { AuthenticateManagerUseCase } from '@/domain/management/application/use-cases/authenticate-manager';

export const authenticateBodySchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export type AuthenticateBodySchema = z.infer<typeof authenticateBodySchema>;

@Controller('/session')
@Public()
export class AuthenticateController {
  constructor(private createManager: AuthenticateManagerUseCase) { }
  @Post()
  @HttpCode(201)
  @UsePipes(new ZodValidadtionPipe(authenticateBodySchema))
  async handle(@Body() body: AuthenticateBodySchema) {
    const {
      email,
      password,
    } = body;
    const result = await this.createManager.execute({
      email,
      password,
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
      access_token: result.value.accessToken
    })
  }
}
