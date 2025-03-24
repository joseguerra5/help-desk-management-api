import { BadRequestException, Controller, Get, HttpCode } from "@nestjs/common";
import { CurrentUser } from "@/infra/auth/current-user-decorator";
import { UserPayload } from "@/infra/auth/jwt.estrategy";
import { FetchNotificationsByRecipientIdUseCase } from "@/domain/notification/aplication/use-cases/fetch-notification";



@Controller("/notifications")
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

    const notifications = result.value.notifications

    return {
      notifications
    }
  }
}