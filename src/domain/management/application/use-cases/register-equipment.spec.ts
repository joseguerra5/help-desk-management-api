import { RegisterEquipmentUseCase } from './register-equipment';
import { makeEquipment } from 'test/factories/make-equipment';
import { AlreadyExistsError } from './errors/already-exist-error';
import { InMemoryEquipmentRepository } from 'test/repositories/in-memory-equipments-repository';
import { InMemoryManagerRepository } from 'test/repositories/in-memory-manager-repository';
import { makeManager } from 'test/factories/make-manager';

let inMemoryEquipmentRepository: InMemoryEquipmentRepository;
let inMemoryManagerRepository: InMemoryManagerRepository;
let sut: RegisterEquipmentUseCase;

describe('Register Equipments', () => {
  beforeEach(() => {
    inMemoryEquipmentRepository = new InMemoryEquipmentRepository();
    inMemoryManagerRepository = new InMemoryManagerRepository();
    sut = new RegisterEquipmentUseCase(inMemoryEquipmentRepository, inMemoryManagerRepository);
  });
  it('should be able Register a equipment', async () => {
    const manager = makeManager()

    await inMemoryManagerRepository.create(manager);
    const result = await sut.execute({
      name: 'test',
      serialNumber: 'test-2',
      type: 'COMPUTER',
      madeBy: manager.id.toString(),
    });

    expect(result.isRight()).toBe(true);
    expect(result.value).toEqual({
      equipment: inMemoryEquipmentRepository.items[0],
    });
  });

  it('should not be able Register a equipment with same serian number', async () => {
    const equipment = makeEquipment({
      serialNumber: 'test',
    });

    const manager = makeManager()

    await inMemoryManagerRepository.create(manager);

    await inMemoryEquipmentRepository.create(equipment);

    const result = await sut.execute({
      name: 'test',
      serialNumber: 'test',
      type: 'COMPUTER',
      madeBy: manager.id.toString(),
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(AlreadyExistsError);
  });
});
