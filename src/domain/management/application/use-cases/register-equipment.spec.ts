import { RegisterEquipmentUseCase } from "./register-equipment"
import { makeEquipment } from "test/factories/make-equipment"
import { AlreadyExistsError } from "./errors/already-exist-error"
import { InMemoryEquipmentRepository } from "test/repositories/in-memory-equipments-repository"

let inMemoryEquipmentRepository: InMemoryEquipmentRepository
let sut: RegisterEquipmentUseCase

describe('Register Equipments', () => {
  beforeEach(() => {
    inMemoryEquipmentRepository = new InMemoryEquipmentRepository()
    sut = new RegisterEquipmentUseCase(inMemoryEquipmentRepository)
  })
  it('should be able Register a equipment', async () => {
    const result = await sut.execute({
      name: "test",
      serialNumber: "test-2",
      type: "COMPUTER"
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual({ equipment: inMemoryEquipmentRepository.items[0] })
  })

  it('should not be able Register a equipment with same serian number', async () => {
    const equipment = makeEquipment({
      serialNumber: "test"
    })

    await inMemoryEquipmentRepository.create(equipment)

    const result = await sut.execute({
      name: "test",
      serialNumber: "test",
      type: "COMPUTER"
    })


    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(AlreadyExistsError)
  })
})