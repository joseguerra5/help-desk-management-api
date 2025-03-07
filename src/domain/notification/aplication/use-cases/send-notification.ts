import { Either, right } from '@/core/either'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Notification } from '../../enterprise/entities/notification'
import { NotificationRepository } from '../repositories/notification-repository'
import { Injectable } from '@nestjs/common'


export interface SendNotificationUseCaseRequest {
  recipientId: string
  title: string
  content: string
}

export type SendNotificationUseCaseReponse = Either<null, {
  notification: Notification
}>

@Injectable()
export class SendNotificationUseCase {
  constructor(private notificationsRepository: NotificationRepository) { }
  async execute({
    recipientId,
    content,
    title,
  }: SendNotificationUseCaseRequest): Promise<SendNotificationUseCaseReponse> {
    const notification = Notification.create({
      content,
      recipientId: new UniqueEntityId(recipientId),
      title
    })

    await this.notificationsRepository.create(notification)


    return right({
      notification
    })
  }
}
