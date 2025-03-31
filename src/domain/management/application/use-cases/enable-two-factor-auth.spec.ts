import { InMemoryManagerRepository } from 'test/repositories/in-memory-manager-repository';
import { FakeHasher } from 'test/cryptography/fake-hasher';
import { makeManager } from 'test/factories/make-manager';
import { EnableTwoFactorAuthUseCase } from './enable-two-factor-auth';
import { FakeSecretValidator } from 'test/auth/fake-secret-validator';
import { TwoFactorAuthInvalidError } from './errors/two-factor-invalid-error';

let inMemoryManagerRepository: InMemoryManagerRepository;
let fake2faValidator: FakeSecretValidator;
let fakeHasher: FakeHasher;
let sut: EnableTwoFactorAuthUseCase;

describe('Enable 2FA to manager', () => {
  beforeEach(() => {
    inMemoryManagerRepository = new InMemoryManagerRepository()
    fake2faValidator = new FakeSecretValidator()
    fakeHasher = new FakeHasher()
    sut = new EnableTwoFactorAuthUseCase(
      inMemoryManagerRepository,
      fake2faValidator,
    );
  });
  it('should be able enable 2FA to a manager', async () => {
    const manager = makeManager({
      email: 'jhondoe@example.com',
      password: await fakeHasher.hash('123456'),
      isTwoFactorAuthenticationEnabled: false
    });

    inMemoryManagerRepository.items.push(manager);

    const result = await sut.execute({
      managerId: manager.id.toString(),
      code: "test"
    });

    expect(result.isRight()).toBe(true);
    expect(result.value).toEqual({
      success: true
    });
  });

  it('should not be able enable 2FA to a manager with wrong code', async () => {
    const manager = makeManager({
      email: 'jhondoe@example.com',
      password: await fakeHasher.hash('123456'),
      isTwoFactorAuthenticationEnabled: false
    });

    inMemoryManagerRepository.items.push(manager);

    const result = await sut.execute({
      managerId: manager.id.toString(),
      code: "wrong-code"
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(TwoFactorAuthInvalidError)
  });
});
