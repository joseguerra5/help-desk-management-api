import { LoanRecord } from "@/domain/management/enterprise/entities/loan-record";
import { EquipmentPresenter } from "./inventory-presenter";

export class LoanRecordPresenter {
  static toHTTP(loanRecord: LoanRecord) {
    return {
      cooperatorId: loanRecord.cooperatorId.toString(),
      madeBy: loanRecord.madeBy.toString(),
      type: loanRecord.type,
      equipments: loanRecord.equipments ? loanRecord.equipments.map(EquipmentPresenter.toHTTP) : null,
      ocurredAt: loanRecord.ocurredAt,
      attachment: loanRecord.attachment,
    }
  }
}