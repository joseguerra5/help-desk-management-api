import { InMemoryLoanRecordRepository } from 'test/repositories/in-memory-loan-record-repository';
import { makeLoanRecord } from 'test/factories/make-loan-record';
import { InMemoryCooperatorRepository } from 'test/repositories/in-memory-cooperator-repository';
import { InMemoryEquipmentRepository } from 'test/repositories/in-memory-equipments-repository';
import { InMemoryManagerRepository } from 'test/repositories/in-memory-manager-repository';
import { InMemoryCallLogRepository } from 'test/repositories/in-memory-call-log-repository';
import { LoanStaticPerMonthUseCase } from './loan-static-per-month';

let inMemoryLoanRecordRepository: InMemoryLoanRecordRepository;
let inMemoryCooperatorRepository: InMemoryCooperatorRepository;
let inMemoryEquipmentRepository: InMemoryEquipmentRepository
let inMemoryManagerRepository: InMemoryManagerRepository
let inMemoryCallLogsRepository: InMemoryCallLogRepository
let sut: LoanStaticPerMonthUseCase;

describe('Get Loan static', () => {
  beforeEach(() => {
    inMemoryManagerRepository = new InMemoryManagerRepository();
    inMemoryCallLogsRepository = new InMemoryCallLogRepository();
    inMemoryEquipmentRepository = new InMemoryEquipmentRepository();
    inMemoryCooperatorRepository = new InMemoryCooperatorRepository(inMemoryCallLogsRepository, inMemoryEquipmentRepository);
    inMemoryLoanRecordRepository = new InMemoryLoanRecordRepository(inMemoryCooperatorRepository, inMemoryManagerRepository);
    sut = new LoanStaticPerMonthUseCase(inMemoryLoanRecordRepository);

    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should be able to get loan record static', async () => {
    vi.setSystemTime(new Date(2025, 0, 25, 0, 0, 0));

    await inMemoryLoanRecordRepository.create(
      makeLoanRecord({ ocurredAt: new Date(2024, 11, 22), type: 'CHECK_IN' }),
    );

    for (let i = 1; i <= 22; i++) {
      await inMemoryLoanRecordRepository.create(
        makeLoanRecord({ ocurredAt: new Date(2025, 0, i), type: 'CHECK_IN' }),
      );
    }


    await inMemoryLoanRecordRepository.create(
      makeLoanRecord({ ocurredAt: new Date(2024, 11, 22), type: 'CHECK_OUT' }),
    );

    await inMemoryLoanRecordRepository.create(
      makeLoanRecord({ ocurredAt: new Date(2024, 11, 23), type: 'CHECK_OUT' }),
    );

    for (let i = 1; i <= 22; i++) {
      await inMemoryLoanRecordRepository.create(
        makeLoanRecord({ ocurredAt: new Date(2025, 0, i), type: 'CHECK_OUT' }),
      );
    }

    const result = await sut.execute();

    expect(result.isRight()).toBeTruthy();
  });

});
