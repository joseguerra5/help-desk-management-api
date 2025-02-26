import { InMemoryCooperatorRepository } from 'test/repositories/in-memory-cooperator-repository';
import { makeCooperator } from 'test/factories/make-cooperator';
import { CreateCallLogUseCase } from './create-call-log';
import { InMemoryCallLogRepository } from 'test/repositories/in-memory-call-log-repository';
import { ResourceNotFoundError } from './errors/resource-not-found-error';

let inMemoryCooperatorRepository: InMemoryCooperatorRepository;
let inMemoryCallLogRepository: InMemoryCallLogRepository;
let sut: CreateCallLogUseCase;

describe('Create Call Log', () => {
  beforeEach(() => {
    inMemoryCooperatorRepository = new InMemoryCooperatorRepository();
    inMemoryCallLogRepository = new InMemoryCallLogRepository();
    sut = new CreateCallLogUseCase(
      inMemoryCooperatorRepository,
      inMemoryCallLogRepository,
    );
  });
  it('should be able to Create a Call Log', async () => {
    const cooperator = makeCooperator();

    await inMemoryCooperatorRepository.create(cooperator);

    const result = await sut.execute({
      cooperatorId: cooperator.id.toString(),
      description: 'teste',
      madeBy: '123456',
      type: 'CITRIX_ISSUE',
    });

    expect(result.isRight()).toBe(true);
    expect(result.value).toEqual({
      callLog: inMemoryCallLogRepository.items[0],
    });
  });

  it('should not be able create a call log with inexistent cooperator', async () => {
    const result = await sut.execute({
      cooperatorId: 'inexistent-cooperator',
      description: 'teste',
      madeBy: '123456',
      type: 'CITRIX_ISSUE',
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(ResourceNotFoundError);
  });
});
