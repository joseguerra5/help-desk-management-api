import { InMemoryManagerRepository } from "test/repositories/in-memory-manager-repository"
import { AuthenticateManagerUseCase } from "./authenticate-manager"
import { FakeHasher } from "test/cryptography/fake-hasher"
import { makeManager } from "test/factories/make-manager"
import { FakeEncrypter } from "test/cryptography/fake-encrypter"


let inMemoryManagerRepository: InMemoryManagerRepository
let fakeHasher: FakeHasher
let fakeEncrypter: FakeEncrypter
let sut: AuthenticateManagerUseCase

describe('Authenticate manager', () => {
  beforeEach(() => {
    inMemoryManagerRepository = new InMemoryManagerRepository()
    fakeHasher = new FakeHasher(),
      fakeEncrypter = new FakeEncrypter(),
      sut = new AuthenticateManagerUseCase(inMemoryManagerRepository, fakeHasher, fakeEncrypter)
  })
  it('should be able authenticate a manager', async () => {
    const manager = makeManager({
      email: "jhondoe@example.com",
      password: await fakeHasher.hash("123456")
    })

    inMemoryManagerRepository.items.push(manager)

    const result = await sut.execute({
      email: "jhondoe@example.com",
      password: "123456",
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual({
      accessToken: expect.any(String)
    })

  })
})
