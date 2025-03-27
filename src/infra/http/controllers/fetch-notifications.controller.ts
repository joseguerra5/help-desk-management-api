import { BadRequestException, Controller, Get, HttpCode } from "@nestjs/common";
import { CurrentUser } from "@/infra/auth/current-user-decorator";
import { UserPayload } from "@/infra/auth/jwt.estrategy";
import { FetchNotificationsByRecipientIdUseCase } from "@/domain/notification/aplication/use-cases/fetch-notification";
import { PrismaNotificationMapper } from "@/infra/database/prisma/mappers/prisma-notification-mapper";



@Controller("/me/notifications")
export class FetchNotificationByRecipientIdController {
  constructor(private fetchNotificationsByRecipientId: FetchNotificationsByRecipientIdUseCase) { }
  @Get()
  @HttpCode(200)
  async handle(
    @CurrentUser() user: UserPayload,

  ) {
    const recipientId = user.sub

    const result = await this.fetchNotificationsByRecipientId.execute({
      recipientId
    })


    if (result.isLeft()) {
      const error = result.value

      throw new BadRequestException(error)
    }


    return {
      notifications: result.value.notifications.map(PrismaNotificationMapper.toPersistence),
      count: result.value.count
    }
  }
}