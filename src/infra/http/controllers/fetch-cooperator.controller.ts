import { BadRequestException, Controller, Get, HttpCode, Query } from "@nestjs/common";
import { z } from "zod";
import { ZodValidadtionPipe } from "../pipes/zod-validation-pipe";
import { FetchCooperatorUseCase } from "@/domain/management/application/use-cases/fetch-cooperators";
import { CooperatorPresenter } from "../presenters/cooperator-presenter";

export const fetchParamSchema = z.object({
  page: z.string()
    .optional()
    .default('1')
    .transform(Number)
    .pipe(z.number().min(1)),
  status: z.string().optional(),
  search: z.string().optional(),
})

export type FetchParamSchema = z.infer<typeof fetchParamSchema>


@Controller("/cooperator")
export class FetchCooperatorController {
  constructor(private fetchCooperator: FetchCooperatorUseCase) { }
  @Get()
  @HttpCode(200)
  async handle(
    @Query(new ZodValidadtionPipe(fetchParamSchema)) query: FetchParamSchema,
  ) {
    const { page, search } = query

    let status: 'inactive' | 'active' | undefined;

    if (query.status) {
      status = query.status as 'inactive' | 'active'
    }

    const result = await this.fetchCooperator.execute({
      search,
      status,
      page,
    })

    if (result.isLeft()) {
      const error = result.value

      throw new BadRequestException(error)
    }

    const cooperators = result.value.cooperators

    return {
      cooperators: cooperators.map(CooperatorPresenter.toHTTP)
    }
  }
}