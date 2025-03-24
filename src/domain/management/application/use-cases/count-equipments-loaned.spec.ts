import { InMemoryCooperatorRepository } from 'test/repositories/in-memory-cooperator-repository';
import { InMemoryCooperatorEquipmentRepository } from 'test/repositories/in-memory-cooperator-equipment-repository';
import { makeCooperator } from 'test/factories/make-cooperator';
import { InventoryList } from '../../enterprise/entities/inventory-list';
import { makeCooperatorEquipment } from 'test/factories/make-cooperator-equipment';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { InMemoryEquipmentRepository } from 'test/repositories/in-memory-equipments-repository';
import { InMemoryCallLogRepository } from 'test/repositories/in-memory-call-log-repository';
import { CountEquipmentsAvailableAndLoanedUseCase } from './count-equipments-loaned';
import { makeEquipment } from 'test/factories/make-equipment';

let inMemoryCooperatorRepository: InMemoryCooperatorRepository;
let inMemoryCooperatorEquipmentRepository: InMemoryCooperatorEquipmentRepository;
let inMemoryEquipmentRepository: InMemoryEquipmentRepository
let inMemoryCallLogsRepository: InMemoryCallLogRepository
let sut: CountEquipmentsAvailableAndLoanedUseCase;

describe('Register inventory', () => {
  beforeEach(() => {
    inMemoryCallLogsRepository = new InMemoryCallLogRepository();
    inMemoryCooperatorEquipmentRepository = new InMemoryCooperatorEquipmentRepository();
    inMemoryEquipmentRepository = new InMemoryEquipmentRepository();
    inMemoryCooperatorEquipmentRepository = new InMemoryCooperatorEquipmentRepository();
    inMemoryCooperatorRepository = new InMemoryCooperatorRepository(inMemoryCallLogsRepository, inMemoryEquipmentRepository);
    sut = new CountEquipmentsAvailableAndLoanedUseCase(inMemoryEquipmentRepository, inMemoryCooperatorEquipmentRepository);
  });
  it('should be able get a count equipments loaned and available', async () => {


    const equipment = makeEquipment()

    //await inMemoryCooperatorRepository.create(cooperator)
    await inMemoryEquipmentRepository.create(equipment);

    await inMemoryEquipmentRepository.create(makeEquipment());

    const cooperatorEquipment = makeCooperatorEquipment({
      cooperatorId: new UniqueEntityId("test"),
      equipmentId: equipment.id,
    });

    await inMemoryCooperatorEquipmentRepository.createMany([
      cooperatorEquipment,
    ]);

    const cooperator = makeCooperator(
      {
        inventory: new InventoryList([cooperatorEquipment]),
      },
      new UniqueEntityId('test'),
    );

    await inMemoryCooperatorRepository.create(cooperator);

    const result = await sut.execute();

    expect(result.isRight()).toBe(true);
    if (result.isRight()) {
      expect(result.value.currentLoanedAmount).toEqual(1);
      expect(result.value.totalAmount).toEqual(2);
    }

  });
});
