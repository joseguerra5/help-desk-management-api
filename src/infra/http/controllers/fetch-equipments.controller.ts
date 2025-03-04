import { BadRequestException, Controller, Get, HttpCode, Query } from "@nestjs/common";
import { z } from "zod";
import { ZodValidadtionPipe } from "../pipes/zod-validation-pipe";
import { EquipmentType } from "@prisma/client";
import { FetchEquipmentsUseCase } from "@/domain/management/application/use-cases/fetch-equipments";
import { PrismaEquipmentMapper } from "@/infra/database/prisma/mappers/prisma-equipment-mapper";

const queryParamSchema = z.object({
  page: z.string().optional().default("1").transform(Number).pipe(z.number().min(1)),
  status: z.string().optional(),
  type: z.string().optional(),
  search: z.string().optional(),
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
    const { page, search } = query

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
      type
    })

    if (result.isLeft()) {
      const error = result.value

      throw new BadRequestException(error)
    }

    const equipments = result.value.equipments

    return {
      equipments: equipments.map(PrismaEquipmentMapper.toPersistence)
    }
  }
}