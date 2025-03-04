import { InMemoryEquipmentRepository } from 'test/repositories/in-memory-equipments-repository';
import { FetchEquipmentsUseCase } from './fetch-equipments';
import { makeEquipment } from 'test/factories/make-equipment';

let inMemoryEquipmentRepository: InMemoryEquipmentRepository;
let sut: FetchEquipmentsUseCase;

describe('Fetch Equipments with search params', () => {
  beforeEach(() => {
    inMemoryEquipmentRepository = new InMemoryEquipmentRepository();
    sut = new FetchEquipmentsUseCase(inMemoryEquipmentRepository);
  });
  it('should be able to fetch equipments', async () => {
    for (let i = 1; i <= 22; i++) {
      await inMemoryEquipmentRepository.create(
        makeEquipment({
          serialNumber: `Equipment-${i}`,
          createdAt: new Date(`${i}-2-2025`)
        }),
      );
    }


    const result = await sut.execute({
      page: 1,
    });

    expect(result.value?.equipments).toHaveLength(20);
  });
  it('should be able to fetch with search params', async () => {
    for (let i = 1; i <= 22; i++) {
      await inMemoryEquipmentRepository.create(
        makeEquipment({
          serialNumber: `Equipment-${i}`,
          createdAt: new Date(`${i}-2-2025`),
          brokenAt: new Date(`${i}-2-2025`),
        }),
      );
    }


    const result = await sut.execute({
      page: 1,
      status: "broken",
    });

    expect(result.value?.equipments).toHaveLength(20);
  });

});
