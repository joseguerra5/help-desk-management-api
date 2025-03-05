import { waitFor } from 'test/util/wait-for'
import { vi, MockInstance } from 'vitest'
import { SendNotificationUseCase } from '../aplication/use-cases/send-notification'
import { InMemoryNotificationRepository } from 'test/repositories/in-memory-notification-repository'
import { InMemoryCooperatorRepository } from 'test/repositories/in-memory-cooperator-repository'
import { InMemoryEquipmentRepository } from 'test/repositories/in-memory-equipments-repository'
import { FakeScheduleRegistry } from 'test/schedule/fake-schedule-registry'
import { OnCooperatorExitCheckEquipment } from './on-cooperator-exit-check-equipments'
import { InMemoryManagerRepository } from 'test/repositories/in-memory-manager-repository'
import { makeCooperator } from 'test/factories/make-cooperator'
import { makeCooperatorEquipment } from 'test/factories/make-cooperator-equipment'
import { makeEquipment } from 'test/factories/make-equipment'
import { InventoryList } from '@/domain/management/enterprise/entities/inventory-list'
import { makeManager } from 'test/factories/make-manager'

let inMemoryNotificationRepository: InMemoryNotificationRepository
let inMemoryCooperatorRepository: InMemoryCooperatorRepository
let inMemoryManagerRepository: InMemoryManagerRepository
let inMemoryEquipmentRepository: InMemoryEquipmentRepository
let fakeSchedule: FakeScheduleRegistry
let sendNotificationUseCase: SendNotificationUseCase

let sendNotificationExecuteSpy: MockInstance
describe('On cooperator exit', () => {
  beforeEach(() => {
    inMemoryNotificationRepository = new InMemoryNotificationRepository()
    inMemoryCooperatorRepository = new InMemoryCooperatorRepository()
    inMemoryManagerRepository = new InMemoryManagerRepository()
    inMemoryEquipmentRepository = new InMemoryEquipmentRepository()
    fakeSchedule = new FakeScheduleRegistry()

    sendNotificationUseCase = new SendNotificationUseCase(
      inMemoryNotificationRepository,
    )

    vi.spyOn(fakeSchedule, 'scheduleOnce');
    sendNotificationExecuteSpy = vi.spyOn(sendNotificationUseCase, 'execute')

    new OnCooperatorExitCheckEquipment(
      sendNotificationUseCase, inMemoryCooperatorRepository, inMemoryManagerRepository
    )
  })
  it('should be able to send a notification when a cooperator exits', async () => {
    const cooperator = makeCooperator();
    const equipment1 = makeEquipment();
    const equipment2 = makeEquipment();

    await inMemoryEquipmentRepository.create(equipment1);
    await inMemoryEquipmentRepository.create(equipment2);

    const CooperatorEquipment1 = makeCooperatorEquipment({
      cooperatorId: cooperator.id,
      equipmentId: equipment1.id,
    });

    const CooperatorEquipment2 = makeCooperatorEquipment({
      cooperatorId: cooperator.id,
      equipmentId: equipment2.id,
    });

    const inventoryList = new InventoryList([CooperatorEquipment1, CooperatorEquipment2]);
    cooperator.inventory = inventoryList;

    await inMemoryCooperatorRepository.create(cooperator);

    // Adicionar gerentes ao repositório
    const manager1 = makeManager()
    const manager2 = makeManager()
    await inMemoryManagerRepository.create(manager1);
    await inMemoryManagerRepository.create(manager2);

    cooperator.departureDate = new Date();
    await inMemoryCooperatorRepository.save(cooperator);


    await waitFor(() => {
      expect(sendNotificationExecuteSpy).toHaveBeenCalled()

      const notificationOnDatabase = inMemoryNotificationRepository.items[0]

      expect(notificationOnDatabase).not.toBeNull()
    });
  });
  it.skip('should schedule jobs to check equipment after cooperator exit', async () => {
    const scheduleOnceSpy = vi.spyOn(fakeSchedule, 'scheduleOnce')

    const cooperator = makeCooperator()
    const equipment1 = makeEquipment()
    const equipment2 = makeEquipment()

    await inMemoryEquipmentRepository.create(equipment1)
    await inMemoryEquipmentRepository.create(equipment2)

    const CooperatorEquipment1 = makeCooperatorEquipment({
      cooperatorId: cooperator.id,
      equipmentId: equipment1.id,
    })

    const CooperatorEquipment2 = makeCooperatorEquipment({
      cooperatorId: cooperator.id,
      equipmentId: equipment2.id,
    })

    const inventoryList = new InventoryList([
      CooperatorEquipment1,
      CooperatorEquipment2,
    ])
    cooperator.inventory = inventoryList

    await inMemoryCooperatorRepository.create(cooperator)

    cooperator.departureDate = new Date("2025-04-05")
    await inMemoryCooperatorRepository.save(cooperator)


    await waitFor(() => {
      expect(scheduleOnceSpy).toHaveBeenCalledTimes(4) // Espera que o job de verificação seja agendado 3 


      const notificationOnDatabase = inMemoryNotificationRepository.items[0]


      expect(notificationOnDatabase).not.toBeNull()
    })
  })

})
