import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { CooperatorEquipment } from "@/domain/management/enterprise/entities/cooperator-equipment";
import { LoanRecord, LoanRecordProps, RecordType } from "@/domain/management/enterprise/entities/loan-record";
import { faker } from "@faker-js/faker"
import { makeCooperatorEquipment } from "./make-cooperator-equipment";

export function makeLoanRecord(
  override: Partial<LoanRecordProps> = {},
  id?: UniqueEntityId
) {
  const loanTypes: RecordType[] = ["CHECK_IN", "CHECK_OUT"]

  const loanrecord = LoanRecord.create({
    cooperatorId: new UniqueEntityId(),
    madeBy: new UniqueEntityId(),
    equipments: [makeCooperatorEquipment({ cooperatorId: id, equipmentId: new UniqueEntityId() })],
    type: override.type ?? faker.helpers.arrayElement(loanTypes),
    ...override
  }, id)
  return loanrecord
}