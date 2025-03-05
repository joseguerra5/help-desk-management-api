import { makeEquipment } from 'test/factories/make-equipment';
import { InMemoryEquipmentRepository } from 'test/repositories/in-memory-equipments-repository';
import { RegisterEquipmentDamageUseCase } from './register-equipment-damage';

let inMemoryEquipmentRepository: InMemoryEquipmentRepository;
let sut: RegisterEquipmentDamageUseCase;

describe('Register Equipment Damage', () => {
  beforeEach(() => {
    inMemoryEquipmentRepository = new InMemoryEquipmentRepository();
    sut = new RegisterEquipmentDamageUseCase(inMemoryEquipmentRepository);
  });
  it('should be able Register a equipment damage', async () => {
    const equipment = makeEquipment({
      serialNumber: 'test',
    });

    await inMemoryEquipmentRepository.create(equipment);

    const result = await sut.execute({
      brokenAt: new Date(),
      equipmentId: equipment.id.toString(),
      reason: 'teste',
    });

    expect(result.isRight()).toBe(true);
    expect(result.value).toEqual({
      equipment: inMemoryEquipmentRepository.items[0],
    });
    expect(inMemoryEquipmentRepository.items[0].brokenReason).toEqual('teste');
  });
});
