import { RegisterInventoryUseCase } from './register-inventory-equipments';
import { InMemoryCooperatorRepository } from 'test/repositories/in-memory-cooperator-repository';
import { InMemoryCooperatorEquipmentRepository } from 'test/repositories/in-memory-cooperator-equipment-repository';
import { InMemoryLoanRecordRepository } from 'test/repositories/in-memory-loan-record-repository';
import { makeCooperator } from 'test/factories/make-cooperator';
import { InventoryList } from '../../enterprise/entities/inventory-list';
import { makeCooperatorEquipment } from 'test/factories/make-cooperator-equipment';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';

let inMemoryCooperatorRepository: InMemoryCooperatorRepository;
let inMemoryCooperatorEquipmentRepository: InMemoryCooperatorEquipmentRepository;
let inMemoryLoanRecordRepository: InMemoryLoanRecordRepository;
let sut: RegisterInventoryUseCase;

describe('Register inventory', () => {
  beforeEach(() => {
    inMemoryCooperatorRepository = new InMemoryCooperatorRepository();
    inMemoryCooperatorEquipmentRepository =
      new InMemoryCooperatorEquipmentRepository();
    inMemoryLoanRecordRepository = new InMemoryLoanRecordRepository();
    sut = new RegisterInventoryUseCase(
      inMemoryCooperatorRepository,
      inMemoryCooperatorEquipmentRepository,
      inMemoryLoanRecordRepository,
    );
  });
  it('should be able Register a inventory and loanRecord', async () => {
    const cooperator = makeCooperator();

    await inMemoryCooperatorRepository.create(cooperator);
    const result = await sut.execute({
      cooperatorId: cooperator.id.toString(),
      equipmentsIds: ['1', '2'],
      managerId: '123456',
    });

    expect(result.isRight()).toBe(true);
    expect(inMemoryLoanRecordRepository.items).toHaveLength(1);
  });

  it('should be able Register a loan record check-in and chek-out with only one execute', async () => {
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

    await inMemoryCooperatorRepository.create(cooperator);

    const result = await sut.execute({
      cooperatorId: cooperator.id.toString(),
      equipmentsIds: ['3', '4'],
      managerId: '123456',
    });

    expect(result.isRight()).toBe(true);
    expect(inMemoryLoanRecordRepository.items).toHaveLength(2);
  });
});
