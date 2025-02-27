import { ResourceNotFoundError } from "@/domain/management/application/use-cases/errors/resource-not-found-error";
import { GetCooperatorByIdUseCase } from "@/domain/management/application/use-cases/get-cooperator-by-id";
import { PrismaCooperatorMapper } from "@/infra/database/prisma/mappers/prisma-cooperator-mapper";
import { BadRequestException, ConflictException, Controller, Get, HttpCode, Param } from "@nestjs/common";



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
          throw new ConflictException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }

    return {
      cooperator: PrismaCooperatorMapper.toPersistence(result.value.cooperator)
    }
  }
}