import { InMemoryLoanRecordRepository } from 'test/repositories/in-memory-loan-record-repository';
import { InMemoryCooperatorRepository } from 'test/repositories/in-memory-cooperator-repository';
import { makeCooperator } from 'test/factories/make-cooperator';
import { makeLoanRecord } from 'test/factories/make-loan-record';
import { FetchLoanRecordByCooperatorIdUseCase } from './fetch-loan-record-by-cooperator-id';

let inMemoryLoanRecordRepository: InMemoryLoanRecordRepository;
let inMemoryCooperatorRepository: InMemoryCooperatorRepository;
let sut: FetchLoanRecordByCooperatorIdUseCase;

describe('Fetch Loan Records by Cooperator Id', () => {
  beforeEach(() => {
    inMemoryLoanRecordRepository = new InMemoryLoanRecordRepository();
    inMemoryCooperatorRepository = new InMemoryCooperatorRepository();
    sut = new FetchLoanRecordByCooperatorIdUseCase(inMemoryLoanRecordRepository);
  });
  it('should be able to fetch recent loan Records', async () => {
    const cooperator = makeCooperator();

    await inMemoryCooperatorRepository.items.push(cooperator);

    await inMemoryLoanRecordRepository.create(
      makeLoanRecord({
        cooperatorId: cooperator.id,
      }),
    );

    await inMemoryLoanRecordRepository.create(
      makeLoanRecord({
        cooperatorId: cooperator.id,
      }),
    );

    await inMemoryLoanRecordRepository.create(
      makeLoanRecord({
        cooperatorId: cooperator.id,
      }),
    );

    const result = await sut.execute({
      cooperatorId: cooperator.id.toString(),
      page: 1,
    });

    expect(result.value?.loanRecords).toHaveLength(3);
  });
});
