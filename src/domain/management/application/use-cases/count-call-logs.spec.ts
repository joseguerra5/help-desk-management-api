import { InMemoryCallLogRepository } from "test/repositories/in-memory-call-log-repository";
import { makeCallLog } from "test/factories/make-call-log";
import { InMemoryCooperatorRepository } from "test/repositories/in-memory-cooperator-repository";
import { makeCooperator } from "test/factories/make-cooperator";
import { CountCallLogsUseCase } from "./count-call-logs";
import { InMemoryEquipmentRepository } from "test/repositories/in-memory-equipments-repository";

let inMemoryCallLogsRepository: InMemoryCallLogRepository;
let inMemoryCooperatorRepository: InMemoryCooperatorRepository;
let inMemoryEquipmentRepository: InMemoryEquipmentRepository;
let sut: CountCallLogsUseCase;

describe('Count CallLog current month and previous month', () => {
  beforeEach(() => {
    inMemoryCallLogsRepository = new InMemoryCallLogRepository();
    inMemoryEquipmentRepository = new InMemoryEquipmentRepository();
    inMemoryCooperatorRepository = new InMemoryCooperatorRepository(inMemoryCallLogsRepository, inMemoryEquipmentRepository);
    sut = new CountCallLogsUseCase(inMemoryCallLogsRepository);
  });
  it('should be able to fetch recent call logs by fetchcalllogs id', async () => {
    const cooperator = makeCooperator()

    await inMemoryCooperatorRepository.create(cooperator)

    await inMemoryCallLogsRepository.create(makeCallLog({ cooperatorId: cooperator.id }))
    await inMemoryCallLogsRepository.create(makeCallLog({ cooperatorId: cooperator.id }))
    await inMemoryCallLogsRepository.create(makeCallLog({ cooperatorId: cooperator.id }))


    const result = await sut.execute();

    expect(result.isRight()).toBeTruthy();

    if (result.isRight()) {
      expect(result.value.currentMonthAmount).toEqual(3);
    }
  });
});
