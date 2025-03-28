import { BadRequestException, Controller, Get, HttpCode } from "@nestjs/common";
import { CountEquipmentsAvailableAndLoanedUseCase } from "@/domain/management/application/use-cases/count-equipments-loaned";

@Controller("/metrics/equipments")
export class CountEquipmentsAvailableAndLoanedController {
  constructor(private sut: CountEquipmentsAvailableAndLoanedUseCase) { }
  @Get()
  @HttpCode(200)
  async handle() {
    const result = await this.sut.execute()

    if (result.isLeft()) {
      throw new BadRequestException()
    }

    return {
      currentLoanedAmount: result.value.currentLoanedAmount,
      totalAmount: result.value.totalAmount,
    }
  }
}