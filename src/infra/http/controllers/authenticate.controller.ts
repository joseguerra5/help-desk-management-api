import {
  BadRequestException,
  Body,
  Controller,
  ForbiddenException,
  HttpCode,
  Post,
  UnauthorizedException,
  UsePipes,
} from '@nestjs/common';
import { ZodValidadtionPipe } from '../pipes/zod-validation-pipe';
import { z } from 'zod';
import { Public } from '@/infra/auth/public';
import { AuthenticateManagerUseCase } from '@/domain/management/application/use-cases/authenticate-manager';
import { CredentialDoNotMatchError } from '@/domain/management/application/use-cases/errors/credentials-not-match';
import { TwoFactorAuthMethodRequiredError } from '@/domain/management/application/use-cases/errors/two-factor-auth-method-error';

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
        case CredentialDoNotMatchError:
          throw new UnauthorizedException(error.message);
        case TwoFactorAuthMethodRequiredError:
          throw new ForbiddenException(error.message);
        default:
          throw new BadRequestException(error.message);
      }
    }

    return ({
      access_token: result.value.accessToken
    })
  }
}
