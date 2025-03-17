import { GetManagerProfileUseCase } from './get-manager-profile';
import { InMemoryManagerRepository } from 'test/repositories/in-memory-manager-repository';
import { makeManager } from 'test/factories/make-manager';

let inMemoryManagerRepository: InMemoryManagerRepository;
let sut: GetManagerProfileUseCase;

describe('Get Cooperator By Id', () => {
  beforeEach(() => {
    inMemoryManagerRepository = new InMemoryManagerRepository();
    sut = new GetManagerProfileUseCase(inMemoryManagerRepository);
  });
  it('should be able to get a cooperator by id', async () => {
    const manager = makeManager();

    await inMemoryManagerRepository.create(manager);


    const result = await sut.execute({
      managerId: manager.id.toString(),
    });

    expect(result.isRight()).toEqual(true);
    expect(result.value).toEqual({ manager });
  });
});
