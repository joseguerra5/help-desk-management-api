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
      const error = result.value

      throw new BadRequestException(error.message)
    }

    console.log(result.value.currentMonthAmount, result.value.previousMonthAmount)
    return {
      currentMonthAmount: result.value.currentMonthAmount,
      previousMonthAmount: result.value.currentMonthAmount / result.value.previousMonthAmount,
    }
  }
}