import { ResourceNotFoundError } from "@/domain/management/application/use-cases/errors/resource-not-found-error";
import { BadRequestException, ConflictException, Controller, Get, HttpCode, Param } from "@nestjs/common";
import { GetLoanRecordByIdUseCase } from "@/domain/management/application/use-cases/get-loan-record-by-id";
import { LoanRecordDetailsPresenter } from "../presenters/loan-record-details-presenter";



@Controller("/loan_record/:loanRecordId")
export class GetLoanRecordByIdController {
  constructor(private getLoanRecordById: GetLoanRecordByIdUseCase) { }
  @Get()
  @HttpCode(200)
  async handle(
    @Param("loanRecordId") loanRecordId: string
  ) {

    const result = await this.getLoanRecordById.execute({
      loanRecordId,
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
      loanRecord: LoanRecordDetailsPresenter.toHTTP(result.value.loanRecord)
    }
  }
}