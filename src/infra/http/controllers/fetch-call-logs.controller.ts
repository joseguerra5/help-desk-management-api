import { BadRequestException, Controller, Get, HttpCode, Param } from "@nestjs/common";
import { FetchCallLogsUseCase } from "@/domain/management/application/use-cases/fetch-call-logs";
import { PrismaCallLogMapper } from "@/infra/database/prisma/mappers/prisma-call-log-mapper";


@Controller("/cooperator/:cooperatorId/call_logs")
export class FetchCallLogsController {
  constructor(private fetchCallLogs: FetchCallLogsUseCase) { }
  @Get()
  @HttpCode(200)
  async handle(
    @Param("cooperatorId") cooperatorId: string,
  ) {
    const result = await this.fetchCallLogs.execute({
      cooperatorId,
    })

    if (result.isLeft()) {

      throw new BadRequestException()
    }

    const callLogs = result.value.callLogs

    return {
      callLogs: callLogs.map(PrismaCallLogMapper.toPersistence)
    }
  }
}