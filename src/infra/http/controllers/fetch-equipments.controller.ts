import { BadRequestException, Controller, Get, HttpCode, Query } from "@nestjs/common";
import { z } from "zod";
import { ZodValidadtionPipe } from "../pipes/zod-validation-pipe";
import { EquipmentType } from "@prisma/client";
import { FetchEquipmentsUseCase } from "@/domain/management/application/use-cases/fetch-equipments";
import { EquipmentPresenter } from "../presenters/inventory-presenter";

const queryParamSchema = z.object({
  page: z.string().optional().default("1").transform(Number).pipe(z.number().min(1)),
  status: z.string().optional(),
  type: z.string().optional(),
  search: z.string().optional(),
  cooperatorId: z.string().optional(),
})


type QueryParamSchema = z.infer<typeof queryParamSchema>

@Controller("/equipments")
export class FetchEquipmentsController {
  constructor(private fetchEquipment: FetchEquipmentsUseCase) { }
  @Get()
  @HttpCode(200)
  async handle(
    @Query(new ZodValidadtionPipe(queryParamSchema)) query: QueryParamSchema,
  ) {
    const { page, search, cooperatorId } = query

    let status: 'available' | 'loaned' | 'broken' | undefined;

    if (query.status) {
      status = query.status as 'available' | 'loaned' | 'broken'
    }

    let type: EquipmentType | undefined

    if (query.type) {
      type = query.type as EquipmentType
    }


    const result = await this.fetchEquipment.execute({
      status,
      page,
      search,
      type,
      cooperatorId
    })

    if (result.isLeft()) {

      throw new BadRequestException()
    }

    const equipments = result.value.data


    return {
      equipments: equipments.map(EquipmentPresenter.toHTTPCooperatorEquipment),
      meta: {
        pageIndex: result.value.meta.pageIndex,
        perPage: result.value.meta.perPage,
        totalCount: result.value.meta.totalCount,
      }
    }
  }
}