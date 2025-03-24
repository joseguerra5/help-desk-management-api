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
  // dependencias
  constructor(private notificationsRepository: NotificationRepository) { }
  // ter apenas um metodo, responsabilidade única do solid
  async execute({
    recipientId,
    notificationId
  }: ReadNotificationUseCaseRequest): Promise<ReadNotificationUseCaseReponse> {
    console.log(recipientId,
      notificationId, "no caso de uso")
    const notification = await this.notificationsRepository.findById(notificationId)

    console.log(notification, "no caso de uso")
    if (!notification) {
      return left(new ResourceNotFoundError("Notification", notificationId))
    }


    if (recipientId !== notification.recipientId.toString()) {
      return left(new NotAllowedError())
    }

    notification.read()

    await this.notificationsRepository.create(notification)

    return right({
      notification
    })
  }
}
