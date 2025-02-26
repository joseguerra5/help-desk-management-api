import { InMemoryManagerRepository } from 'test/repositories/in-memory-manager-repository';
import { RegisterManagerUseCase } from './register-manager';
import { FakeHasher } from 'test/cryptography/fake-hasher';
import { makeManager } from 'test/factories/make-manager';
import { AlreadyExistsError } from './errors/already-exist-error';

let inMemoryManagerRepository: InMemoryManagerRepository;
let fakeHasher: FakeHasher;
let sut: RegisterManagerUseCase;

describe('Register Manager', () => {
  beforeEach(() => {
    inMemoryManagerRepository = new InMemoryManagerRepository();
    fakeHasher = new FakeHasher();
    sut = new RegisterManagerUseCase(inMemoryManagerRepository, fakeHasher);
  });
  it('should be able Register a manager', async () => {
    const result = await sut.execute({
      email: 'jhondoe@example.com',
      employeeId: '1234',
      name: 'Jhon Doe',
      password: '123456',
      passwordConfirmation: '123456',
      userName: 'DOEJ',
    });

    expect(result.isRight()).toBe(true);
    expect(result.value).toEqual({
      manager: inMemoryManagerRepository.items[0],
    });
  });

  it('should not be able Register a manager with same email', async () => {
    const manager = makeManager({
      email: 'jhondoe@example.com',
    });

    await inMemoryManagerRepository.create(manager);

    const result = await sut.execute({
      email: 'jhondoe@example.com',
      employeeId: '1234',
      name: 'Jhon Doe',
      password: '123456',
      passwordConfirmation: '123456',
      userName: 'DOEJ',
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(AlreadyExistsError);
    expect(inMemoryManagerRepository.items).toHaveLength(1);
  });

  it('should not be able Register a manager with same employee Id', async () => {
    const manager = makeManager({
      employeeId: '1234',
    });

    await inMemoryManagerRepository.create(manager);

    const result = await sut.execute({
      email: 'jhondoe@example.com',
      employeeId: '1234',
      name: 'Jhon Doe',
      password: '123456',
      passwordConfirmation: '123456',
      userName: 'DOEJ',
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(AlreadyExistsError);
    expect(inMemoryManagerRepository.items).toHaveLength(1);
  });
});
