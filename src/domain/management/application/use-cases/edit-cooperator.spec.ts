import { InMemoryCooperatorRepository } from "test/repositories/in-memory-cooperator-repository"
import { FakeHasher } from "test/cryptography/fake-hasher"
import { makeCooperator } from "test/factories/make-cooperator"
import { AlreadyExistsError } from "./errors/already-exist-error"
import { EditCooperatorUseCase } from "./edit-cooperator"

let inMemoryCooperatorRepository: InMemoryCooperatorRepository
let inMemoryCooperatorEquipmentRepository: InMemoryCooperatorEquipmentRepository
let sut: EditCooperatorUseCase

describe('Edit Cooperator', () => {
  beforeEach(() => {
    inMemoryCooperatorRepository = new InMemoryCooperatorRepository()
    sut = new EditCooperatorUseCase(inMemoryCooperatorRepository)
  })
  it('should be able Edit a cooperator', async () => {
    const cooperator = makeCooperator({
      password: "123456-hashed"
    })

    await inMemoryCooperatorRepository.create(cooperator)

    const result = await sut.execute({
      email: "jhondoe@example.com",
      employeeId: "1234",
      name: "Jhon Doe",
      password: "123456",
      cooperatorId: cooperator.id.toString(),
      userName: "DOEJ"
    })

    expect(result.isRight()).toBe(true)
  })

  it('should not be able Register a cooperator with same email', async () => {
    const cooperator = makeCooperator({
      password: "123456-hashed"
    })

    const cooperator2 = makeCooperator({
      email: "jhondoe@example.com",
    })

    await inMemoryCooperatorRepository.create(cooperator)
    await inMemoryCooperatorRepository.create(cooperator2)

    const result = await sut.execute({
      email: "jhondoe@example.com",
      employeeId: "1234",
      name: "Jhon Doe",
      password: "123456",
      userName: "DOEJ",
      cooperatorId: cooperator.id.toString()
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(AlreadyExistsError)
  })
})