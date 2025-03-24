import { InMemoryCooperatorRepository } from 'test/repositories/in-memory-cooperator-repository';
import { RegisterCooperatorUseCase } from './register-cooperator';
import { makeCooperator } from 'test/factories/make-cooperator';
import { AlreadyExistsError } from './errors/already-exist-error';
import { InMemoryManagerRepository } from 'test/repositories/in-memory-manager-repository';
import { makeManager } from 'test/factories/make-manager';
import { InMemoryEquipmentRepository } from 'test/repositories/in-memory-equipments-repository';
import { InMemoryCallLogRepository } from 'test/repositories/in-memory-call-log-repository';

let inMemoryCooperatorRepository: InMemoryCooperatorRepository;
let inMemoryEquipmentRepository: InMemoryEquipmentRepository
let inMemoryCallLogsRepository: InMemoryCallLogRepository
let inMemoryManagerRepository: InMemoryManagerRepository;
let sut: RegisterCooperatorUseCase;

describe('Register Cooperator', () => {
  beforeEach(() => {
    inMemoryCallLogsRepository = new InMemoryCallLogRepository();
    inMemoryEquipmentRepository = new InMemoryEquipmentRepository();
    inMemoryCooperatorRepository = new InMemoryCooperatorRepository(inMemoryCallLogsRepository, inMemoryEquipmentRepository);
    inMemoryManagerRepository = new InMemoryManagerRepository();
    sut = new RegisterCooperatorUseCase(inMemoryCooperatorRepository, inMemoryManagerRepository);
  });
  it('should be able Register a cooperator', async () => {

    const manager = makeManager()

    await inMemoryManagerRepository.create(manager)

    const result = await sut.execute({
      email: 'jhondoe@example.com',
      employeeId: '1234',
      name: 'Jhon Doe',
      userName: 'DOEJ',
      phone: '123456789',
      equipmentIds: ['1', '2'],
      madeBy: manager.id.toString(),
    });

    expect(result.isRight()).toBe(true);
    expect(result.value).toEqual({
      cooperator: inMemoryCooperatorRepository.items[0],
    });
  });

  it('should not be able Register a cooperator with same employee Id', async () => {
    const cooperator = makeCooperator({
      employeeId: '1234',
    });

    await inMemoryCooperatorRepository.create(cooperator);

    const manager = makeManager()

    await inMemoryManagerRepository.create(manager);

    const result = await sut.execute({
      email: 'jhondoe@example.com',
      employeeId: '1234',
      name: 'Jhon Doe',
      userName: 'DOEJ',
      phone: '123456789',
      equipmentIds: ['1', '2'],
      madeBy: manager.id.toString(),
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(AlreadyExistsError);
  });
});
