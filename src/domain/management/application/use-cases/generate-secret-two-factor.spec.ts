import { InMemoryManagerRepository } from 'test/repositories/in-memory-manager-repository';
import { FakeHasher } from 'test/cryptography/fake-hasher';
import { makeManager } from 'test/factories/make-manager';
import { GenerateSecretToTwoFactorAuthUseCase } from './generate-secret-two-factor';
import { FakeSecretGenerator } from 'test/auth/fake-secret-generator';

let inMemoryManagerRepository: InMemoryManagerRepository;
let fakeHasher: FakeHasher;
let fakeSecretGenerator: FakeSecretGenerator;
let sut: GenerateSecretToTwoFactorAuthUseCase;

describe('Authenticate manager', () => {
  beforeEach(() => {
    inMemoryManagerRepository = new InMemoryManagerRepository()
    fakeHasher = new FakeHasher()
    fakeSecretGenerator = new FakeSecretGenerator(inMemoryManagerRepository)
    sut = new GenerateSecretToTwoFactorAuthUseCase(
      inMemoryManagerRepository,
      fakeSecretGenerator,
    );
  });
  it('should be able authenticate a manager', async () => {
    const manager = makeManager({
      email: 'jhondoe@example.com',
      password: await fakeHasher.hash('123456'),
      isTwoFactorAuthenticationEnabled: false
    });

    inMemoryManagerRepository.items.push(manager);

    const result = await sut.execute({
      managerId: manager.id.toString()
    });

    expect(result.isRight()).toBe(true);
    expect(result.value).toEqual({
      otpAuthUrl: "test-url"
    });
  });
});
