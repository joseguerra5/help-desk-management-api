import { CountLoanCheckInUseCase } from './count-loan-checkin';
import { InMemoryLoanRecordRepository } from 'test/repositories/in-memory-loan-record-repository';
import { makeLoanRecord } from 'test/factories/make-loan-record';

let inMemoryLoanRecordRepository: InMemoryLoanRecordRepository;
let sut: CountLoanCheckInUseCase;

describe('Get Loan Check in count', () => {
  beforeEach(() => {
    inMemoryLoanRecordRepository = new InMemoryLoanRecordRepository();
    sut = new CountLoanCheckInUseCase(inMemoryLoanRecordRepository);

    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should be able to get vailable products count for the last 30 days', async () => {
    vi.setSystemTime(new Date(2025, 0, 25, 0, 0, 0));

    await inMemoryLoanRecordRepository.create(
      makeLoanRecord({ ocurredAt: new Date(2024, 11, 22), type: 'CHECK_IN' }),
    );

    for (let i = 1; i <= 22; i++) {
      await inMemoryLoanRecordRepository.create(
        makeLoanRecord({ ocurredAt: new Date(2025, 0, i), type: 'CHECK_IN' }),
      );
    }

    for (let i = 1; i <= 22; i++) {
      await inMemoryLoanRecordRepository.create(
        makeLoanRecord({ ocurredAt: new Date(2025, 0, i), type: 'CHECK_OUT' }),
      );
    }

    const result = await sut.execute();

    expect(result.isRight()).toBeTruthy();
    expect(result.value).toEqual({
      currentMonthAmount: 22,
      previousMonthAmount: 1,
    });
  });
});
