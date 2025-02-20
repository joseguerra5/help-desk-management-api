import { InMemoryManagerRepository } from "test/repositories/in-memory-manager-repository"
import { FakeHasher } from "test/cryptography/fake-hasher"
import { makeManager } from "test/factories/make-manager"
import { AlreadyExistsError } from "./errors/already-exist-error"
import { EditManagerUseCase } from "./edit-manager"

let inMemoryManagerRepository: InMemoryManagerRepository
let fakeHasher: FakeHasher
let fakeEncrypter: FakeHasher
let sut: EditManagerUseCase

describe('Edit Manager', () => {
  beforeEach(() => {
    inMemoryManagerRepository = new InMemoryManagerRepository()
    fakeHasher = new FakeHasher()
    fakeEncrypter = new FakeHasher()
    sut = new EditManagerUseCase(inMemoryManagerRepository, fakeHasher, fakeEncrypter)
  })
  it('should be able Edit a manager', async () => {
    const manager = makeManager({
      password: "123456-hashed"
    })

    await inMemoryManagerRepository.create(manager)

    const result = await sut.execute({
      email: "jhondoe@example.com",
      employeeId: "1234",
      name: "Jhon Doe",
      password: "123456",
      managerId: manager.id.toString(),
      userName: "DOEJ"
    })

    expect(result.isRight()).toBe(true)
  })

  it('should not be able Register a manager with same email', async () => {
    const manager = makeManager({
      password: "123456-hashed"
    })

    const manager2 = makeManager({
      email: "jhondoe@example.com",
    })

    await inMemoryManagerRepository.create(manager)
    await inMemoryManagerRepository.create(manager2)

    const result = await sut.execute({
      email: "jhondoe@example.com",
      employeeId: "1234",
      name: "Jhon Doe",
      password: "123456",
      userName: "DOEJ",
      managerId: manager.id.toString()
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(AlreadyExistsError)
  })
})