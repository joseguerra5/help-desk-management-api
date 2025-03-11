import { LoanRecord } from "@/domain/management/enterprise/entities/loan-record";

export class LoanRecordPresenter {
  static toHTTP(loanrecord: LoanRecord) {
    return {
      id: loanrecord.id.toString(),
      cooperatorId: loanrecord.cooperatorId.toString(),
      madeBy: loanrecord.madeBy?.toString(),
      type: loanrecord.type,
      equipments: loanrecord.equipments,
      ocurredAt: loanrecord.ocurredAt,
      attachment: loanrecord.attachment
        ? {
          id: loanrecord.attachment.id.toString(),
          url: loanrecord.attachment.attachmentId.toString(),
        }
        : null,
    }
  }
}