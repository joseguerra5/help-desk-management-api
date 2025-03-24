import { InMemoryCooperatorRepository } from 'test/repositories/in-memory-cooperator-repository';
import { makeCooperator } from 'test/factories/make-cooperator';
import { RegisterDepartureDateUseCase } from './register-departure-date';
import { InMemoryEquipmentRepository } from 'test/repositories/in-memory-equipments-repository';
import { InMemoryCallLogRepository } from 'test/repositories/in-memory-call-log-repository';

let inMemoryCooperatorRepository: InMemoryCooperatorRepository;
let inMemoryEquipmentRepository: InMemoryEquipmentRepository
let inMemoryCallLogsRepository: InMemoryCallLogRepository
let sut: RegisterDepartureDateUseCase;

describe('Register Departure Date to Cooperator', () => {
  beforeEach(() => {
    inMemoryCallLogsRepository = new InMemoryCallLogRepository();
    inMemoryEquipmentRepository = new InMemoryEquipmentRepository();
    inMemoryCooperatorRepository = new InMemoryCooperatorRepository(inMemoryCallLogsRepository, inMemoryEquipmentRepository);
    sut = new RegisterDepartureDateUseCase(inMemoryCooperatorRepository);
  });
  it('should be able Register Departure Date to Cooperator', async () => {
    const cooperator = makeCooperator();

    await inMemoryCooperatorRepository.create(cooperator);

    const result = await sut.execute({
      cooperatorId: cooperator.id.toString(),
      departureDate: new Date(22, 3, 2022),
    });

    expect(result.isRight()).toBe(true);
    expect(inMemoryCooperatorRepository.items[0].departureDate).toEqual(
      new Date(22, 3, 2022),
    );
  });
});
