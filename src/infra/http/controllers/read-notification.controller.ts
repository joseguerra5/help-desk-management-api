import {
  BadRequestException,
  Controller,
  Param,
  Patch,
  UseGuards,
} from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt.estrategy'
import { ReadNotificationUseCase } from '@/domain/notification/aplication/use-cases/read-notification'

@Controller('/notifications/:notificationId/read')
@UseGuards(AuthGuard('jwt'))
export class ReadNotificationController {
  constructor(private readNotification: ReadNotificationUseCase) { }

  @Patch()
  async handle(
    @CurrentUser() user: UserPayload,
    @Param('notificationId') notificationId: string,
  ) {
    const result = await this.readNotification.execute({
      notificationId,
      recipientId: user.sub,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }
  }
}
