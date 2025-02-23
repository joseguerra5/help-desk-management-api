import { Either, left, right } from "@/core/either"
import { AlreadyExistsError } from "./errors/already-exist-error"
import { Injectable } from "@nestjs/common"
import { CooperatorRepository } from "../repositories/cooperator-repository"
import { InventoryList } from "../../enterprise/entities/inventory-list"
import { CooperatorEquipmentRepository } from "../repositories/cooperator-equipment-repository"
import { CooperatorEquipment } from "../../enterprise/entities/cooperator-equipment"
import { ResourceNotFoundError } from "./errors/resource-not-found-error"
import { UniqueEntityId } from "@/core/entities/unique-entity-id"
import { LoanRecord } from "../../enterprise/entities/loan-record"
import { Cooperator } from "../../enterprise/entities/cooperator"
import { LoanRecordRepository } from "../repositories/loan-record-repository"

interface RegisterInventoryUseCaseRequest {
  equipmentsIds: string[]
  cooperatorId: string
  managerId: string
}

type RegisterInventoryUseCaseReponse = Either<AlreadyExistsError, {
  cooperator: Cooperator
}>

@Injectable()
export class RegisterInventoryUseCase {
  constructor(
    private cooperatorRepository: CooperatorRepository,
    private cooperatorEquipmentRepository: CooperatorEquipmentRepository,
    private loanRecordRepository: LoanRecordRepository,
  ) { }
  async execute({
    equipmentsIds,
    cooperatorId,
    managerId,
  }: RegisterInventoryUseCaseRequest): Promise<RegisterInventoryUseCaseReponse> {
    const cooperator = await this.cooperatorRepository.findById(cooperatorId)

    if (!cooperator) {
      return left(new ResourceNotFoundError("Cooperator", cooperatorId))
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

    if (equipmentList.getNewItems().length > 0) {
      const newEquipmentsItems = equipmentList.getNewItems()

      const equipments = newEquipmentsItems.map(newEquipmentItem => {
        return CooperatorEquipment.create({
          cooperatorId: cooperator.id,
          equipmentId: newEquipmentItem.id
        })
      })

      const loanRecord = LoanRecord.create({
        cooperatorId: cooperator.id,
        equipments: equipments,
        madeBy: new UniqueEntityId(managerId),
        type: "CHECK_IN",
      })

      await this.loanRecordRepository.create(loanRecord)
    }

    if (equipmentList.getRemovedItems().length > 0) {
      const newEquipmentsItems = equipmentList.getRemovedItems()

      const equipments = newEquipmentsItems.map(newEquipmentItem => {
        return CooperatorEquipment.create({
          cooperatorId: cooperator.id,
          equipmentId: newEquipmentItem.id
        })
      })

      const loanRecord = LoanRecord.create({
        cooperatorId: cooperator.id,
        equipments: equipments,
        madeBy: new UniqueEntityId(managerId),
        type: "CHECK_OUT",
      })

      await this.loanRecordRepository.create(loanRecord)
    }


    cooperator.inventory = equipmentList

    await this.cooperatorRepository.save(cooperator)

    return right({
      cooperator
    })
  }
}