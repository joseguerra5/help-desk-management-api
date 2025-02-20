import { InMemoryCooperatorRepository } from "test/repositories/in-memory-cooperator-repository"
import { RegisterCooperatorUseCase } from "./register-cooperator"
import { makeCooperator } from "test/factories/make-cooperator"
import { AlreadyExistsError } from "./errors/already-exist-error"

let inMemoryCooperatorRepository: InMemoryCooperatorRepository
let sut: RegisterCooperatorUseCase

describe('Register Cooperator', () => {
  beforeEach(() => {
    inMemoryCooperatorRepository = new InMemoryCooperatorRepository()
    sut = new RegisterCooperatorUseCase(inMemoryCooperatorRepository)
  })
  it('should be able Register a cooperator', async () => {
    const result = await sut.execute({
      email: "jhondoe@example.com",
      employeeId: "1234",
      name: "Jhon Doe",
      userName: "DOEJ",
      phone: "123456789",
      equipmentIds: ["1", "2"]
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual({ cooperator: inMemoryCooperatorRepository.items[0] })
  })

  it('should not be able Register a cooperator with same employee Id', async () => {
    const cooperator = makeCooperator({
      employeeId: "1234"
    })

    await inMemoryCooperatorRepository.create(cooperator)

    const result = await sut.execute({
      email: "jhondoe@example.com",
      employeeId: "1234",
      name: "Jhon Doe",
      userName: "DOEJ",
      phone: "123456789",
      equipmentIds: ["1", "2"]
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(AlreadyExistsError)
  })
})