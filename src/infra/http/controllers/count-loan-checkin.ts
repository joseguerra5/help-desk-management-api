import { BadRequestException, Controller, Get, HttpCode } from "@nestjs/common";
import { CountLoanCheckInUseCase } from "@/domain/management/application/use-cases/count-loan-checkin";

@Controller("/loan_record/check_in")
export class GetCountLoanCheckInController {
  constructor(private sut: CountLoanCheckInUseCase) { }
  @Get()
  @HttpCode(200)
  async handle() {
    const result = await this.sut.execute()

    if (result.isLeft()) {
      const error = result.value

      throw new BadRequestException(error.message)
    }

    return {
      amount: result.value.amount
    }
  }
}