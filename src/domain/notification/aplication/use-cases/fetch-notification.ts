import { Either, left, right } from '@/core/either'
import { Notification } from '../../enterprise/entities/notification'
import { NotificationRepository } from '../repositories/notification-repository'
import { NotAllowedError } from '@/core/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/domain/management/application/use-cases/errors/resource-not-found-error'
import { Injectable } from '@nestjs/common'


interface FetchNotificationsByRecipientIdUseCaseRequest {
  recipientId: string
}

type FetchNotificationsByRecipientIdUseCaseReponse = Either<ResourceNotFoundError | NotAllowedError, {
  notifications: Notification[]
  count: number
}>

@Injectable()
export class FetchNotificationsByRecipientIdUseCase {
  constructor(private notificationsRepository: NotificationRepository) { }
  async execute({
    recipientId,
  }: FetchNotificationsByRecipientIdUseCaseRequest): Promise<FetchNotificationsByRecipientIdUseCaseReponse> {
    const notifications = await this.notificationsRepository.findManyByRecipientId(recipientId)
    const notificationsUnreadCount = await this.notificationsRepository.count({ recipientId, status: 'unread' })

    if (notifications.length === 0) {
      return left(new ResourceNotFoundError('Notification', recipientId))
    }
    if (recipientId !== notifications[0].recipientId.toString()) {
      return left(new NotAllowedError())
    }


    return right({
      notifications,
      count: notificationsUnreadCount
    })
  }
}
