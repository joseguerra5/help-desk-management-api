import { ResourceNotFoundError } from "@/domain/management/application/use-cases/errors/resource-not-found-error";
import { GetCooperatorByIdUseCase } from "@/domain/management/application/use-cases/get-cooperator-by-id";
import { BadRequestException, Controller, Get, HttpCode, NotFoundException, Param } from "@nestjs/common";
import { CooperatorDetailsPresenter } from "../presenters/cooperator-details-presenter";



@Controller("/cooperator/:cooperatorId")
export class GetCooperatorByIdController {
  constructor(private getCooperatorById: GetCooperatorByIdUseCase) { }
  @Get()
  @HttpCode(200)
  async handle(
    @Param("cooperatorId") cooperatorId: string
  ) {

    const result = await this.getCooperatorById.execute({
      cooperatorId,
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
      cooperator: CooperatorDetailsPresenter.toHTTP(result.value.cooperator)
    }
  }
}