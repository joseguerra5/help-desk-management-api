import {
  BadRequestException,
  Controller,
  NotFoundException,
  Param,
  Patch,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt.estrategy'
import { ReadNotificationUseCase } from '@/domain/notification/aplication/use-cases/read-notification'
import { NotAllowedError } from '@/core/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/domain/management/application/use-cases/errors/resource-not-found-error'

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
      const error = result.value;

      switch (error.constructor) {
        case ResourceNotFoundError:
          throw new NotFoundException(error.message);

        case NotAllowedError:
          throw new UnauthorizedException(error.message);
        default:
          throw new BadRequestException(error.message);
      }
    }
  }
}
