import { SendNotificationUseCase } from './send-notification'
import { InMemoryNotificationRepository } from 'test/repositories/in-memory-notification-repository'

let inMemoryNotificationRepository: InMemoryNotificationRepository
let sut: SendNotificationUseCase

describe('Send Notification', () => {
  beforeEach(() => {
    inMemoryNotificationRepository = new InMemoryNotificationRepository()
    sut = new SendNotificationUseCase(inMemoryNotificationRepository)
  })
  it('should be able send a notification', async () => {
    const result = await sut.execute({
      content: 'nova resposta',
      title: 'Nova pergunta',
      recipientId: 'recipient-id'
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryNotificationRepository.items[0]).toEqual(result.value?.notification)
  })
})
