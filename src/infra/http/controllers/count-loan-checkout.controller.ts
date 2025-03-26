import { BadRequestException, Controller, Get, HttpCode } from "@nestjs/common";
import { CountLoanCheckoutUseCase } from "@/domain/management/application/use-cases/count-loan-checkout";

@Controller("/metrics/check_out")
export class GetCountLoanCheckOutController {
  constructor(private sut: CountLoanCheckoutUseCase) { }
  @Get()
  @HttpCode(200)
  async handle() {
    const result = await this.sut.execute()

    if (result.isLeft()) {
      throw new BadRequestException()
    }

    return {
      currentMonthAmount: result.value.currentMonthAmount,
      previousMonthAmount: result.value.previousMonthAmount,
    }
  }
}