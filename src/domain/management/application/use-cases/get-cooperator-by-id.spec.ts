import { InMemoryCooperatorRepository } from 'test/repositories/in-memory-cooperator-repository';
import { makeCooperator } from 'test/factories/make-cooperator';
import { GetCooperatorByIdUseCase } from './get-cooperator-by-id';
import { makeCooperatorEquipment } from 'test/factories/make-cooperator-equipment';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { InMemoryCooperatorEquipmentRepository } from 'test/repositories/in-memory-cooperator-equipment-repository';
import { InventoryList } from '../../enterprise/entities/inventory-list';
import { InMemoryEquipmentRepository } from 'test/repositories/in-memory-equipments-repository';
import { InMemoryCallLogRepository } from 'test/repositories/in-memory-call-log-repository';

let inMemoryCooperatorRepository: InMemoryCooperatorRepository;
let inMemoryCooperatorEquipmentRepository: InMemoryCooperatorEquipmentRepository;
let inMemoryEquipmentRepository: InMemoryEquipmentRepository
let inMemoryCallLogRepository: InMemoryCallLogRepository
let sut: GetCooperatorByIdUseCase;

describe('Get Cooperator By Id', () => {
  beforeEach(() => {
    inMemoryEquipmentRepository = new InMemoryEquipmentRepository();
    inMemoryCallLogRepository = new InMemoryCallLogRepository();
    inMemoryCooperatorRepository = new InMemoryCooperatorRepository(inMemoryCallLogRepository, inMemoryEquipmentRepository);
    inMemoryCooperatorEquipmentRepository =
      new InMemoryCooperatorEquipmentRepository();
    sut = new GetCooperatorByIdUseCase(inMemoryCooperatorRepository);
  });
  it('should be able to get a cooperator by id', async () => {
    const equipment = makeCooperatorEquipment({
      cooperatorId: new UniqueEntityId('test'),
      equipmentId: new UniqueEntityId('1'),
    });
    const equipment2 = makeCooperatorEquipment({
      cooperatorId: new UniqueEntityId('test'),
      equipmentId: new UniqueEntityId('2'),
    });

    await inMemoryCooperatorEquipmentRepository.createMany([
      equipment,
      equipment2,
    ]);

    const cooperator = makeCooperator(
      {
        inventory: new InventoryList([equipment, equipment2]),
      },
      new UniqueEntityId('test'),
    );

    inMemoryCooperatorRepository.items.push(cooperator);

    const result = await sut.execute({
      cooperatorId: cooperator.id.toString(),
    });

    expect(result.isRight()).toEqual(true);
  });
});
