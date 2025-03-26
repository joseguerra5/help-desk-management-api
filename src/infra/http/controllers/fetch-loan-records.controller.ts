import { BadRequestException, Controller, Get, HttpCode, Query } from "@nestjs/common";
import { z } from "zod";
import { ZodValidadtionPipe } from "../pipes/zod-validation-pipe";
import { LoanRecordType } from "@prisma/client";
import { FetchLoanRecordUseCase } from "@/domain/management/application/use-cases/fetch-loan-record";
import { LoanRecordDetailsPresenter } from "../presenters/loan-record-details-presenter";

const queryParamSchema = z.object({
  page: z.string()
    .optional()
    .default('1')
    .transform(Number)
    .pipe(z.number().min(1)),
  status: z.string().optional(),
})

const queryValidationPipe = new ZodValidadtionPipe(queryParamSchema)

type QueryParamSchema = z.infer<typeof queryParamSchema>

@Controller("/loan_records")
export class FetchLoanRecordController {
  constructor(private fetchLoanRecord: FetchLoanRecordUseCase) { }
  @Get()
  @HttpCode(200)
  async handle(
    @Query(queryValidationPipe) query: QueryParamSchema,
  ) {
    const { page } = query

    let status: 'CHECK_IN' | 'CHECK_OUT' | undefined;

    if (query.status) {
      status = query.status as LoanRecordType
    }


    const result = await this.fetchLoanRecord.execute({
      page,
      status
    })


    if (result.isLeft()) {
      throw new BadRequestException()
    }

    const loanRecords = result.value.data

    return {
      loanRecords: loanRecords.map(LoanRecordDetailsPresenter.toHTTP),
      meta: {
        pageIndex: result.value.meta.pageIndex,
        perPage: result.value.meta.perPage,
        totalCount: result.value.meta.totalCount,
      }
    }
  }
}