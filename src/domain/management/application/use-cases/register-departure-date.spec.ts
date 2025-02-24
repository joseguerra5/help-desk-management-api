import { InMemoryCooperatorRepository } from "test/repositories/in-memory-cooperator-repository"
import { makeCooperator } from "test/factories/make-cooperator"
import { AlreadyExistsError } from "./errors/already-exist-error"
import { EditCooperatorUseCase } from "./edit-cooperator"
import { InMemoryCooperatorEquipmentRepository } from "test/repositories/in-memory-cooperator-equipment-repository"
import { RegisterDepartureDateUseCase } from "./register-departure-date"

let inMemoryCooperatorRepository: InMemoryCooperatorRepository
let sut: RegisterDepartureDateUseCase

describe('Register Departure Date to Cooperator', () => {
  beforeEach(() => {
    inMemoryCooperatorRepository = new InMemoryCooperatorRepository()
    sut = new RegisterDepartureDateUseCase(inMemoryCooperatorRepository)
  })
  it('should be able Register Departure Date to Cooperator', async () => {
    const cooperator = makeCooperator()

    await inMemoryCooperatorRepository.create(cooperator)

    const result = await sut.execute({
      cooperatorId: cooperator.id.toString(),
      departureDate: new Date(22, 3, 2022)
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryCooperatorRepository.items[0].departureDate).toEqual(new Date(22, 3, 2022))
  })
})