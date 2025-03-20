import { InMemoryLoanRecordRepository } from "test/repositories/in-memory-loan-record-repository";
import { makeLoanRecord } from "test/factories/make-loan-record";
import { GetLoanRecordByIdUseCase } from "./get-loan-record-by-id";
import { InMemoryManagerRepository } from "test/repositories/in-memory-manager-repository";
import { InMemoryCooperatorRepository } from "test/repositories/in-memory-cooperator-repository";
import { InMemoryEquipmentRepository } from "test/repositories/in-memory-equipments-repository";
import { InMemoryCallLogRepository } from "test/repositories/in-memory-call-log-repository";
import { makeCooperator } from "test/factories/make-cooperator";
import { makeManager } from "test/factories/make-manager";

let inMemoryLoanRecordRepository: InMemoryLoanRecordRepository;
let inMemoryManagerRepository: InMemoryManagerRepository;
let inMemoryCooperatorRepository: InMemoryCooperatorRepository;
let inMemoryEquipmentRepository: InMemoryEquipmentRepository;
let inMemoryCallLogRepository: InMemoryCallLogRepository;
let sut: GetLoanRecordByIdUseCase;

describe('Get loan record By Id', () => {
  beforeEach(() => {
    inMemoryManagerRepository = new InMemoryManagerRepository();
    inMemoryEquipmentRepository = new InMemoryEquipmentRepository();
    inMemoryCallLogRepository = new InMemoryCallLogRepository();
    inMemoryCooperatorRepository = new InMemoryCooperatorRepository(inMemoryCallLogRepository, inMemoryEquipmentRepository);
    inMemoryLoanRecordRepository = new InMemoryLoanRecordRepository(inMemoryCooperatorRepository, inMemoryManagerRepository);
    sut = new GetLoanRecordByIdUseCase(inMemoryLoanRecordRepository);
  });
  it('should be able to get a loan record by id', async () => {
    const manager = makeManager();

    await inMemoryManagerRepository.create(manager);

    const cooperator = makeCooperator();

    await inMemoryCooperatorRepository.create(cooperator);

    const loanRecord = makeLoanRecord({
      cooperatorId: cooperator.id,
      madeBy: manager.id,
    });

    await inMemoryLoanRecordRepository.create(loanRecord);


    const result = await sut.execute({
      loanRecordId: loanRecord.id.toString(),
    });


    expect(result.isRight()).toEqual(true);
  });
});
