import { CountLoanCheckoutUseCase } from './count-loan-checkout';
import { InMemoryLoanRecordRepository } from 'test/repositories/in-memory-loan-record-repository';
import { makeLoanRecord } from 'test/factories/make-loan-record';
import { InMemoryEquipmentRepository } from 'test/repositories/in-memory-equipments-repository';
import { InMemoryManagerRepository } from 'test/repositories/in-memory-manager-repository';
import { InMemoryCallLogRepository } from 'test/repositories/in-memory-call-log-repository';
import { InMemoryCooperatorRepository } from 'test/repositories/in-memory-cooperator-repository';

let inMemoryLoanRecordRepository: InMemoryLoanRecordRepository;
let inMemoryCooperatorRepository: InMemoryCooperatorRepository;
let inMemoryEquipmentRepository: InMemoryEquipmentRepository
let inMemoryManagerRepository: InMemoryManagerRepository
let inMemoryCallLogsRepository: InMemoryCallLogRepository
let sut: CountLoanCheckoutUseCase;

describe('Get Loan Check out count', () => {
  beforeEach(() => {
    inMemoryCallLogsRepository = new InMemoryCallLogRepository();
    inMemoryEquipmentRepository = new InMemoryEquipmentRepository();
    inMemoryManagerRepository = new InMemoryManagerRepository();
    inMemoryCooperatorRepository = new InMemoryCooperatorRepository(inMemoryCallLogsRepository, inMemoryEquipmentRepository);
    inMemoryLoanRecordRepository = new InMemoryLoanRecordRepository(inMemoryCooperatorRepository, inMemoryManagerRepository);
    sut = new CountLoanCheckoutUseCase(inMemoryLoanRecordRepository);

    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should be able to get vailable products count for the last 30 days', async () => {
    vi.setSystemTime(new Date(2025, 0, 25, 0, 0, 0));

    for (let i = 1; i <= 22; i++) {
      await inMemoryLoanRecordRepository.create(
        makeLoanRecord({ ocurredAt: new Date(2025, 0, i), type: 'CHECK_OUT' }),
      );
    }

    const result = await sut.execute();

    expect(result.isRight()).toBeTruthy();
    expect(result.value).toEqual({
      currentMonthAmount: 22,
      previousMonthAmount: 0,
    });
  });
});
