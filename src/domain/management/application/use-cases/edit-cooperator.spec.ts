import { InMemoryCooperatorRepository } from "test/repositories/in-memory-cooperator-repository"
import { makeCooperator } from "test/factories/make-cooperator"
import { AlreadyExistsError } from "./errors/already-exist-error"
import { EditCooperatorUseCase } from "./edit-cooperator"
import { InMemoryCooperatorEquipmentRepository } from "test/repositories/in-memory-cooperator-equipment-repository"

let inMemoryCooperatorRepository: InMemoryCooperatorRepository
let inMemoryCooperatorEquipmentRepository: InMemoryCooperatorEquipmentRepository
let sut: EditCooperatorUseCase

describe('Edit Cooperator', () => {
  beforeEach(() => {
    inMemoryCooperatorRepository = new InMemoryCooperatorRepository()
    inMemoryCooperatorEquipmentRepository = new InMemoryCooperatorEquipmentRepository()
    sut = new EditCooperatorUseCase(inMemoryCooperatorRepository)
  })
  it('should be able Edit a cooperator', async () => {
    const cooperator = makeCooperator()

    await inMemoryCooperatorRepository.create(cooperator)

    const result = await sut.execute({
      email: "jhondoe@example.com",
      employeeId: "1234",
      name: "Jhon Doe",
      cooperatorId: cooperator.id.toString(),
      userName: "DOEJ",
      phone: "1234567"
    })

    expect(result.isRight()).toBe(true)
  })

  it('should not be able Register a cooperator with same email', async () => {
    const cooperator = makeCooperator()

    const cooperator2 = makeCooperator({
      email: "jhondoe@example.com",
    })

    await inMemoryCooperatorRepository.create(cooperator)
    await inMemoryCooperatorRepository.create(cooperator2)

    const result = await sut.execute({
      email: "jhondoe@example.com",
      employeeId: "1234",
      name: "Jhon Doe",
      userName: "DOEJ",
      cooperatorId: cooperator.id.toString(),
      phone: "1234567"
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(AlreadyExistsError)
  })
})