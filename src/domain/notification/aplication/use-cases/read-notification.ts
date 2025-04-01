import { Either, left, right } from '@/core/either'
import { Notification } from '../../enterprise/entities/notification'
import { NotificationRepository } from '../repositories/notification-repository'
import { NotAllowedError } from '@/core/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/domain/management/application/use-cases/errors/resource-not-found-error'
import { Injectable } from '@nestjs/common'


interface ReadNotificationUseCaseRequest {
  recipientId: string
  notificationId: string
}

type ReadNotificationUseCaseReponse = Either<ResourceNotFoundError | NotAllowedError, {
  notification: Notification
}>

@Injectable()
export class ReadNotificationUseCase {
  constructor(private notificationsRepository: NotificationRepository) { }
  async execute({
    recipientId,
    notificationId
  }: ReadNotificationUseCaseRequest): Promise<ReadNotificationUseCaseReponse> {
    console.log("no caso de uso", recipientId, notificationId)
    const notification = await this.notificationsRepository.findById(notificationId)

    if (!notification) {
      return left(new ResourceNotFoundError("Notification", notificationId))
    }


    if (recipientId !== notification.recipientId.toString()) {
      return left(new NotAllowedError())
    }

    notification.read()

    await this.notificationsRepository.save(notification)

    return right({
      notification
    })
  }
}
