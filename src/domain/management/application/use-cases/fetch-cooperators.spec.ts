import { makeCooperator } from 'test/factories/make-cooperator';
import { FetchCooperatorUseCase } from './fetch-cooperators';
import { InMemoryCooperatorRepository } from 'test/repositories/in-memory-cooperator-repository';

let inMemoryCooperatorRepository: InMemoryCooperatorRepository;
let sut: FetchCooperatorUseCase;

describe('Fetch Cooperators', () => {
  beforeEach(() => {
    inMemoryCooperatorRepository = new InMemoryCooperatorRepository();
    sut = new FetchCooperatorUseCase(inMemoryCooperatorRepository);
  });
  it('should be able to fetch recent cooperators', async () => {
    for (let i = 1; i <= 22; i++) {
      await inMemoryCooperatorRepository.create(
        makeCooperator({ createdAt: new Date(2024, 11, i) }),
      );
    }

    const result = await sut.execute({
      page: 2,
    });

    expect(result.isRight()).toBeTruthy();
    expect(result.value?.data).toHaveLength(2);
    expect(result.value?.data).toEqual([
      expect.objectContaining({ createdAt: new Date(2024, 11, 2) }),
      expect.objectContaining({ createdAt: new Date(2024, 11, 1) }),
    ]);
  });

  it('should be able to fetch recent cooperators with search param', async () => {
    for (let i = 1; i <= 22; i++) {
      await inMemoryCooperatorRepository.create(
        makeCooperator({ createdAt: new Date(2024, 11, i) }),
      );
    }

    await inMemoryCooperatorRepository.create(
      makeCooperator({ createdAt: new Date(2024, 11, 22), userName: 'JOED' }),
    );

    const result = await sut.execute({
      page: 1,
      search: 'JOED',
    });

    expect(result.isRight()).toBeTruthy();
    expect(result.value?.data).toHaveLength(1);
    expect(result.value?.data).toEqual([
      expect.objectContaining({ userName: 'JOED' }),
    ]);
  });
});
