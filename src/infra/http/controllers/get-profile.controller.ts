import { ResourceNotFoundError } from "@/domain/management/application/use-cases/errors/resource-not-found-error";
import { BadRequestException, ConflictException, Controller, Get, HttpCode } from "@nestjs/common";
import { UserPayload } from "@/infra/auth/jwt.estrategy";
import { CurrentUser } from "@/infra/auth/current-user-decorator";
import { GetManagerProfileUseCase } from "@/domain/management/application/use-cases/get-manager-profile";
import { ManagerPresenter } from "../presenters/manager-presenter";



@Controller("/me")
export class GetManagerProfileController {
  constructor(private getManagerProfile: GetManagerProfileUseCase) { }
  @Get()
  @HttpCode(200)
  async handle(
    @CurrentUser() user: UserPayload,
  ) {

    const managerId = user.sub

    const result = await this.getManagerProfile.execute({
      managerId,
    })


    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case ResourceNotFoundError:
          throw new ConflictException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }

    return {
      manager: ManagerPresenter.toHTTP(result.value.manager)
    }
  }
}