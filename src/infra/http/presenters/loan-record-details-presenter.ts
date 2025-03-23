import { LoanRecordDetails } from "@/domain/management/enterprise/entities/value-objects/loan-record-details";
import { EquipmentPresenter } from "./inventory-presenter";

export class LoanRecordDetailsPresenter {
  static toHTTP(loanRecord: LoanRecordDetails) {
    return {
      loanrecordId: loanRecord.loanRecordId.toString(),
      cooperator: {
        id: loanRecord.cooperator.id.toString(),
        name: loanRecord.cooperator.name,
        userName: loanRecord.cooperator.userName,
        employeeId: loanRecord.cooperator.employeeId,
        departureDate: loanRecord.cooperator.departureDate,
        nif: loanRecord.cooperator.nif
      },
      madeBy: {
        id: loanRecord.madeBy.id.toString(),
        name: loanRecord.madeBy.name,
        userName: loanRecord.madeBy.userName,
        employeeId: loanRecord.madeBy.employeeId,
      },
      type: loanRecord.type,
      equipments: loanRecord.equipments.map(EquipmentPresenter.toHTTPCooperatorEquipment),
      ocurredAt: loanRecord.ocurredAt,
      attachment: loanRecord.attachment.length > 0 ? {
        id: loanRecord.attachment[0].id,
        title: loanRecord.attachment[0].title,
        url: loanRecord.attachment[0].url,
        id: loanRecord.attachment[0].id
      } : null,
    }
  }
}