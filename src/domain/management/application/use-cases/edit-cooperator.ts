import { Either, left, right } from "@/core/either"
import { Cooperator } from "../../enterprise/entities/cooperator"
import { AlreadyExistsError } from "./errors/already-exist-error"
import { Injectable } from "@nestjs/common"
import { CooperatorRepository } from "../repositories/cooperator-repository"
import { ResourceNotFoundError } from "./errors/resource-not-found-error"
import { CooperatorEquipment } from "../../enterprise/entities/cooperator-equipment"
import { InventoryList } from "../../enterprise/entities/inventory-list"
import { CooperatorEquipmentRepository } from "../repositories/cooperator-equipment-repository"
import { UniqueEntityId } from "@/core/entities/unique-entity-id"

interface EditCooperatorUseCaseRequest {
  cooperatorId: string
  name: string,
  userName: string,
  employeeId: string,
  email: string,
  phone: string,
  equipmentsIds: string[]
}

type EditCooperatorUseCaseReponse = Either<AlreadyExistsError, {
  cooperator: Cooperator
}>

@Injectable()
export class EditCooperatorUseCase {
  constructor(
    private cooperatorRepository: CooperatorRepository,
    private cooperatorEquipmentRepository: CooperatorEquipmentRepository,
  ) { }
  async execute({
    cooperatorId,
    name,
    userName,
    employeeId,
    email,
    equipmentsIds,
  }: EditCooperatorUseCaseRequest): Promise<EditCooperatorUseCaseReponse> {
    const cooperator = await this.cooperatorRepository.findById(cooperatorId)

    if (!cooperator) {
      return left(new ResourceNotFoundError("Cooperator", cooperatorId))
    }

    if (cooperator.email !== email) {
      const cooperatorWithSameEmail = await this.cooperatorRepository.findByEmail(email)

      if (cooperatorWithSameEmail) {
        return left(new AlreadyExistsError("Cooperator", email))
      }

      cooperator.email = email
    }

    if (cooperator.employeeId.toString() !== employeeId) {
      const cooperatorWithSameemployeeId = await this.cooperatorRepository.findByEmployeeId(employeeId)

      if (cooperatorWithSameemployeeId) {
        return left(new AlreadyExistsError("Cooperator", employeeId))
      }

      cooperator.employeeId = employeeId
    }

    const currentEquipmentList = await this.cooperatorEquipmentRepository.findManyByCooperatorId(cooperatorId)

    const equipmentList = new InventoryList(currentEquipmentList)

    const equipments = equipmentsIds.map(equipmentId => {
      return CooperatorEquipment.create({
        cooperatorId: cooperator.id,
        equipmentId: new UniqueEntityId(equipmentId)
      })
    })

    equipmentList.update(equipments)

    cooperator.inventory = equipmentList

    cooperator.name = name
    cooperator.userName = userName

    await this.cooperatorRepository.save(cooperator)

    return right({
      cooperator
    })
  }
}