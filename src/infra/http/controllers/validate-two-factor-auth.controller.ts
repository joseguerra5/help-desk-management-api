import {
  BadRequestException,
  Body,
  Controller,
  HttpCode, Post,
  UnauthorizedException,
  UseGuards
} from '@nestjs/common';
import { ZodValidadtionPipe } from '../pipes/zod-validation-pipe';
import { z } from 'zod';
import { ValidateTwoFactorAuthUseCase } from '@/domain/management/application/use-cases/validate-two-factor-auth';
import { UserPayload } from '@/infra/auth/jwt.estrategy';
import { CurrentUser } from '@/infra/auth/current-user-decorator';
import { Public } from '@/infra/auth/public';
import { JwtNo2FAAuthGuard } from '@/infra/auth/jwt-no-2fa.guard';
import { TwoFactorDisabledGuard } from '@/infra/auth/jwt-auth-no-2fa.guard';
import { TwoFactorAuthInvalidError } from '@/domain/management/application/use-cases/errors/two-factor-invalid-error';

export const validate2FACodeBodySchema = z.object({
  code: z.string(),
});

export type Validate2FACodeBodySchema = z.infer<typeof validate2FACodeBodySchema>;

@Controller('/2fa/validate')
@Public()
@UseGuards(JwtNo2FAAuthGuard, TwoFactorDisabledGuard)
export class Validate2FACodeController {
  constructor(private validate2FACode: ValidateTwoFactorAuthUseCase) { }
  @Post()
  @HttpCode(200)
  async handle(
    @Body(new ZodValidadtionPipe(validate2FACodeBodySchema)) body: Validate2FACodeBodySchema,
    @CurrentUser() user: UserPayload,
  ) {
    const { code } = body;
    const managerId = user.sub

    const result = await this.validate2FACode.execute({
      code,
      managerId,
    });

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case TwoFactorAuthInvalidError:
          throw new UnauthorizedException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }

    return ({
      access_token: result.value.accessToken
    })
  }
}
