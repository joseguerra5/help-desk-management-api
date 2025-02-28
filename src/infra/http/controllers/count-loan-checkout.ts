import { BadRequestException, Controller, Get, HttpCode } from "@nestjs/common";
import { CountLoanCheckoutUseCase } from "@/domain/management/application/use-cases/count-loan-checkout";

@Controller("/loan_record/check_out")
export class GetCountLoanCheckOuController {
  constructor(private sut: CountLoanCheckoutUseCase) { }
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