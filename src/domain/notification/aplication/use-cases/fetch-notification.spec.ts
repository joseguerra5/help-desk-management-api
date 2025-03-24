import { makeNotification } from 'test/factories/make-notification'
import { FetchNotificationsByRecipientIdUseCase } from './fetch-notification'
import { InMemoryNotificationRepository } from 'test/repositories/in-memory-notification-repository'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'

let inMemoryNotificationRepository: InMemoryNotificationRepository
let sut: FetchNotificationsByRecipientIdUseCase

describe('Send Notification', () => {
  beforeEach(() => {
    inMemoryNotificationRepository = new InMemoryNotificationRepository()
    sut = new FetchNotificationsByRecipientIdUseCase(inMemoryNotificationRepository)
  })
  it('should be fetch notifications', async () => {
    for (let i = 1; i <= 5; i++) {
      await inMemoryNotificationRepository.create(
        makeNotification({ recipientId: new UniqueEntityId("test") }),
      );
    }

    const result = await sut.execute({
      recipientId: "test"
    })

    expect(result.isRight()).toBe(true)

    if (result.isRight()) {
      expect(result.value.notifications).toHaveLength(5)
    }
  })
})
