import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  NotFoundException,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ZodValidadtionPipe } from '../pipes/zod-validation-pipe';
import { z } from 'zod';
import { ResourceNotFoundError } from '@/domain/management/application/use-cases/errors/resource-not-found-error';
import { CurrentUser } from '@/infra/auth/current-user-decorator';
import { Public } from '@/infra/auth/public';
import { JwtNo2FAAuthGuard } from '@/infra/auth/jwt-no-2fa.guard';
import { TwoFactorDisabledGuard } from '@/infra/auth/jwt-auth-no-2fa.guard';
import { EnableTwoFactorAuthUseCase } from '@/domain/management/application/use-cases/enable-two-factor-auth';
import { UserPayload } from '@/infra/auth/jwt.estrategy';

export const enable2FABodySchema = z.object({
  code: z.string(),
});

export type Enable2FABodySchema = z.infer<typeof enable2FABodySchema>;

@Controller('/2fa/enable')
@Public()
@UseGuards(JwtNo2FAAuthGuard, TwoFactorDisabledGuard)
export class Enable2FAController {
  constructor(private enable2FA: EnableTwoFactorAuthUseCase) { }
  @Post()
  @HttpCode(200)
  async handle(
    @Body(new ZodValidadtionPipe(enable2FABodySchema)) body: Enable2FABodySchema,
    @CurrentUser() user: UserPayload,
  ) {

    const { code } = body;
    const managerId = user.sub

    console.log('managerId', managerId, code)
    const result = await this.enable2FA.execute({
      code,
      managerId,
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
      access_token: result.value.accessToken
    })
  }
}
