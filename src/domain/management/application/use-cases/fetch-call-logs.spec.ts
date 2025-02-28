import { InMemoryCallLogRepository } from "test/repositories/in-memory-call-log-repository";
import { FetchCallLogsUseCase } from "./fetch-call-logs";
import { makeCallLog } from "test/factories/make-call-log";
import { InMemoryCooperatorRepository } from "test/repositories/in-memory-cooperator-repository";
import { makeCooperator } from "test/factories/make-cooperator";

let inMemoryCallLogsRepository: InMemoryCallLogRepository;
let inMemoryCooperatorRepository: InMemoryCooperatorRepository;
let sut: FetchCallLogsUseCase;

describe('Fetch CallLog by fetchcalllogs Id', () => {
  beforeEach(() => {
    inMemoryCallLogsRepository = new InMemoryCallLogRepository();
    inMemoryCooperatorRepository = new InMemoryCooperatorRepository();
    sut = new FetchCallLogsUseCase(inMemoryCallLogsRepository);
  });
  it('should be able to fetch recent call logs by fetchcalllogs id', async () => {
    const cooperator = makeCooperator()

    await inMemoryCooperatorRepository.create(cooperator)

    await inMemoryCallLogsRepository.create(makeCallLog({ cooperatorId: cooperator.id }))
    await inMemoryCallLogsRepository.create(makeCallLog({ cooperatorId: cooperator.id }))
    await inMemoryCallLogsRepository.create(makeCallLog({ cooperatorId: cooperator.id }))

    const result = await sut.execute({
      cooperatorId: cooperator.id.toString()
    });

    expect(result.isRight()).toBeTruthy();
    expect(result.value?.callLogs).toHaveLength(3);
  });
});
