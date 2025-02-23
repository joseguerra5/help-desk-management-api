import { Either, left, right } from "@/core/either"
import { AlreadyExistsError } from "./errors/already-exist-error"
import { Injectable } from "@nestjs/common"
import { Equipment } from "../../enterprise/entities/equipment"
import { ResourceNotFoundError } from "./errors/resource-not-found-error"
import { EquipmentType } from "../../enterprise/entities/equipment"
import { EquipmentRepository } from "../repositories/equipment-repository"

interface RegisterEquipmentUseCaseRequest {
  type: EquipmentType
  name: string
  serialNumber: string
}

type RegisterEquipmentUseCaseReponse = Either<AlreadyExistsError | ResourceNotFoundError, {
  equipment: Equipment
}>

@Injectable()
export class RegisterEquipmentUseCase {
  constructor(
    private equipmentRepository: EquipmentRepository,
  ) { }
  async execute({
    name,
    serialNumber,
    type,
  }: RegisterEquipmentUseCaseRequest): Promise<RegisterEquipmentUseCaseReponse> {
    const equipmentWithSameSN = await this.equipmentRepository.findBySerialNumber(serialNumber)

    if (equipmentWithSameSN) {
      return left(new AlreadyExistsError("Equipment", serialNumber))
    }


    const equipment = Equipment.create({
      name,
      serialNumber,
      type
    })

    await this.equipmentRepository.create(equipment)


    return right({
      equipment
    })
  }
}