import { FetchLoanRecordByCooperatorIdUseCase } from "@/domain/management/application/use-cases/fetch-loan-record-by-cooperator-id";
import { BadRequestException, Controller, Get, HttpCode, Param, Query } from "@nestjs/common";
import { z } from "zod";
import { ZodValidadtionPipe } from "../pipes/zod-validation-pipe";
import { LoanRecordPresenter } from "../presenters/loan-record-presenter";

const pageQueryParamSchema = z.string().optional().default("1").transform(Number).pipe(z.number().min(1))

const queryValidationPipe = new ZodValidadtionPipe(pageQueryParamSchema)

type PageQueryParamSchema = z.infer<typeof pageQueryParamSchema>

@Controller("/cooperator/:cooperatorId/loan_records")
export class FetchLoanRecordByCooperatorIdController {
  constructor(private fetchLoanRecord: FetchLoanRecordByCooperatorIdUseCase) { }
  @Get()
  @HttpCode(200)
  async handle(
    @Param("cooperatorId") cooperatorId: string,
    @Query("page", queryValidationPipe) page: PageQueryParamSchema,
  ) {

    const result = await this.fetchLoanRecord.execute({
      cooperatorId,
      page,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }

    const loanRecords = result.value.loanRecords

    return {
      loanRecords: loanRecords.map(LoanRecordPresenter.toHTTP)
    }
  }
}