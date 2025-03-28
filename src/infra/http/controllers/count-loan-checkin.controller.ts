import { BadRequestException, Controller, Get, HttpCode } from "@nestjs/common";
import { CountLoanCheckInUseCase } from "@/domain/management/application/use-cases/count-loan-checkin";

@Controller("/metrics/check_in")
export class GetCountLoanCheckInController {
  constructor(private sut: CountLoanCheckInUseCase) { }
  @Get()
  @HttpCode(200)
  async handle() {
    const result = await this.sut.execute()

    if (result.isLeft()) {
      throw new BadRequestException()
    }

    return {
      currentMonthAmount: result.value.currentMonthAmount,
      previousMonthAmount: result.value.previousMonthAmount

    }
  }
}