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
}>

@Injectable()
export class FetchNotificationsByRecipientIdUseCase {
  constructor(private notificationsRepository: NotificationRepository) { }
  async execute({
    recipientId,
  }: FetchNotificationsByRecipientIdUseCaseRequest): Promise<FetchNotificationsByRecipientIdUseCaseReponse> {
    const notifications = await this.notificationsRepository.findManyByRecipientId(recipientId)

    if (recipientId !== notifications[0].recipientId.toString()) {
      return left(new NotAllowedError())
    }


    return right({
      notifications
    })
  }
}
