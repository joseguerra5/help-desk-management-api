import { CountCallLogsUseCase } from "@/domain/management/application/use-cases/count-call-logs";
import { BadRequestException, Controller, Get, HttpCode } from "@nestjs/common";

@Controller("/metrics/call_logs")
export class CountCallLogsController {
  constructor(private sut: CountCallLogsUseCase) { }
  @Get()
  @HttpCode(200)
  async handle() {
    const result = await this.sut.execute()

    if (result.isLeft()) {
      const error = result.value

      throw new BadRequestException(error.message)
    }

    return {
      currentMonthAmount: result.value.currentMonthAmount,
      previousMonthAmount: result.value.previousMonthAmount,
    }
  }
}