import { RegisterInventoryUseCase } from "./register-inventory-equipments"
import { InMemoryCooperatorRepository } from "test/repositories/in-memory-cooperator-repository"
import { InMemoryCooperatorEquipmentRepository } from "test/repositories/in-memory-cooperator-equipment-repository"
import { InMemoryLoanRecordRepository } from "test/repositories/in-memory-loan-record-repository"
import { makeCooperator } from "test/factories/make-cooperator"
import { InventoryList } from "../../enterprise/entities/inventory-list"
import { makeCooperatorEquipment } from "test/factories/make-cooperator-equipment"
import { UniqueEntityId } from "@/core/entities/unique-entity-id"
import { LinkAttachmentToLoanRecordUseCase } from "./link-attachment-to-loan-record"
import { makeLoanRecord } from "test/factories/make-loan-record"
import { makeAttachment } from "test/factories/make-attachment"
import { InMemoryAttachmentRepository } from "test/repositories/in-memory-attachment-repository"


let inMemoryLoanRecordRepository: InMemoryLoanRecordRepository
let inMemoryCooperatorRepository: InMemoryCooperatorRepository
let inMemoryAttachmentRepository: InMemoryAttachmentRepository
let sut: LinkAttachmentToLoanRecordUseCase

describe('Register inventory', () => {
  beforeEach(() => {

    inMemoryLoanRecordRepository = new InMemoryLoanRecordRepository()
    inMemoryCooperatorRepository = new InMemoryCooperatorRepository()
    inMemoryAttachmentRepository = new InMemoryAttachmentRepository()
    sut = new LinkAttachmentToLoanRecordUseCase(inMemoryLoanRecordRepository, inMemoryCooperatorRepository)
  })
  it('should be able Register a inventory and loanRecord', async () => {
    const cooperator = makeCooperator()

    await inMemoryCooperatorRepository.create(cooperator)

    const loanRecord = makeLoanRecord({
      cooperatorId: cooperator.id
    })

    await inMemoryLoanRecordRepository.create(loanRecord)

    const attachment = makeAttachment()

    await inMemoryAttachmentRepository.create(attachment)



    await inMemoryCooperatorRepository.create(cooperator)
    const result = await sut.execute({
      cooperatorId: cooperator.id.toString(),
      attachmentId: attachment.id.toString(),
      loanRecordId: loanRecord.id.toString(),
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryLoanRecordRepository.items[0].attachment).toMatchObject(
      expect.objectContaining({
        attachmentId: attachment.id,
      })
    )
  })
})