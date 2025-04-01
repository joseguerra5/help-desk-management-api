import { ResourceNotFoundError } from "@/domain/management/application/use-cases/errors/resource-not-found-error";
import { BadRequestException, Controller, Get, HttpCode, NotFoundException, UseGuards } from "@nestjs/common";
import { UserPayload } from "@/infra/auth/jwt.estrategy";
import { CurrentUser } from "@/infra/auth/current-user-decorator";
import { GenerateSecretToTwoFactorAuthUseCase } from "@/domain/management/application/use-cases/generate-secret-two-factor";
import { TwoFactorDisabledGuard } from "@/infra/auth/jwt-auth-no-2fa.guard";
import { Public } from "@/infra/auth/public";
import { JwtNo2FAAuthGuard } from "@/infra/auth/jwt-no-2fa.guard";



@Controller("/2fa/qr_code")
@Public()
@UseGuards(JwtNo2FAAuthGuard, TwoFactorDisabledGuard)
export class GetQrCodeTo2faController {
  constructor(private getQrCodeTo2fa: GenerateSecretToTwoFactorAuthUseCase) { }
  @Get()
  @HttpCode(200)
  async handle(
    @CurrentUser() user: UserPayload,
  ) {

    const managerId = user.sub

    const result = await this.getQrCodeTo2fa.execute({
      managerId,
    })


    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case ResourceNotFoundError:
          throw new NotFoundException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }

    return {
      otpAuthUrl: result.value.otpAuthUrl
    }
  }
}