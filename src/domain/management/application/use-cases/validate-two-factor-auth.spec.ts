import { InMemoryManagerRepository } from 'test/repositories/in-memory-manager-repository';
import { FakeHasher } from 'test/cryptography/fake-hasher';
import { makeManager } from 'test/factories/make-manager';
import { FakeEncrypter } from 'test/cryptography/fake-encrypter';
import { ValidateTwoFactorAuthUseCase } from './validate-two-factor-auth';
import { FakeSecretValidator } from 'test/auth/fake-secret-validator';
import { TwoFactorAuthInvalidError } from './errors/two-factor-invalid-error';

let inMemoryManagerRepository: InMemoryManagerRepository;
let fakeHasher: FakeHasher;
let fake2faValidator: FakeSecretValidator;
let fakeEncrypter: FakeEncrypter;
let sut: ValidateTwoFactorAuthUseCase;

describe('Authenticate manager', () => {
  beforeEach(() => {
    inMemoryManagerRepository = new InMemoryManagerRepository()
    fakeHasher = new FakeHasher()
    fake2faValidator = new FakeSecretValidator()
    fakeEncrypter = new FakeEncrypter()
    sut = new ValidateTwoFactorAuthUseCase(
      inMemoryManagerRepository,
      fake2faValidator,
      fakeEncrypter,
    );
  });
  it('should be able authenticate a manager 2FA', async () => {
    const manager = makeManager({
      email: 'jhondoe@example.com',
      password: await fakeHasher.hash('123456'),
    });

    inMemoryManagerRepository.items.push(manager);

    const result = await sut.execute({
      code: "test",
      managerId: manager.id.toString()
    });

    expect(result.isRight()).toBe(true);
    expect(result.value).toEqual({
      accessToken: expect.any(String),
    });
  });

  it('not should be able authenticate a manager 2FA with wrong code', async () => {
    const manager = makeManager({
      email: 'jhondoe@example.com',
      password: await fakeHasher.hash('123456'),
    });

    inMemoryManagerRepository.items.push(manager);

    const result = await sut.execute({
      code: "wrong-code",
      managerId: manager.id.toString()
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(TwoFactorAuthInvalidError)
  });
});
